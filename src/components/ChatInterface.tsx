'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Globe, FileText, Volume2, VolumeX } from 'lucide-react';
import { ConversationTurn, ChatResponsePayload, ApiError } from '@/lib/types';
import { MessageItem } from './MessageItem';
import { QuickQuestions } from './QuickQuestions';
import { ErrorBanner } from './ErrorBanner';
import { VoiceInput } from './VoiceInput';
import { voiceService } from '@/lib/voiceService';

interface ChatInterfaceProps {
  hotelName: string;
  initialPrompt?: string;
  onClose?: () => void;
  isFloating?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  hotelName,
  initialPrompt,
  onClose,
  isFloating = false,
}) => {
  const [conversationId, setConversationId] = useState<string>(
    () => `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  );
  const [messages, setMessages] = useState<ConversationTurn[]>(() => [
    {
      id: 'greeting',
      role: 'assistant',
      content: `Namaste & Welcome to ${hotelName}! I'm Meena, your personal guest concierge.\n\nHow could I help you today? I'm here to assist with room recommendations, heated infinity pool timings, dining at Azure Brasserie, or verifying real-time suite availability for your stay.`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi' | 'hinglish'>('en');
  const [isVoiceModeActive, setIsVoiceModeActive] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Re-greet if language changes
  useEffect(() => {
    if (language === 'hi') {
      setMessages([
        {
          id: 'greeting_hi',
          role: 'assistant',
          content: `Namaste! ${hotelName} mein aapka swagat hai. Main Meena hoon, aapki personal guest concierge.\n\nMain aapki kya madad kar sakti hoon? Aap mujhse hotel suvidhaon, check-in samay, breakfast, cancellation policies, ya live room availability ke baare mein pooch sakte hain.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [language]);

  useEffect(() => {
    if (initialPrompt && conversationId) {
      sendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const initNewConversation = () => {
    const newId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setConversationId(newId);
    setError(null);
    setLastFailedMessage(null);
    setInputMessage('');

    const greetingContent =
      language === 'hi'
        ? `Namaste! ${hotelName} mein aapka swagat hai. Main Meena hoon, aapki personal guest concierge.\n\nMain aapki kya madad kar sakti hoon? Aap mujhse hotel suvidhaon, check-in samay, breakfast, cancellation policies, ya live room availability ke baare mein pooch sakte hain.`
        : `Namaste & Welcome to ${hotelName}! I'm Meena, your personal guest concierge.\n\nHow could I help you today? I'm here to assist with room recommendations, heated infinity pool timings, dining at Azure Brasserie, or verifying real-time suite availability for your stay.`;

    const initialGreeting: ConversationTurn = {
      id: 'greeting',
      role: 'assistant',
      content: greetingContent,
      timestamp: new Date().toISOString(),
    };
    setMessages([initialGreeting]);
  };

  // Scroll smoothly to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (
    textToSend: string,
    availabilityDetails?: { checkIn: string; checkOut: string; adults: number }
  ) => {
    const trimmed = textToSend.trim();
    if ((!trimmed && !availabilityDetails) || isLoading) return;

    setError(null);
    setIsLoading(true);

    const guestTurnText =
      trimmed ||
      `Checking availability: ${availabilityDetails?.checkIn} to ${availabilityDetails?.checkOut} for ${availabilityDetails?.adults} adult(s)`;

    // Optimistically append guest message
    const optimisticTurn: ConversationTurn = {
      id: `guest_${Date.now()}`,
      role: 'guest',
      content: guestTurnText,
      timestamp: new Date().toISOString(),
      availabilityDetails,
    };

    setMessages((prev) => [...prev, optimisticTurn]);
    setInputMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: guestTurnText,
          conversationId,
          availabilityDetails,
        }),
      });

      const data: ChatResponsePayload = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error?.message || `Server returned status ${response.status}`);
      }

      // Update conversation ID if returned
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      // Append assistant response
      const assistantTurn: ConversationTurn = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
        responseType: data.responseType,
        supportingFactIds: data.supportingFactIds,
        availabilityDetails: data.availabilityDetails,
        rooms: data.rooms,
      };

      setMessages((prev) => [...prev, assistantTurn]);
      setLastFailedMessage(null);

      // If voiceMode is active or guest used voice input, speak response aloud
      if (isVoiceModeActive && data.message) {
        voiceService.speak(data.message, language);
      }
    } catch (err: any) {
      setLastFailedMessage(guestTurnText);
      setError({
        code: 'NETWORK_OR_API_ERROR',
        message: err?.message || 'Failed to reach the guest assistant service.',
        retryable: true,
      });
    } finally {
      setIsLoading(false);
      // Auto-focus input after completion
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      sendMessage(lastFailedMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  const handleAvailabilityFormSubmit = (details: {
    checkIn: string;
    checkOut: string;
    adults: number;
  }) => {
    sendMessage(
      `Please check room availability from ${details.checkIn} to ${details.checkOut} for ${details.adults} adult(s).`,
      details
    );
  };

  return (
    <div
      id="chat-interface-root"
      data-hydrated={isMounted ? 'true' : 'false'}
      style={{
        maxWidth: isFloating ? '100%' : '1000px',
        margin: isFloating ? '0' : '20px auto 40px',
        padding: isFloating ? '0' : '0 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: isFloating ? '100%' : 'calc(100vh - 120px)',
        minHeight: isFloating ? '100%' : '620px',
      }}
    >
      {/* Main Glass Chat Container */}
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          borderRadius: isFloating ? '0' : 'var(--radius-lg)',
        }}
      >
        {/* Assistant Header & Language Control Bar */}
        <div
          style={{
            padding: '10px 18px',
            borderBottom: '1px solid var(--border-card)',
            background: 'linear-gradient(90deg, #fff5f2 0%, #fdf0eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-emerald)',
                boxShadow: '0 0 8px var(--accent-emerald)',
              }}
            />
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
              🌸 Meena Active
            </span>

            {/* Voice Mode Toggle */}
            <button
              onClick={() => {
                const next = !isVoiceModeActive;
                setIsVoiceModeActive(next);
                if (!next) {
                  voiceService.stop();
                }
              }}
              id="btn-toggle-voice-mode"
              title={isVoiceModeActive ? 'Voice Mode Active (Meena will speak)' : 'Enable Voice Mode (Spoken answers)'}
              style={{
                fontSize: '0.74rem',
                color: isVoiceModeActive ? '#059669' : 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 9px',
                borderRadius: 'var(--radius-sm)',
                background: isVoiceModeActive ? 'rgba(5, 150, 105, 0.12)' : '#ffffff',
                border: isVoiceModeActive ? '1px solid #059669' : '1px solid var(--border-card)',
                fontWeight: isVoiceModeActive ? 600 : 400,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <Volume2 size={12} color={isVoiceModeActive ? '#059669' : 'var(--text-muted)'} />
              <span>{isVoiceModeActive ? 'Voice: ON' : 'Voice: OFF'}</span>
            </button>
          </div>

          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={13} color="var(--accent-gold)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lang:</span>
            {(['en', 'hi', 'hinglish'] as const).map((lng) => (
              <button
                key={lng}
                onClick={() => setLanguage(lng)}
                style={{
                  fontSize: '0.72rem',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  background: language === lng ? 'var(--accent-gold)' : '#ffffff',
                  color: language === lng ? '#ffffff' : 'var(--text-secondary)',
                  border: language === lng ? 'none' : '1px solid var(--border-card)',
                  fontWeight: language === lng ? 700 : 500,
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {lng === 'en' ? 'English' : lng === 'hi' ? 'हिन्दी' : 'Hinglish'}
              </button>
            ))}
          </div>
        </div>

        {/* Messages scroll area */}
        <div
          role="log"
          aria-live="polite"
          aria-label="Hotel guest assistant conversation"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 18px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {messages.map((turn, index) => {
            const isLatestAssistantTurn =
              index === messages.length - 1 && turn.role === 'assistant';
            return (
              <MessageItem
                key={turn.id}
                turn={turn}
                onAvailabilitySubmit={handleAvailabilityFormSubmit}
                isLatestAssistantTurn={isLatestAssistantTurn}
                isLoading={isLoading}
              />
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '12px 0',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fff0ea 0%, #fae2d8 100%)',
                  border: '1px solid var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                }}
              >
                🌸
              </div>
              <div
                style={{
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: '#ffffff',
                  border: '1px solid var(--border-card)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <span
                  style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginRight: '4px' }}
                >
                  Meena is checking hotel records
                </span>
                <span
                  className="dot-1"
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-gold)',
                  }}
                />
                <span
                  className="dot-2"
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-gold)',
                  }}
                />
                <span
                  className="dot-3"
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-gold)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && <ErrorBanner error={error} onRetry={handleRetry} />}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Starter Chips (visible if few messages) */}
        {messages.length <= 2 && (
          <div
            style={{
              padding: '0 18px 8px',
              borderTop: '1px solid var(--border-card)',
              background: '#fff9f6',
            }}
          >
            <QuickQuestions
              onSelect={(q) => sendMessage(q)}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Input bar */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--border-card)',
            background: '#ffffff',
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputMessage);
            }}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '10px',
            }}
          >
            {/* Voice Input Button */}
            <VoiceInput
              onTranscript={(text) => {
                setIsVoiceModeActive(true);
                sendMessage(text);
              }}
              disabled={isLoading}
              language={language}
            />

            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                ref={textareaRef}
                id="chat-input-textarea"
                aria-label="Ask Meena a question"
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  language === 'hi'
                    ? 'Check-in time, breakfast, pool, ya dates ke baare mein Meena se poochein...'
                    : 'Ask Meena about check-in, breakfast, infinity pool, 3 guests, or dates...'
                }
                disabled={isLoading}
                maxLength={1000}
                style={{
                  width: '100%',
                  resize: 'none',
                  maxHeight: '120px',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                  boxShadow: 'inset 0 1px 3px rgba(180,90,70,0.06)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: '12px',
                  bottom: '-16px',
                  fontSize: '0.68rem',
                  color: inputMessage.length > 900 ? 'var(--accent-ruby)' : 'var(--text-muted)',
                }}
              >
                {inputMessage.length}/1000
              </div>
            </div>

            <button
              type="submit"
              id="btn-send-message"
              aria-label="Send message to concierge"
              disabled={!inputMessage.trim() || isLoading}
              style={{
                height: '44px',
                padding: '0 20px',
                borderRadius: 'var(--radius-md)',
                background:
                  !inputMessage.trim() || isLoading
                    ? 'rgba(200, 109, 81, 0.15)'
                    : 'linear-gradient(135deg, #c86d51 0%, #b45d43 100%)',
                color: !inputMessage.trim() || isLoading ? 'var(--text-muted)' : '#ffffff',
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: !inputMessage.trim() || isLoading ? 'not-allowed' : 'pointer',
                boxShadow:
                  !inputMessage.trim() || isLoading ? 'none' : '0 4px 14px rgba(200, 109, 81, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>Send</span>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
