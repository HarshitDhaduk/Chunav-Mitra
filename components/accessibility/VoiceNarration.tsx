"use client";

import { useEffect, useRef } from "react";
import { Volume2 } from "lucide-react";
import { useJourneyStore } from "@/context/journeyStore";

type Props = { text: string };

// Maps locale codes to BCP-47 language tags for SpeechSynthesis
const LOCALE_VOICE_MAP: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  gu: "gu-IN",
};

export function VoiceNarration({ text }: Props) {
  const { accessibilityPrefs, locale } = useJourneyStore();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Auto-read when voiceOn is toggled on
  useEffect(() => {
    if (!accessibilityPrefs.voiceOn || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LOCALE_VOICE_MAP[locale] ?? "en-IN";
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);

    return () => window.speechSynthesis.cancel();
  }, [text, accessibilityPrefs.voiceOn, locale]);

  function handleManualRead() {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LOCALE_VOICE_MAP[locale] ?? "en-IN";
    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      onClick={handleManualRead}
      aria-label="Read aloud"
      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border hover:bg-muted text-muted-foreground"
    >
      <Volume2 size={18} />
    </button>
  );
}
