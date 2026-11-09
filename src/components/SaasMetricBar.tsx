'use client';

import React from 'react';
import { Sparkles, Radio, Zap, Command, Volume2 } from 'lucide-react';
import styles from './SaasMetricBar.module.css';

interface SaasMetricBarProps {
  onOpenCommandPalette: () => void;
}

export const SaasMetricBar: React.FC<SaasMetricBarProps> = ({ onOpenCommandPalette }) => {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.metricsGroup}>
          <div className={styles.metricItem}>
            <span className={styles.dotLive} />
            <span>Agent Mesh:</span>
            <span className={styles.labelBold}>4 Agents Online</span>
          </div>

          <span className={styles.separator}>•</span>

          <div className={styles.metricItem}>
            <Volume2 size={13} style={{ color: '#059669' }} />
            <span>Voice Studio:</span>
            <span className={styles.labelBold}>Neural Aria & Neerja Active</span>
          </div>

          <span className={styles.separator}>•</span>

          <div className={styles.metricItem}>
            <Zap size={13} style={{ color: '#000000' }} />
            <span>Synthesis Latency:</span>
            <span className={styles.labelBold}>~1.6s</span>
          </div>
        </div>

        <div className={styles.quickActionWrap}>
          <button
            type="button"
            className={styles.cmdKBtn}
            onClick={onOpenCommandPalette}
            title="Open command palette (Ctrl+K or ⌘K)"
          >
            <Command size={11} />
            <span>Command Palette</span>
            <span className={styles.kbd}>⌘K</span>
          </button>
        </div>
      </div>
    </div>
  );
};
