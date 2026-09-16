'use client';

import React, { useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { ChatInterface } from './ChatInterface';

interface AssistantWidgetProps {
  hotelName: string;
  isOpen: boolean;
  onToggle: () => void;
  initialPrompt?: string;
}

export const AssistantWidget: React.FC<AssistantWidgetProps> = ({
  hotelName,
  isOpen,
  onToggle,
  initialPrompt,
}) => {
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  return (
    <>
      {/* Floating launcher button in bottom right corner with Meena greeting popup */}
      {!isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 90,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '10px',
          }}
        >
          {/* Pop-up bubble: "Hi this is Meena, how could I help you?" */}
          <div
            onClick={onToggle}
            style={{
              cursor: 'pointer',
              background: '#ffffff',
              color: 'var(--text-primary)',
              padding: '10px 16px',
              borderRadius: '16px 16px 4px 16px',
              border: '1px solid var(--border-card)',
              boxShadow: '0 8px 24px rgba(180, 93, 67, 0.16)',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              maxWidth: '280px',
              animation: 'shimmer 2s infinite ease-in-out',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>🌸</span>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--accent-gold)', fontSize: '0.82rem' }}>
                Meena • Guest Concierge
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>
                Hi, this is Meena! How could I help you today?
              </div>
            </div>
          </div>

          {/* Launcher button */}
          <button
            onClick={onToggle}
            id="btn-open-concierge-widget"
            aria-label="Open Meena Guest Concierge"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 22px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #c86d51 0%, #b45d43 100%)',
              color: '#ffffff',
              boxShadow: '0 8px 28px rgba(200, 109, 81, 0.35)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
              }}
            >
              🌸
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                Chat with Meena
              </div>
              <div style={{ fontSize: '0.72rem', color: '#ffe5dd', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#4ade80' }} />
                Online • Guest Concierge
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Floating Concierge Chat Window */}
      {isOpen && (
        <div
          id="concierge-widget-window"
          style={{
            position: 'fixed',
            bottom: isMaximized ? '0' : '24px',
            right: isMaximized ? '0' : '24px',
            width: isMaximized ? '100vw' : '480px',
            height: isMaximized ? '100vh' : '650px',
            maxHeight: isMaximized ? '100vh' : 'calc(100vh - 48px)',
            maxWidth: isMaximized ? '100vw' : 'calc(100vw - 48px)',
            zIndex: 95,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: isMaximized ? '0' : 'var(--radius-lg)',
            boxShadow: '0 20px 60px rgba(110, 50, 40, 0.22), 0 4px 20px rgba(0,0,0,0.08)',
            border: isMaximized ? 'none' : '1px solid var(--border-card)',
            background: '#ffffff',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Window Header */}
          <div
            style={{
              padding: '14px 20px',
              background: 'linear-gradient(90deg, #fff5f2 0%, #fdf0eb 100%)',
              borderBottom: '1px solid var(--border-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>🌸</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--text-primary)' }}>
                  Meena — Guest Concierge
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)' }} />
                  The Grand Azure Resort & Spa • Monterey Bay
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setIsMaximized((prev) => !prev)}
                aria-label={isMaximized ? 'Restore window size' : 'Maximize window'}
                style={{
                  color: 'var(--text-secondary)',
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              <button
                onClick={onToggle}
                id="btn-close-concierge-widget"
                aria-label="Close concierge assistant"
                style={{
                  color: 'var(--text-secondary)',
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Embedded Chat Interface */}
          <div style={{ flex: 1, overflow: 'hidden', background: '#fff9f6' }}>
            <ChatInterface
              hotelName={hotelName}
              initialPrompt={initialPrompt}
              isFloating={true}
              onClose={onToggle}
            />
          </div>
        </div>
      )}
    </>
  );
};
