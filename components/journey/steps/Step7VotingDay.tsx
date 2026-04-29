"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { GamifiedQuiz } from "../GamifiedQuiz";
import { VoiceNarration } from "@/components/accessibility/VoiceNarration";

type Props = { onAnswered: (correct: boolean) => void };

export function Step7VotingDay({ onAnswered }: Props) {
  const t = useTranslations("steps.7");
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const body = t("body");

  const boothSteps = t.raw("boothSteps") as Array<{ official: string; action: string }>;
  const checklist = t.raw("checklist") as Array<{ label: string }>;

  const boothIcons = ["👤", "✍️", "🗳️"];
  const checklistIcons = ["🪪", "📄", "📵", "📍"];

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

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

      {/* Booth sequence */}
      <div className="space-y-3">
        {boothSteps.map(({ official, action }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex gap-4 rounded-xl border bg-card p-4"
          >
            <span className="text-2xl">{boothIcons[i]}</span>
            <div>
              <p className="font-semibold">{official}</p>
              <p className="text-sm text-muted-foreground">{action}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pre-departure checklist */}
      <section className="rounded-2xl border bg-card p-5">
        <h3 className="mb-3 font-semibold">{t("checklistTitle")}</h3>
        <div className="space-y-2">
          {checklist.map(({ label }, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`flex min-h-[44px] w-full items-center gap-3 rounded-xl border px-4 py-2 text-left text-sm transition-colors ${
                checked.has(i) ? "border-green-500 bg-green-50 text-green-700" : "hover:bg-muted"
              }`}
              aria-pressed={checked.has(i)}
            >
              <span className="text-xl">{checklistIcons[i]}</span>
              <span>{label}</span>
              {checked.has(i) && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      </section>

      <GamifiedQuiz
        stepNumber={7}
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
