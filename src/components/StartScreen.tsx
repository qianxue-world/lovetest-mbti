import React from 'react';
import { useTranslation } from 'react-i18next';
import './StartScreen.css';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const { t } = useTranslation();

  return (
    <div className="start-screen">
      <h1>{t('start.title')}</h1>
      
      <div className="intro-section">
        <h2>{t('start.whatIsMBTI')}</h2>
        <p className="intro-text">{t('start.mbtiIntro')}</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🧠</div>
          <h3>{t('start.feature1Title')}</h3>
          <p>{t('start.feature1Desc')}</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💡</div>
          <h3>{t('start.feature2Title')}</h3>
          <p>{t('start.feature2Desc')}</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>{t('start.feature3Title')}</h3>
          <p>{t('start.feature3Desc')}</p>
        </div>
      </div>

      <div className="original-badge">
        <div className="badge-icon">✨</div>
        <div className="badge-content">
          <strong>{t('start.originalBy')}</strong>
          <p>{t('start.originalWarning')}</p>
        </div>
      </div>

      <div className="btn" onClick={onStart}>
        <p>{t('start.button')}</p>
      </div>
    </div>
  );
};
