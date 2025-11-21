import React from 'react';
import { useTranslation } from 'react-i18next';
import { PersonalityType, Answers } from '../types';
import { mbtiCharacters, mbtiColors } from '../data/mbtiCharacters';
import './ResultScreen.css';

interface ResultScreenProps {
  personalityType: PersonalityType;
  answers?: Answers;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  personalityType,
  answers,
}) => {
  const { t } = useTranslation();
  
  const character = mbtiCharacters[personalityType] || '🎭';
  const colors = mbtiColors[personalityType] || { primary: '#FF6B9D', secondary: '#C8A2FF', gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C8A2FF 100%)' };

  // 计算每个维度的指示器位置（0-100，左边是第一个特质，右边是第二个特质）
  const calculateIndicatorPositions = () => {
    // 检查是否有有效的答案数据
    const hasValidAnswers = answers && (
      answers.E + answers.I + answers.N + answers.S + 
      answers.T + answers.F + answers.J + answers.P
    ) > 0;

    if (!hasValidAnswers) {
      // 如果没有答案数据，根据性格类型设置默认位置
      const traits = personalityType.split('');
      return {
        EI: traits[0] === 'E' ? 25 : 75, // E人偏左(25%)，I人偏右(75%)
        NS: traits[1] === 'N' ? 25 : 75, // N人偏左(25%)，S人偏右(75%)
        TF: traits[2] === 'T' ? 25 : 75, // T人偏左(25%)，F人偏右(75%)
        JP: traits[3] === 'J' ? 25 : 75, // J人偏左(25%)，P人偏右(75%)
      };
    }
    
    const totalPerDimension = 15; // 每个维度15道题
    
    // 计算每个维度的位置
    // 注意：位置需要反转，因为左边是第一个特质(E/N/T/J)，右边是第二个特质(I/S/F/P)
    // 如果E多，应该偏左(小百分比)；如果I多，应该偏右(大百分比)
    // 所以我们用第二个特质的百分比作为位置
    const calculatePosition = (secondValue: number) => {
      // 使用第二个特质的百分比，这样第一个特质多时位置偏左，第二个特质多时位置偏右
      const percentage = Math.round((secondValue / totalPerDimension) * 100);
      // 如果正好是50%，根据实际值微调
      if (percentage === 50) {
        return secondValue > 7.5 ? 52 : 48;
      }
      return percentage;
    };

    return {
      EI: calculatePosition(answers!.I), // 用I的百分比，I多则偏右
      NS: calculatePosition(answers!.S), // 用S的百分比，S多则偏右
      TF: calculatePosition(answers!.F), // 用F的百分比，F多则偏右
      JP: calculatePosition(answers!.P), // 用P的百分比，P多则偏右
    };
  };

  const positions = calculateIndicatorPositions();

  // 调试信息
  console.log('ResultScreen - Personality Type:', personalityType);
  console.log('ResultScreen - Answers:', answers);
  console.log('ResultScreen - Indicator Positions:', positions);

  return (
    <div className="result-screen">
      {/* SVG Banner */}
      <div className="personality-banner">
        <img 
          src={`/assets/${personalityType}.svg`} 
          alt={`${personalityType} personality banner`}
          className="banner-image"
          onError={(e) => {
            // Fallback to character showcase if SVG not found
            e.currentTarget.style.display = 'none';
            const fallback = document.querySelector('.character-showcase-fallback');
            if (fallback) {
              (fallback as HTMLElement).style.display = 'flex';
            }
          }}
        />
        {/* Fallback character showcase */}
        <div className="character-showcase-fallback" style={{ background: colors.gradient, display: 'none' }}>
          <div className="character-icon">{character}</div>
          <div className="result-type-large">{personalityType}</div>
        </div>
      </div>

      {/* 性格描述 */}
      <div className="result-description">
        {/* 大号字母展示 */}
        <div className="personality-type-display">
          <div className="personality-letters" style={{ 
            background: colors.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {personalityType}
          </div>
        </div>
        <p className="personality-desc">{t(`personalities.${personalityType}.description`)}</p>
        {/* 夸夸气泡 */}
          <div className="praise-bubble">
            <span className="praise-text">{t(`personalities.${personalityType}.praise`)}</span>
          </div>
        {/* 特质数据统计 */}
        <div className="traits-section">
          <div className="traits-stats">
            {/* E vs I */}
            <div className="trait-stat-item">
              <div className="trait-stat-labels">
                <span className="trait-label">
                  <span className="trait-letter-small" style={{ color: colors.primary }}>E</span>
                  {t('traits.E.name')}
                </span>
                <span className="trait-label">
                  {t('traits.I.name')}
                  <span className="trait-letter-small" style={{ color: colors.primary }}>I</span>
                </span>
              </div>
              <div className="trait-slider">
                <div className="slider-track"></div>
                <div 
                  className="slider-indicator" 
                  style={{ 
                    left: `${positions.EI}%`,
                    background: colors.gradient 
                  }}
                ></div>
              </div>
            </div>

            {/* N vs S */}
            <div className="trait-stat-item">
              <div className="trait-stat-labels">
                <span className="trait-label">
                  <span className="trait-letter-small" style={{ color: colors.primary }}>N</span>
                  {t('traits.N.name')}
                </span>
                <span className="trait-label">
                  {t('traits.S.name')}
                  <span className="trait-letter-small" style={{ color: colors.primary }}>S</span>
                </span>
              </div>
              <div className="trait-slider">
                <div className="slider-track"></div>
                <div 
                  className="slider-indicator" 
                  style={{ 
                    left: `${positions.NS}%`,
                    background: colors.gradient 
                  }}
                ></div>
              </div>
            </div>

            {/* T vs F */}
            <div className="trait-stat-item">
              <div className="trait-stat-labels">
                <span className="trait-label">
                  <span className="trait-letter-small" style={{ color: colors.primary }}>T</span>
                  {t('traits.T.name')}
                </span>
                <span className="trait-label">
                  {t('traits.F.name')}
                  <span className="trait-letter-small" style={{ color: colors.primary }}>F</span>
                </span>
              </div>
              <div className="trait-slider">
                <div className="slider-track"></div>
                <div 
                  className="slider-indicator" 
                  style={{ 
                    left: `${positions.TF}%`,
                    background: colors.gradient 
                  }}
                ></div>
              </div>
            </div>

            {/* J vs P */}
            <div className="trait-stat-item">
              <div className="trait-stat-labels">
                <span className="trait-label">
                  <span className="trait-letter-small" style={{ color: colors.primary }}>J</span>
                  {t('traits.J.name')}
                </span>
                <span className="trait-label">
                  {t('traits.P.name')}
                  <span className="trait-letter-small" style={{ color: colors.primary }}>P</span>
                </span>
              </div>
              <div className="trait-slider">
                <div className="slider-track"></div>
                <div 
                  className="slider-indicator" 
                  style={{ 
                    left: `${positions.JP}%`,
                    background: colors.gradient 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 生活攻略 */}
        {t(`personalities.${personalityType}.lifeGuide`, { defaultValue: '' }) && (
          <div className="life-guide-section">
            <h3 className="section-title">📖 你的专属生活攻略</h3>
            <div className="life-guide-content">
              {t(`personalities.${personalityType}.lifeGuide`).split('\n\n').map((paragraph, index) => (
                <p key={index} className="guide-paragraph">{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
