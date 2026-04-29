"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { GamifiedQuiz } from "../GamifiedQuiz";
import { VoiceNarration } from "@/components/accessibility/VoiceNarration";

type Props = { onAnswered: (correct: boolean) => void };

export function Step1WhatIsElection({ onAnswered }: Props) {
  const t = useTranslations("steps.1");

  const body = t("body");

  return (
    <article className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t("title")}</h2>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
          <VoiceNarration text={body} />
        </div>
      </div>

      {/* Visual analogy */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-blue-50 p-6 text-center"
      >
        <div className="mb-4 flex justify-center gap-8 text-5xl">
          <span role="img" aria-label="classroom">🏫</span>
          <span className="text-2xl self-center text-muted-foreground">→</span>
          <span role="img" aria-label="parliament">🏛️</span>
        </div>
        <p className="text-sm leading-relaxed text-blue-800">{body}</p>
      </motion.div>

      <GamifiedQuiz
        stepNumber={1}
        questions={[
          {
            question: t("quiz.0.question"),
            options: [t("quiz.0.options.0"), t("quiz.0.options.1"), t("quiz.0.options.2")],
            correctIndex: 0,
            difficulty: "easy",
          },
          {
            question: t("quiz.1.question"),
            options: [t("quiz.1.options.0"), t("quiz.1.options.1"), t("quiz.1.options.2")],
            correctIndex: 1,
            difficulty: "easy",
          },
          {
            question: t("quiz.2.question"),
            options: [t("quiz.2.options.0"), t("quiz.2.options.1"), t("quiz.2.options.2")],
            correctIndex: 0,
            difficulty: "medium",
          },
        ]}
        onAnswered={onAnswered}
      />
    </article>
  );
}
