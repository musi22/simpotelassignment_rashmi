'use client';

import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

interface QuickQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

const SUGGESTIONS = [
  'What time is check-in and check-out?',
  'Does the hotel have a swimming pool?',
  'Which room is suitable for three guests?',
  'Is breakfast included?',
  'What is the cancellation policy?',
  'Check room availability',
];

export const QuickQuestions: React.FC<QuickQuestionsProps> = ({ onSelect, disabled }) => {
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
        <span>Quickly Ask Meena</span>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {SUGGESTIONS.map((q, idx) => (
          <button
            key={idx}
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
