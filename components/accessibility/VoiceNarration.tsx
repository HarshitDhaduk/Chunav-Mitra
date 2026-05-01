"use client";

import { useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useJourneyStore } from "@/context/journeyStore";

type Props = { text: string };

// Maps locale codes to Google Translate TTS language codes
const LOCALE_VOICE_MAP: Record<string, string> = {
  en: "en",
  hi: "hi",
  gu: "gu",
};

export function VoiceNarration({ text }: Props) {
  const { accessibilityPrefs, locale, setAccessibilityPref } = useJourneyStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopNarration = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const playNarration = (textToSpeak: string) => {
    stopNarration();
    if (!textToSpeak) return;

    const lang = LOCALE_VOICE_MAP[locale] ?? "en";
    const url = `/api/tts?text=${encodeURIComponent(textToSpeak)}&lang=${lang}`;

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play().catch((err) => {
      console.error("Audio playback failed:", err);
    });
  };

  // Auto-read when voiceOn is toggled on
  useEffect(() => {
    if (accessibilityPrefs.voiceOn) {
      playNarration(text);
    } else {
      stopNarration();
    }

    return () => stopNarration();
  }, [text, accessibilityPrefs.voiceOn, locale]);

  function handleManualRead() {
    setAccessibilityPref("voiceOn", !accessibilityPrefs.voiceOn);
  }

  return (
    <button
      onClick={handleManualRead}
      aria-label={accessibilityPrefs.voiceOn ? "Stop reading" : "Read aloud"}
      aria-pressed={accessibilityPrefs.voiceOn}
      className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border transition-colors ${
        accessibilityPrefs.voiceOn 
          ? "bg-orange-100 text-orange-600 border-orange-200" 
          : "hover:bg-muted text-muted-foreground"
      }`}
    >
      {accessibilityPrefs.voiceOn ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}

