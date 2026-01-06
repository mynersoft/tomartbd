// components/FancyLoader.jsx
import React from 'react';
import styles from './FancyLoader.module.css';

const FancyLoader = ({
  theme = 'light',
  logo = null,
  message = 'Please wait...',
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`${styles.fancyLoader} ${isDark ? styles.dark : styles.light}`}
    >
      <div className={styles.orbitContainer}>
        <div className={styles.centralOrb}>
          {<p className="text-white font-bold">Tomartbd </p> || (
            <div className={styles.defaultLogo}>⚡</div>
          )}
        </div>
        <div className={styles.orbitingOrb}></div>
        <div
          className={styles.orbitingOrb}
          style={{ animationDelay: '-1s' }}
        ></div>
        <div
          className={styles.orbitingOrb}
          style={{ animationDelay: '-1.5s' }}
        ></div>
        <div
          className={styles.orbitingOrb}
          style={{ animationDelay: '-2s' }}
        ></div>
        <div
          className={styles.orbitingOrb}
          style={{ animationDelay: '-2.5s' }}
        ></div>
        <div
          className={styles.orbitingOrb}
          style={{ animationDelay: '-3s' }}
        ></div>
        <div
          className={styles.orbitingOrb}
          style={{ animationDelay: '-3.5s' }}
        ></div>
        <div
          className={styles.orbitingOrb}
          style={{ animationDelay: '-4s' }}
        ></div>
      
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
        <div className={styles.loadingText}>
          <span className={styles.message}>{message}</span>
        </div>
      </div>
    </div>
  );
};

export default FancyLoader;
