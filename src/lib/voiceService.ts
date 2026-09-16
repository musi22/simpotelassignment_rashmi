/**
 * Browser Speech Synthesis (Text-to-Speech) service for the Hotel Concierge ("Meena").
 * Configured specifically to use a sweet, friendly female/girl voice in both English and Hindi.
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

  /**
   * Selects the best female / girl voice for the given language.
   */
  private getFemaleVoice(language: 'en' | 'hi'): SpeechSynthesisVoice | null {
    if (!this.isSupported()) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const femaleKeywords = [
      'female', 'girl', 'zira', 'kalpana', 'swara', 'samantha', 'karen',
      'victoria', 'jenny', 'aria', 'sonia', 'lekha', 'fiona', 'moira',
      'tessa', 'susan', 'allison', 'ava', 'zoe', 'natasha'
    ];

    const maleKeywords = [
      'male', 'david', 'mark', 'george', 'guy', 'ravi', 'hemant',
      'madhav', 'james', 'richard', 'tom', 'stefan'
    ];

    if (language === 'hi') {
      // 1. Hindi female voice (e.g. Kalpana, Swara, Lekha)
      const hindiFemale = voices.find((v) => {
        const name = v.name.toLowerCase();
        const lang = v.lang.toLowerCase();
        const isHi = lang.includes('hi') || name.includes('hindi');
        const isFemale = femaleKeywords.some((k) => name.includes(k));
        const isMale = maleKeywords.some((k) => name.includes(k));
        return isHi && isFemale && !isMale;
      });
      if (hindiFemale) return hindiFemale;

      // 2. Any Hindi voice that isn't explicitly male
      const anyHindi = voices.find((v) => {
        const name = v.name.toLowerCase();
        const lang = v.lang.toLowerCase();
        const isHi = lang.includes('hi') || name.includes('hindi') || lang.includes('in');
        const isMale = maleKeywords.some((k) => name.includes(k));
        return isHi && !isMale;
      });
      if (anyHindi) return anyHindi;
    }

    // English female voice (e.g. Zira, Samantha, Karen, Jenny, Aria)
    const englishFemale = voices.find((v) => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();
      const isEn = lang.includes('en');
      const isFemale = femaleKeywords.some((k) => name.includes(k));
      const isMale = maleKeywords.some((k) => name.includes(k));
      return isEn && isFemale && !isMale;
    });
    if (englishFemale) return englishFemale;

    // Any English voice that isn't explicitly male
    const anyEnglishNonMale = voices.find((v) => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();
      const isEn = lang.includes('en');
      const isMale = maleKeywords.some((k) => name.includes(k));
      return isEn && !isMale;
    });

    return anyEnglishNonMale || voices[0] || null;
  }

  public speak(text: string, language: 'en' | 'hi' = 'en', onEnd?: () => void): void {
    if (!this.isSupported() || this.isVoiceMuted) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel any previous speaking
    window.speechSynthesis.cancel();

    // Clean text: strip fact badges, URLs, markdown, bullet markers
    const cleanText = text
      .replace(/#fact_[a-z_]+/gi, '')
      .replace(/https?:\/\/[^\s]+/gi, '')
      .replace(/[*_#`~>]/g, '')
      .replace(/[•-]\s+/g, '')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.96;  // Warm, measured concierge cadence
    utterance.pitch = 1.18; // Sweet, gentle girl / female pitch

    const voice = this.getFemaleVoice(language);
    if (voice) {
      utterance.voice = voice;
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
