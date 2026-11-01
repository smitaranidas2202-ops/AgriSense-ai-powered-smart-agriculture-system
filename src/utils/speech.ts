/**
 * Voice Assistance utility for Indian Farmers
 * Uses Web Speech API (window.speechSynthesis) with Hindi, Marathi, and English support.
 */

import { Language } from '../types';

let currentUtterance: SpeechSynthesisUtterance | null = null;

export const speakText = (
  text: string, 
  lang: Language = 'en',
  onEnd?: () => void
): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip markdown, html tags, and symbols for clean speech
  const cleanText = text
    .replace(/[#*_`~>\[\]\(\)]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  currentUtterance = utterance;

  // Language mapping for Indian speech engines
  switch (lang) {
    case 'hi':
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9; // Slightly slower for clarity
      break;
    case 'mr':
      utterance.lang = 'mr-IN';
      utterance.rate = 0.9;
      break;
    case 'en':
    default:
      utterance.lang = 'en-IN';
      utterance.rate = 0.95;
      break;
  }

  // Attempt to select an Indian regional voice if available in the browser
  const voices = window.speechSynthesis.getVoices();
  const targetCode = utterance.lang.toLowerCase();
  const matchedVoice = voices.find(v => 
    v.lang.toLowerCase() === targetCode || 
    v.lang.toLowerCase().startsWith(targetCode.split('-')[0])
  );
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return true;
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
};

export const isSpeaking = (): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  return window.speechSynthesis.speaking;
};
