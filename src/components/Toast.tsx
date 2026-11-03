'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

export interface ToastItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <div className={styles.iconBox}>
            {toast.type === 'success' && <CheckCircle2 size={16} />}
            {toast.type === 'error' && <AlertCircle size={16} />}
            {toast.type === 'info' && <Info size={16} />}
          </div>
          <p className={styles.msg}>{toast.message}</p>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
