"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, CheckCircle, Shield, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useJourneyStore } from "@/context/journeyStore";
import { STEPS_CONFIG, TOTAL_MAX_XP } from "@/lib/journey-config";

type Props = { mobile?: boolean };

export function JourneySidebar({ mobile = false }: Props) {
  const { step, locale } = useParams<{ step?: string; locale: string }>();
  const router = useRouter();
  const t = useTranslations();
  const { stepXp, totalXp, level, persona } = useJourneyStore();
  const active = step ? parseInt(step, 10) : 1;
  
  function goTo(n: number) {
    router.push(`/${locale}/journey/${n}` as any);
  }

  // ── Mobile: horizontal dot strip ─────────────────────────────────────────
  if (mobile) {
    return (
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
        {STEPS_CONFIG.map(({ id: n }) => {
          const done = stepXp[n] !== undefined;
          const current = n === active;
          return (
            <button key={n} onClick={() => goTo(n)} aria-label={`Step ${n}`}>
              <motion.div
                animate={{ scale: current ? 1.15 : 1 }}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  done && !current
                    ? "bg-green-500 text-white"
                    : current
                    ? "bg-orange-500 text-white ring-2 ring-orange-300"
                    : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                }`}
              >
                {done && !current ? <CheckCircle size={12} /> : n}
              </motion.div>
            </button>
          );
        })}
        <div className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
          <Shield size={11} /> Lvl {level}
        </div>
      </div>
    );
  }

  // ── Desktop: full sidebar list ────────────────────────────────────────────
  const PERSONA_COLORS: Record<string, string> = {
    "student":    "bg-blue-100 text-blue-700",
    "first-time": "bg-orange-100 text-orange-700",
    "general":    "bg-green-100 text-green-700",
  };
  
  const personaLabel = persona ? t(`persona.${persona}`) : null;
  const personaColor = persona ? PERSONA_COLORS[persona] : "";
  const progressPct = Math.round((totalXp / TOTAL_MAX_XP) * 100);

  return (
    <div className="flex h-full flex-col">
      {/* Persona + overall progress */}
      <div className="space-y-4 px-4 pb-3 pt-2">
        <div className="flex items-center justify-between">
          {personaLabel && (
            <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${personaColor}`}>
              {personaLabel}
            </span>
          )}
          <div className="flex items-center gap-1 text-xs font-black text-orange-600">
            <Shield size={12} /> LVL {level}
          </div>
        </div>

        {/* Overall progress bar */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t("journey.overallProgress")}</span>
            <div className="flex items-center gap-1 text-xs font-bold text-yellow-600">
              <Star size={11} fill="currentColor" />
              {totalXp} XP
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: "backOut" }}
            />
          </div>
        </div>
      </div>

      {/* Step list — scrollable independently */}
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        <div className="space-y-1">
          {STEPS_CONFIG.map(({ id: n, emoji, maxPossibleXp }) => {
            const earned = stepXp[n] ?? 0;
            const done = stepXp[n] !== undefined;
            const current = n === active;
            const stepTitle = t(`journey.stepLabels.${n}`);

            return (
              <button
                key={n}
                onClick={() => goTo(n)}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all ${
                  current
                    ? "bg-white shadow-md shadow-orange-100/50 ring-1 ring-orange-100 dark:bg-slate-800 dark:shadow-none dark:ring-slate-700"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {/* Step icon */}
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base transition-all ${
                  done && !current
                    ? "bg-green-500 text-white shadow-lg shadow-green-100 dark:shadow-none"
                    : current
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200 dark:shadow-none"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                }`}>
                  {done && !current ? <CheckCircle size={16} /> : emoji}
                </div>

                {/* Title + points */}
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-[13px] font-bold ${
                    current
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-600 dark:text-slate-400"
                  }`}>
                    {stepTitle}
                  </p>

                  {/* Points: earned / max */}
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((earned / maxPossibleXp) * 100, 100)}%` }}
                        className={`h-full rounded-full transition-all ${done ? "bg-green-400" : "bg-slate-200 dark:bg-slate-600"}`}
                      />
                    </div>
                    <span className={`shrink-0 text-[10px] font-black tracking-tight ${
                      done ? "text-green-600 dark:text-green-500" : "text-slate-400"
                    }`}>
                      {earned}/{maxPossibleXp}
                    </span>
                  </div>
                </div>

                {/* Active indicator */}
                {current && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute -right-1 h-8 w-1 rounded-l-full bg-orange-500"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Journey button */}
      <div className="p-3 pt-0">
        <button
          onClick={() => {
            useJourneyStore.getState().reset();
            router.push(`/${locale}/journey` as any);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-[11px] font-bold text-slate-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-red-900 dark:hover:bg-red-900/20"
        >
          <RotateCcw size={12} />
          {t("steps.3.startOver")}
        </button>
      </div>
    </div>
  );
}
