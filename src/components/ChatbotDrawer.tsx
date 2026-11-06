'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, Download, MapPin } from 'lucide-react';
import styles from './ChatbotDrawer.module.css';
import { api, ChatResponse } from '@/services/api';

interface Message {
  role: 'assistant' | 'user';
  text: string;
  isPdfCta?: boolean;
  ctaRequest?: {
    city: string;
    country: string;
    days: number;
    interests?: string[];
  };
}

interface ChatbotDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  onToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

const STARTER_PROMPTS = [
  'Plan 4 days in Kyoto for a foodie & temple lover',
  'Romantic weekend escape to Amalfi Coast',
  'Heritage & photography itinerary in Jaipur',
];

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  isOpen,
  onToggle,
  onToast,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Greetings, wanderer. I am your Wayfarer AI Concierge. Tell me your dream destination, preferred pace, or travel desires, and I will tailor an extraordinary journey.",
    },
  ]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [slots, setSlots] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const res: ChatResponse = await api.chat(textToSend, sessionId, history);
      setSessionId(res.session_id);

      if (res.slots) {
        setSlots(res.slots);
      }

      const assistantMsg: Message = {
        role: 'assistant',
        text: res.reply,
      };

      const newMsgs = [assistantMsg];

      if (res.ready_to_plan && res.suggested_request) {
        newMsgs.push({
          role: 'assistant',
          text: `I have synthesized all your requirements for ${res.suggested_request.city}! You can now generate your bespoke PDF guide immediately.`,
          isPdfCta: true,
          ctaRequest: res.suggested_request,
        });
      }

      setMessages((prev) => [...prev, ...newMsgs]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "I apologize, my satellite connection was briefly interrupted. Please ask again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCtaPdf = async (req: NonNullable<Message['ctaRequest']>) => {
    setDownloadingPdf(true);
    onToast(`Generating guide for ${req.city}... 📄`, 'info');
    try {
      const blob = await api.generatePDF(
        req.city,
        req.country,
        req.days,
        (req.interests || []).join(', ')
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${req.city}_${req.days}Day_Custom_Guide.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      onToast('Custom PDF Dossier downloaded successfully! ✨', 'success');
    } catch {
      onToast('PDF download failed. Please try from Trip Architect section.', 'error');
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (Cleanly hidden when drawer is open) */}
      <button
        type="button"
        className={`${styles.fab} ${isOpen ? styles.fabHidden : ''}`}
        onClick={onToggle}
        aria-label="Open AI Concierge"
      >
        <MessageSquare size={22} />
        <span className={styles.fabBadge}>AI</span>
      </button>

      {/* Backdrop overlay */}
      {isOpen && <div className={styles.backdrop} onClick={onToggle} />}

      {/* Slide-out Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        {/* Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <Bot size={20} />
            </div>
            <div>
              <h3 className={styles.headerTitle}>Wayfarer Concierge</h3>
              <div className={styles.headerStatus}>
                <span className={styles.statusDot}></span>
                <span>Active Intelligence</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onToggle}
            aria-label="Close Chat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Dynamic slots chip tray */}
        {Object.keys(slots).length > 0 && (
          <div className={styles.slotsTray}>
            {Object.entries(slots).map(([k, v]) => (
              <span key={k} className={styles.slotChip}>
                <strong>{k.replace(/_/g, ' ')}:</strong> {v}
              </span>
            ))}
          </div>
        )}

        {/* Message History */}
        <div className={styles.messageList} ref={scrollRef}>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`${styles.messageRow} ${
                m.role === 'user' ? styles.messageUser : styles.messageAssistant
              }`}
            >
              {m.role === 'assistant' && (
                <div className={styles.msgAvatar}>
                  <Sparkles size={14} />
                </div>
              )}
              <div
                className={`${styles.bubble} ${
                  m.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant
                }`}
              >
                <p>{m.text}</p>

                {m.isPdfCta && m.ctaRequest && (
                  <div className={styles.inChatPdfCard}>
                    <button
                      type="button"
                      className={styles.inChatPdfBtn}
                      onClick={() => handleDownloadCtaPdf(m.ctaRequest!)}
                      disabled={downloadingPdf}
                    >
                      <Download size={14} />
                      <span>
                        {downloadingPdf
                          ? 'Generating PDF...'
                          : `Download ${m.ctaRequest.city} PDF Guide`}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className={`${styles.messageRow} ${styles.messageAssistant}`}>
              <div className={styles.msgAvatar}>
                <Sparkles size={14} />
              </div>
              <div className={`${styles.bubble} ${styles.bubbleAssistant}`}>
                <div className={styles.typingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Curated inquiries starter chips */}
        {messages.length === 1 && (
          <div className={styles.starterSection}>
            <span className={styles.starterLabel}>Curated inquiries:</span>
            <div className={styles.starterPromptsList}>
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className={styles.starterBtn}
                  onClick={() => handleSend(prompt)}
                >
                  <Sparkles size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Input Form */}
        <form
          className={styles.inputForm}
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            className={styles.chatInput}
            placeholder="Ask about any city, packing tips, or travel plan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  );
};
