"use client";

import { useTranslations } from "next-intl";
import { CheckCircle, XCircle } from "lucide-react";
import { GamifiedQuiz } from "../GamifiedQuiz";
import { VoiceNarration } from "@/components/accessibility/VoiceNarration";

type Props = { onAnswered: (correct: boolean) => void };

export function Step6Campaigning({ onAnswered }: Props) {
  const t = useTranslations("steps.6");
  const body = t("body");

  const allowed = t.raw("allowed") as string[];
  const prohibited = t.raw("prohibited") as string[];

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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-green-700">
            <CheckCircle size={16} /> {t("allowedTitle")}
          </h3>
          <ul className="space-y-2">
            {allowed.map((item, i) => (
              <li key={i} className="text-sm text-green-800">• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-red-700">
            <XCircle size={16} /> {t("prohibitedTitle")}
          </h3>
          <ul className="space-y-2">
            {prohibited.map((item, i) => (
              <li key={i} className="text-sm text-red-800">• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <GamifiedQuiz
        stepNumber={6}
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
            difficulty: "hard",
          },
        ]}
        onAnswered={onAnswered}
      />
    </article>
  );
}
