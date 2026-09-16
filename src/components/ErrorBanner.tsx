'use client';

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { ApiError } from '@/lib/types';

interface ErrorBannerProps {
  error: ApiError;
  onRetry: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onRetry }) => {
  return (
    <div
      style={{
        margin: '12px 0',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--accent-ruby-soft)',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AlertCircle size={18} color="var(--accent-ruby)" />
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fca5a5' }}>
            Request Notice ({error.code})
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {error.message}
          </div>
        </div>
      </div>

      {error.retryable && (
        <button
          onClick={onRetry}
          id="btn-error-retry"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            color: '#fee2e2',
            fontSize: '0.8rem',
            fontWeight: 500,
          }}
        >
          <RotateCcw size={13} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
