"use client";

import { useTranslations } from "next-intl";
import { GamifiedQuiz } from "../GamifiedQuiz";
import { VoiceNarration } from "@/components/accessibility/VoiceNarration";

type Props = { onAnswered: (correct: boolean) => void };

export function Step5Nominations({ onAnswered }: Props) {
  const t = useTranslations("steps.5");
  const body = t("body");

  const phases = t.raw("phases") as Array<{ phase: string; desc: string }>;
  const icons = ["📝", "🔍", "↩️", "✅"];

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

      <div className="grid gap-3 sm:grid-cols-2">
        {phases.map(({ phase, desc }, i) => (
          <div key={i} className="rounded-xl border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xl">{icons[i]}</span>
              <span className="font-semibold">{phase}</span>
            </div>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      <GamifiedQuiz
        stepNumber={5}
        questions={[
          {
            question: t("quiz.0.question"),
            options: [t("quiz.0.options.0"), t("quiz.0.options.1")],
            correctIndex: 1,
            difficulty: "easy",
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
            difficulty: "medium",
          },
        ]}
        onAnswered={onAnswered}
      />
    </article>
  );
}
