"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { GamifiedQuiz } from "../GamifiedQuiz";
import { VoiceNarration } from "@/components/accessibility/VoiceNarration";

type Props = { onAnswered: (correct: boolean) => void };

export function Step4Timeline({ onAnswered }: Props) {
  const t = useTranslations("steps.4");
  const [expanded, setExpanded] = useState<number | null>(null);
  const body = t("body");

  // Load localized arrays
  const phases = t.raw("phases") as Array<{
    phase: string;
    summary: string;
    details: string[];
  }>;

  const mccRules = t.raw("mccRules") as string[];

  // Visual config for phases (since these aren't localized)
  const phaseStyles = [
    { icon: "📢", color: "bg-blue-500", lightColor: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800", textColor: "text-blue-700 dark:text-blue-400" },
    { icon: "📋", color: "bg-orange-500", lightColor: "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800", textColor: "text-orange-700 dark:text-orange-400" },
    { icon: "📝", color: "bg-purple-500", lightColor: "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800", textColor: "text-purple-700 dark:text-purple-400" },
    { icon: "📣", color: "bg-green-500", lightColor: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800", textColor: "text-green-700 dark:text-green-400" },
    { icon: "🔇", color: "bg-red-500", lightColor: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800", textColor: "text-red-700 dark:text-red-400" },
    { icon: "🗳️", color: "bg-teal-500", lightColor: "bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-800", textColor: "text-teal-700 dark:text-teal-400" },
  ];

  const ruleIcons = ["🚫", "⛪", "🚗", "💰", "📺", "🍺"];

  function toggle(i: number) {
    setExpanded((prev) => (prev === i ? null : i));
  }

  return (
    <article className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <VoiceNarration text={body} />
      </div>

      <p className="leading-relaxed text-slate-600 dark:text-slate-300">{body}</p>

      {/* ── Vertical timeline ── */}
      <section>
        <h3 className="mb-4 font-semibold text-slate-800 dark:text-white">{t("timelineTitle")}</h3>

        <div className="space-y-0">
          {phases.map((phase, i) => {
            const isLast = i === phases.length - 1;
            const isOpen = expanded === i;
            const style = phaseStyles[i] || phaseStyles[0];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex gap-0"
              >
                {/* Left rail: dot + line */}
                <div className="flex flex-col items-center">
                  {/* Dot */}
                  <div className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.color} text-base shadow-md ring-4 ring-white dark:ring-slate-950`}>
                    {style.icon}
                  </div>
                  {/* Connector line — hidden on last item */}
                  {!isLast && (
                    <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700" style={{ minHeight: "1.5rem" }} />
                  )}
                </div>

                {/* Right content */}
                <div className={`ml-4 pb-6 flex-1 min-w-0 ${isLast ? "pb-0" : ""}`}>
                  <button
                    onClick={() => toggle(i)}
                    className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                      isOpen
                        ? style.lightColor
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-slate-500 dark:hover:bg-slate-700"
                    }`}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className={`font-semibold text-sm leading-snug ${
                          isOpen ? style.textColor : "text-slate-800 dark:text-white"
                        }`}>
                          {phase.phase}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {phase.summary}
                        </p>
                      </div>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-0.5 shrink-0 text-slate-400"
                      >
                        <ChevronDown size={15} />
                      </motion.span>
                    </div>
                  </button>

                  {/* Expanded detail panel */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className={`mt-2 rounded-xl border-2 p-4 ${style.lightColor}`}>
                          <ul className="space-y-2">
                            {phase.details.map((detail, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${style.color}`} />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── MCC Quick Rules ── */}
      <section>
        <h3 className="mb-3 font-semibold text-slate-800 dark:text-white">
          {t("mccTitle")}
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {mccRules.map((rule, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
            >
              <span className="text-xl">{ruleIcons[i] || "🔹"}</span>
              <span className="text-sm text-slate-700 dark:text-slate-300">{rule}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 48-Hour Silence callout ── */}
      <section className="rounded-2xl border-2 border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-900/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔇</span>
          <div>
            <p className="font-bold text-red-700 dark:text-red-400">{t("silencePeriodTitle")}</p>
            <p className="mt-1 text-sm text-red-600 dark:text-red-300">
              {t("silencePeriodDesc")}
            </p>
          </div>
        </div>
      </section>

      <GamifiedQuiz
        stepNumber={4}
        questions={[
          {
            question: t("quiz.0.question"),
            options: [t("quiz.0.options.0"), t("quiz.0.options.1"), t("quiz.0.options.2")],
            correctIndex: 1,
            difficulty: "medium",
          },
          {
            question: t("quiz.1.question"),
            options: [t("quiz.1.options.0"), t("quiz.1.options.1"), t("quiz.1.options.2")],
            correctIndex: 1,
            difficulty: "medium",
          },
          {
            question: t("quiz.2.question"),
            options: [t("quiz.2.options.0"), t("quiz.2.options.1"), t("quiz.2.options.2")],
            correctIndex: 1,
            difficulty: "hard",
          },
          {
            question: t("quiz.3.question"),
            options: [t("quiz.3.options.0"), t("quiz.3.options.1"), t("quiz.3.options.2")],
            correctIndex: 1,
            difficulty: "hard",
          },
        ]}
        onAnswered={onAnswered}
      />
    </article>
  );
}
