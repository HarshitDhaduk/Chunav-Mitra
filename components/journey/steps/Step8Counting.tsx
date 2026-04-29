"use client";

import { useTranslations } from "next-intl";
import { GamifiedQuiz } from "../GamifiedQuiz";
import { VoiceNarration } from "@/components/accessibility/VoiceNarration";

type Props = { onAnswered: (correct: boolean) => void };

export function Step8Counting({ onAnswered }: Props) {
  const t = useTranslations("steps.8");
  const body = t("body");

  const countingSteps = t.raw("countingSteps") as Array<{ time: string; event: string }>;
  const icons = ["⏰", "✉️", "🖥️", "🔍"];

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

      <div className="space-y-3">
        {countingSteps.map(({ time, event }, i) => (
          <div key={i} className="flex gap-4 rounded-xl border bg-card p-4">
            <span className="text-2xl">{icons[i]}</span>
            <div>
              <p className="text-xs font-bold text-orange-500">{time}</p>
              <p className="text-sm">{event}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-blue-50 p-5">
        <h3 className="mb-2 font-semibold text-blue-800">🛡️ {t("vvpatTitle")}</h3>
        <p className="text-sm text-blue-700">
          {t("vvpatDesc")}
        </p>
      </div>

      <GamifiedQuiz
        stepNumber={8}
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
        ]}
        onAnswered={onAnswered}
      />
    </article>
  );
}
