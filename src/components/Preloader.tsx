'use client';

import React, { useEffect, useState } from 'react';
import styles from './Preloader.module.css';

export const Preloader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.inner}>
        <div className={styles.spinner} />
        <div>
          <div className={styles.brandName}>WAYFARER AI</div>
          <div className={styles.statusText}>Connecting to travel agents...</div>
        </div>
      </div>
    </div>
  );
};
