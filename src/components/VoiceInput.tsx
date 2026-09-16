'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  language?: 'en' | 'hi' | 'hinglish';
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  disabled = false,
  language = 'en',
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;
        // en-US or hi-IN
        recog.lang = language === 'hi' ? 'hi-IN' : 'en-US';

        recog.onstart = () => setIsListening(true);
        recog.onend = () => setIsListening(false);
        recog.onerror = () => setIsListening(false);

        recog.onresult = (event: any) => {
          const transcript = event.results[0]?.[0]?.transcript;
          if (transcript) {
            onTranscript(transcript);
          }
        };

        setRecognition(recog);
      }
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        recognition.start();
      } catch (err) {
        console.error('Speech recognition start error:', err);
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        id="btn-voice-input"
        aria-label={isListening ? 'Stop voice recording' : 'Speak your question (Voice Concierge)'}
        title={isListening ? 'Listening... Click to stop' : 'Click to speak your question in voice'}
        style={{
          height: '44px',
          padding: isListening ? '0 14px' : '0 12px',
          borderRadius: 'var(--radius-md)',
          background: isListening
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'rgba(16, 185, 129, 0.12)',
          border: isListening
            ? '2px solid #34d399'
            : '1px solid rgba(16, 185, 129, 0.4)',
          color: isListening ? '#ffffff' : '#34d399',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: isListening ? '0 0 20px rgba(16, 185, 129, 0.7)' : 'none',
          transition: 'all 0.25s ease',
          position: 'relative',
        }}
      >
        {isListening ? (
          <>
            <Volume2 size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Listening...</span>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                boxShadow: '0 0 8px #ffffff',
                animation: 'pulse 1s infinite',
              }}
            />
          </>
        ) : (
          <>
            <Mic size={18} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Voice</span>
          </>
        )}
      </button>
    </div>
  );
};
