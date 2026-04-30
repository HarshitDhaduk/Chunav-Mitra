"use client";

import { useTranslations } from "next-intl";
import { useRouter, useParams, usePathname } from "next/navigation";
import { Type, Contrast, Volume2, VolumeX } from "lucide-react";
import { useJourneyStore } from "@/context/journeyStore";
import { useEffect } from "react";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हि" },
  { code: "gu", label: "ગુ" },
];

export function AccessibilityToolbar() {
  const t = useTranslations("accessibility");
  const { accessibilityPrefs, setAccessibilityPref } = useJourneyStore();
  const { largeText, highContrast, voiceOn } = accessibilityPrefs;
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams<{ locale: string }>();

  useEffect(() => {
    document.documentElement.dataset.largeText = String(largeText);
    document.documentElement.dataset.highContrast = String(highContrast);
  }, [largeText, highContrast]);

  function switchLocale(newLocale: string) {
    if (newLocale === locale) return;
    // Replace the locale segment in the current path
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/") as any);
  }

  return (
    <div className="flex items-center gap-1" role="toolbar" aria-label="Accessibility and language options">

      {/* Language switcher */}
      <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
        {LANGUAGES.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => switchLocale(code)}
            aria-label={`Switch to ${code}`}
            aria-pressed={locale === code}
            className={`min-h-[32px] min-w-[32px] rounded-md px-2 text-xs font-semibold transition-colors ${
              locale === code
                ? "bg-orange-500 text-white"
                : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />

      {/* Accessibility toggles */}
      <ToolbarButton
        active={largeText}
        onClick={() => setAccessibilityPref("largeText", !largeText)}
        label={t("largeText")}
        icon={<Type size={14} />}
      />
      <ToolbarButton
        active={highContrast}
        onClick={() => setAccessibilityPref("highContrast", !highContrast)}
        label={t("highContrast")}
        icon={<Contrast size={14} />}
      />
      <ToolbarButton
        active={voiceOn}
        onClick={() => setAccessibilityPref("voiceOn", !voiceOn)}
        label={voiceOn ? t("stopNarration") : t("voiceNarration")}
        icon={voiceOn ? <VolumeX size={14} /> : <Volume2 size={14} />}
      />
    </div>
  );
}

function ToolbarButton({
  active, onClick, label, icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`flex min-h-[36px] items-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors ${
        active ? "bg-orange-100 text-orange-600" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
