'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  language?: 'en' | 'hi';
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  disabled = false,
  language = 'en',
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = language === 'hi' ? 'hi-IN' : 'en-US';

        recog.onstart = () => {
          setIsListening(true);
          setErrorMessage(null);
        };
        recog.onend = () => setIsListening(false);
        recog.onerror = (event: any) => {
          setIsListening(false);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setErrorMessage(
              language === 'hi'
                ? 'माइक्रोफ़ोन अनुमति अस्वीकृत है। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।'
                : 'Microphone permission denied. Please allow microphone access in your browser settings.'
            );
          } else if (event.error === 'no-speech') {
            setErrorMessage(
              language === 'hi'
                ? 'कोई आवाज़ नहीं सुनी गई। कृपया दोबारा बोलें।'
                : 'No speech detected. Please speak clearly into your microphone.'
            );
          } else if (event.error === 'network') {
            setErrorMessage(
              language === 'hi'
                ? 'नेटवर्क समस्या। कृपया पुनः प्रयास करें।'
                : 'Speech recognition network error. Please try again.'
            );
          }
          setTimeout(() => setErrorMessage(null), 5000);
        };

        recog.onresult = (event: any) => {
          const transcript = event.results[0]?.[0]?.transcript;
          if (transcript) {
            onTranscript(transcript);
          }
        };

        setRecognition(recog);
      } else {
        setIsSupported(false);
      }
    }
  }, [language]);

  const toggleListening = () => {
    if (!isSupported) {
      setErrorMessage(
        language === 'hi'
          ? 'वॉयस पहचान Chrome, Edge, या Safari ब्राउज़र में समर्थित है।'
          : 'Voice input is supported in Google Chrome, Microsoft Edge, and Safari.'
      );
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      try {
        setErrorMessage(null);
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        recognition.start();
      } catch (err: any) {
        console.error('Speech recognition start error:', err);
        if (err.name === 'NotAllowedError') {
          setErrorMessage('Please allow microphone permissions to speak.');
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
      {errorMessage && (
        <div
          role="alert"
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '0',
            backgroundColor: '#1f2937',
            color: '#ffffff',
            fontSize: '0.74rem',
            padding: '6px 12px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 100,
            border: '1px solid #374151',
          }}
        >
          ⚠️ {errorMessage}
        </div>
      )}
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        id="btn-voice-input"
        aria-label={isListening ? 'Stop voice recording' : 'Speak your question (Voice Concierge)'}
        title={
          !isSupported
            ? 'Voice input available on Chrome, Edge & Safari'
            : isListening
            ? 'Listening... Click to stop'
            : 'Click to speak your question in voice'
        }
        style={{
          height: '44px',
          padding: isListening ? '0 14px' : '0 12px',
          borderRadius: 'var(--radius-md)',
          background: isListening
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : !isSupported
            ? 'rgba(156, 163, 175, 0.15)'
            : 'rgba(16, 185, 129, 0.12)',
          border: isListening
            ? '2px solid #34d399'
            : !isSupported
            ? '1px solid rgba(156, 163, 175, 0.3)'
            : '1px solid rgba(16, 185, 129, 0.4)',
          color: isListening ? '#ffffff' : !isSupported ? '#6b7280' : '#059669',
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
        ) : !isSupported ? (
          <>
            <MicOff size={16} />
            <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Voice</span>
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
