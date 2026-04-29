"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GamifiedQuiz } from "../GamifiedQuiz";
import { VoiceNarration } from "@/components/accessibility/VoiceNarration";

type Props = { onAnswered: (correct: boolean) => void };

export function Step9Government({ onAnswered }: Props) {
  const t = useTranslations("steps.9");
  const tCommon = useTranslations("common");
  const [expanded, setExpanded] = useState(false);
  const body = t("body");

  const presidentialSteps = t.raw("presidentialSteps") as string[];

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

      {/* Majority visual */}
      <div className="rounded-2xl bg-orange-50 p-5 text-center">
        <p className="text-4xl font-bold text-orange-600">272</p>
        <p className="mt-1 text-sm text-orange-700">{t("majorityTitle")}</p>
        <div className="mt-3 h-4 w-full overflow-hidden rounded-full bg-orange-200">
          <div className="h-full w-1/2 rounded-full bg-orange-500" />
        </div>
      </div>

      {/* Hung Parliament accordion */}
      <div className="rounded-2xl border bg-card">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex min-h-[44px] w-full items-center justify-between px-5 py-4 font-semibold text-left"
          aria-expanded={expanded}
        >
          {tCommon("learnMore")}: {t("hungTitle")}
          <motion.span animate={{ rotate: expanded ? 180 : 0 }}>
            <ChevronDown size={18} />
          </motion.span>
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 px-5 pb-5 text-sm text-muted-foreground">
                <p>{t("hungDesc")}</p>
                <p>{t("presidentialTitle")}</p>
                <ol className="ml-4 list-decimal space-y-1">
                  {presidentialSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <GamifiedQuiz
        stepNumber={9}
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
