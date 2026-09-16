/**
 * Browser Speech Synthesis (Text-to-Speech) service for the Hotel Concierge.
 */

class VoiceService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isVoiceMuted: boolean = false;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public setMuted(muted: boolean): void {
    this.isVoiceMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public isMuted(): boolean {
    return this.isVoiceMuted;
  }

  public speak(text: string, language: 'en' | 'hi' | 'hinglish' = 'en', onEnd?: () => void): void {
    if (!this.isSupported() || this.isVoiceMuted) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel any previous speaking
    window.speechSynthesis.cancel();

    // Clean text: strip markdown symbols and fact IDs
    const cleanText = text
      .replace(/#fact_[a-z_]+/gi, '')
      .replace(/[*_#`~]/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95; // Slightly measured, warm luxury concierge pacing
    utterance.pitch = 1.0;

    // Pick best natural voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find((v) =>
        language === 'hi'
          ? v.lang.includes('hi') || v.name.includes('Hindi') || v.name.includes('India')
          : (v.lang.includes('en-US') || v.lang.includes('en-GB')) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen'))
      );
      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return this.isSupported() && window.speechSynthesis.speaking;
  }
}

export const voiceService = new VoiceService();
