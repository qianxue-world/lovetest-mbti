import React from 'react';
import { useTranslation } from 'react-i18next';
import { questions } from '../data/questions';
import { questionsZh } from '../data/questions.zh';
import { questionsJa } from '../data/questions.ja';
import { Trait } from '../types';
import './QuestionScreen.css';

interface QuestionScreenProps {
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (trait: Trait) => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  currentQuestion,
  totalQuestions,
  onAnswer,
}) => {
  const { i18n } = useTranslation();
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  
  // Select questions based on current language
  const getQuestions = () => {
    switch (i18n.language) {
      case 'zh':
        return questionsZh;
      case 'ja':
        return questionsJa;
      default:
        return questions; // English
    }
  };
  
  const currentQuestions = getQuestions();
  const questionData = currentQuestions[currentQuestion];
  
  if (!questionData) {
    return <div>Question not found</div>;
  }

  return (
    <div className="question-screen">
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-text">
          {currentQuestion + 1} / {totalQuestions}
        </div>
      </div>
      <div className="question-container">
        <h2>{questionData.question}</h2>
        <div className="options">
          {questionData.options.map((option, index) => (
            <div
              key={index}
              className="option-btn"
              onClick={() => onAnswer(option.trait)}
            >
              {option.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
