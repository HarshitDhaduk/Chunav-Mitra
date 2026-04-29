"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, CheckCircle, RotateCcw } from "lucide-react";
import { GamifiedQuiz } from "../GamifiedQuiz";
import { VoiceNarration } from "@/components/accessibility/VoiceNarration";

type Props = { onAnswered: (correct: boolean) => void };

// Flow logic
type FlowState = "q1" | "q2" | "result-form8" | "result-form6a" | "result-form6";

export function Step3Registration({ onAnswered }: Props) {
  const t = useTranslations("steps.3");
  const [flow, setFlow] = useState<FlowState>("q1");

  const body = t("body");
  const isResult = flow.startsWith("result-");

  // Fetch localized form info
  const forms = t.raw("forms");
  const resultKey = flow.replace("result-", "");
  const formInfo = isResult ? forms[resultKey] : null;

  // Visual config for tags
  const TAG_COLORS: Record<string, string> = {
    form6: "bg-green-100 text-green-700",
    form6a: "bg-purple-100 text-purple-700",
    form8: "bg-blue-100 text-blue-700",
  };

  return (
    <article className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <VoiceNarration text={body} />
      </div>

      <p className="leading-relaxed">{body}</p>

      {/* ── Interactive form guide ── */}
      <section className="rounded-2xl border-2 border-slate-100 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 dark:text-white">📋 {t("findForm")}</h3>
          {flow !== "q1" && (
            <button
              onClick={() => setFlow("q1")}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <RotateCcw size={12} /> {t("startOver")}
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">

          {/* Q1: Do you already have a Voter ID? */}
          {flow === "q1" && (
            <motion.div
              key="q1"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              className="space-y-3"
            >
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("hasVoterId")}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <OptionButton
                  label={t("yes")}
                  emoji="✅"
                  onClick={() => setFlow("result-form8")}
                />
                <OptionButton
                  label={t("no")}
                  emoji="❌"
                  onClick={() => setFlow("q2")}
                />
              </div>
            </motion.div>
          )}

          {/* Q2: Are you an NRI? */}
          {flow === "q2" && (
            <motion.div
              key="q2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              className="space-y-3"
            >
              {/* Breadcrumb */}
              <p className="text-xs text-slate-400">{t("no")} Voter ID →</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("isNri")}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <OptionButton
                  label={t("yes")}
                  emoji="✈️"
                  onClick={() => setFlow("result-form6a")}
                />
                <OptionButton
                  label={t("no")}
                  emoji="🏠"
                  onClick={() => setFlow("result-form6")}
                />
              </div>
            </motion.div>
          )}

          {/* Result card */}
          {isResult && formInfo && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
              aria-live="polite"
            >
              {/* Form header */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-xl font-black text-white">
                  F
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {formInfo.title}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TAG_COLORS[resultKey]}`}>
                      {formInfo.tag}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{formInfo.desc}</p>
                </div>
              </div>

              {/* Required documents */}
              <div className="rounded-xl bg-white p-4 dark:bg-slate-700">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {t("docsRequired")}
                </p>
                <ul className="space-y-1.5">
                  {(formInfo.docs as string[]).map((doc) => (
                    <li key={doc} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle size={14} className="mt-0.5 shrink-0 text-green-500" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <a
                href="https://voters.eci.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
              >
                {t("applyCta")} <ExternalLink size={14} />
              </a>
            </motion.div>
          )}

        </AnimatePresence>
      </section>

      <GamifiedQuiz
        stepNumber={3}
        questions={[
          {
            question: t("quiz.0.question"),
            options: [t("quiz.0.options.0"), t("quiz.0.options.1"), t("quiz.0.options.2")],
            correctIndex: 1,
            difficulty: "easy",
          },
          {
            question: t("quiz.1.question"),
            options: [t("quiz.1.options.0"), t("quiz.1.options.1"), t("quiz.1.options.2")],
            correctIndex: 2,
            difficulty: "medium",
          },
          {
            question: t("quiz.2.question"),
            options: [t("quiz.2.options.0"), t("quiz.2.options.1"), t("quiz.2.options.2")],
            correctIndex: 1,
            difficulty: "hard",
          },
        ]}
        onAnswered={onAnswered}
      />
    </article>
  );
}

function OptionButton({
  label, emoji, onClick,
}: {
  label: string;
  emoji: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:border-orange-500 dark:hover:bg-orange-900/20 dark:hover:text-orange-300"
    >
      <span>{emoji}</span>
      {label}
    </button>
  );
}
