'use client';

import React, { useEffect, useState } from 'react';
import { Phone, Mail, Sparkles, RefreshCw, Clock } from 'lucide-react';

interface HeaderProps {
  onNewConversation: () => void;
  hotelName: string;
  phone: string;
  email: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNewConversation,
  hotelName,
  phone,
  email,
}) => {
  const [hotelTime, setHotelTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Los_Angeles',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZoneName: 'short',
        }).format(now);
        setHotelTime(formatted);
      } catch {
        setHotelTime('PST');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(7, 14, 28, 0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '14px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Brand identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #1d3557 0%, #0a192f 100%)',
              border: '1px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-gold)',
            }}
          >
            <Sparkles size={22} color="var(--accent-gold)" />
          </div>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 600,
                letterSpacing: '0.5px',
                margin: 0,
                color: 'var(--text-primary)',
              }}
            >
              {hotelName}
            </h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--accent-emerald)',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-emerald)',
                    boxShadow: '0 0 8px var(--accent-emerald)',
                  }}
                />
                Virtual Concierge Active
              </span>

              {hotelTime && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Clock size={12} />
                  Hotel Local: {hotelTime}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Header actions & contact info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.85rem',
          }}
        >
          <a
            href={`tel:${phone.replace(/[^\d+]/g, '')}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-card)',
              background: 'rgba(255, 255, 255, 0.03)',
            }}
            title="Call Hotel Front Desk"
          >
            <Phone size={14} color="var(--accent-gold)" />
            <span style={{ display: 'none', minWidth: '90px' }}>{phone}</span>
            <span>Call Concierge</span>
          </a>

          <a
            href={`mailto:${email}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-card)',
              background: 'rgba(255, 255, 255, 0.03)',
            }}
            title="Email Concierge"
          >
            <Mail size={14} color="var(--accent-gold)" />
            <span>Email</span>
          </a>

          <button
            onClick={onNewConversation}
            id="btn-new-conversation"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-gold-soft)',
              color: 'var(--accent-gold-light)',
              border: '1px solid var(--border-subtle)',
              fontWeight: 500,
              fontSize: '0.85rem',
            }}
            title="Clear and start a fresh session"
          >
            <RefreshCw size={13} />
            <span>New Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
