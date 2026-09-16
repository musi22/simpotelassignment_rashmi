'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface QuickQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
  language?: 'en' | 'hi';
}

const SUGGESTIONS_EN = [
  'What time is check-in and check-out?',
  'Does the hotel have a swimming pool?',
  'Which room is suitable for three guests?',
  'Is breakfast included?',
  'What is the cancellation policy?',
  'Check room availability',
];

const SUGGESTIONS_HI = [
  'चेक-इन और चेक-आउट का समय क्या है?',
  'क्या होटल में स्विमिंग पूल है?',
  '3 मेहमानों के लिए कौन सा कमरा सही रहेगा?',
  'क्या नाश्ता (Breakfast) शामिल है?',
  'होटल की कैंसिलेशन पॉलिसी क्या है?',
  'कमरे की उपलब्धता चेक करें',
];

export const QuickQuestions: React.FC<QuickQuestionsProps> = ({
  onSelect,
  disabled,
  language = 'en',
}) => {
  const suggestions = language === 'hi' ? SUGGESTIONS_HI : SUGGESTIONS_EN;
  const heading = language === 'hi' ? 'मीना से तुरंत पूछें' : 'Quickly Ask Meena';

  return (
    <div style={{ marginTop: '16px', marginBottom: '8px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.8rem',
          color: 'var(--accent-gold)',
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontWeight: 700,
        }}
      >
        <span>🌸</span>
        <span>{heading}</span>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {suggestions.map((q, idx) => (
          <button
            key={`${language}-${idx}`}
            id={`quick-question-${idx}`}
            onClick={() => onSelect(q)}
            disabled={disabled}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: 'var(--radius-full)',
              background: '#ffffff',
              border: '1px solid var(--border-card)',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 500,
              textAlign: 'left',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.6 : 1,
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.background = '#fff0ea';
                e.currentTarget.style.color = 'var(--accent-gold)';
                e.currentTarget.style.borderColor = 'var(--accent-gold)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled) {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-card)';
                e.currentTarget.style.transform = 'none';
              }
            }}
          >
            <HelpCircle size={13} color="var(--accent-gold)" />
            <span>{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
