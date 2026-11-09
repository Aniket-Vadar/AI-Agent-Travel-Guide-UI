'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import styles from './AuthModal.module.css';
import { useAuth } from '@/context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    setAuthModalMode,
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
    resetPassword,
    isConfigured,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Reset state on open or mode switch
  useEffect(() => {
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [authModalMode, isAuthModalOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (authModalMode === 'signin') {
        const { error } = await signInWithEmail(email, password);
        if (error) setErrorMsg(error.message);
      } else if (authModalMode === 'signup') {
        const { error, needsEmailConfirmation } = await signUpWithEmail(email, password, fullName);
        if (error) {
          setErrorMsg(error.message);
        } else if (needsEmailConfirmation) {
          setSuccessMsg('Account created! Please check your email to verify your account before signing in.');
        }
      } else if (authModalMode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('Password reset instructions sent. Please check your inbox.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) setErrorMsg(error.message);
    } catch (err: any) {
      setErrorMsg(err.message || 'Social sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={closeAuthModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={closeAuthModal}
          aria-label="Close auth modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.brandBadge}>
            <Sparkles size={11} />
            <span>Wayfarer ID</span>
          </div>
          <h2 className={styles.title}>
            {authModalMode === 'signin' && 'Welcome Back'}
            {authModalMode === 'signup' && 'Create Your Account'}
            {authModalMode === 'forgot' && 'Reset Password'}
          </h2>
          <p className={styles.subtitle}>
            {authModalMode === 'signin' && 'Sign in to access your saved itineraries and bespoke guides.'}
            {authModalMode === 'signup' && 'Unlock personalized AI trip plans, audiobooks, and PDF dossiers.'}
            {authModalMode === 'forgot' && 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* Tab Switcher (Sign In / Sign Up) */}
        {authModalMode !== 'forgot' && (
          <div className={styles.tabSwitch}>
            <button
              type="button"
              className={`${styles.tabBtn} ${authModalMode === 'signin' ? styles.tabBtnActive : ''}`}
              onClick={() => setAuthModalMode('signin')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${authModalMode === 'signup' ? styles.tabBtnActive : ''}`}
              onClick={() => setAuthModalMode('signup')}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Alerts */}
        {errorMsg && (
          <div className={styles.errorAlert}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className={styles.successAlert}>
            <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Social Logins */}
        {authModalMode !== 'forgot' && (
          <>
            <div className={styles.socialButtons}>
              <button
                type="button"
                className={styles.socialBtn}
                onClick={() => handleOAuth('google')}
                disabled={loading}
              >
                <svg className={styles.socialIcon} viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                className={styles.socialBtn}
                onClick={() => handleOAuth('github')}
                disabled={loading}
              >
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </div>

            <div className={styles.divider}>
              <span className={styles.dividerLine} />
              <span>or continue with email</span>
              <span className={styles.dividerLine} />
            </div>
          </>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {authModalMode === 'signup' && (
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <div className={styles.inputWrap}>
                <UserIcon size={16} className={styles.inputIcon} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Traveler"
                  className={styles.input}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrap}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {authModalMode !== 'forgot' && (
            <div className={styles.field}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className={styles.label}>Password</label>
                {authModalMode === 'signin' && (
                  <button
                    type="button"
                    className={styles.forgotBtn}
                    onClick={() => setAuthModalMode('forgot')}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={authModalMode === 'signup' ? 'Min 6 characters' : 'Enter password'}
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>
                {authModalMode === 'signin' && 'Sign In to Wayfarer'}
                {authModalMode === 'signup' && 'Create Free Account'}
                {authModalMode === 'forgot' && 'Send Reset Instructions'}
              </span>
            )}
          </button>
        </form>

        {authModalMode === 'forgot' && (
          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <button
              type="button"
              className={styles.forgotBtn}
              onClick={() => setAuthModalMode('signin')}
            >
              ← Back to Sign In
            </button>
          </div>
        )}

        {/* Informative Supabase configuration hint if keys are not filled yet */}
        {!isConfigured && (
          <div className={styles.unconfiguredBox}>
            <div className={styles.unconfiguredTitle}>
              <KeyRound size={14} />
              <span>Supabase Keys Required</span>
            </div>
            <p className={styles.unconfiguredText}>
              To enable live authentication with Supabase, add your project credentials to <code>.env.local</code>:
            </p>
            <div className={styles.codeBlock}>
              NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co&#10;
              NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

