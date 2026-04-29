"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { GamifiedQuiz } from "../GamifiedQuiz";
import { VoiceNarration } from "@/components/accessibility/VoiceNarration";

type Props = { onAnswered: (correct: boolean) => void };

// Returns the next qualifying cutoff date (Jan 1, Apr 1, Jul 1, Oct 1) after turning 18
function getEligibilityDate(dob: string): string {
  const birth = new Date(dob);
  const eighteenth = new Date(birth);
  eighteenth.setFullYear(eighteenth.getFullYear() + 18);

  const cutoffs = [
    new Date(eighteenth.getFullYear(), 0, 1),
    new Date(eighteenth.getFullYear(), 3, 1),
    new Date(eighteenth.getFullYear(), 6, 1),
    new Date(eighteenth.getFullYear(), 9, 1),
    new Date(eighteenth.getFullYear() + 1, 0, 1),
  ];

  const next = cutoffs.find((d) => d >= eighteenth) ?? cutoffs[4];
  return next.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export function Step2WhoCanVote({ onAnswered }: Props) {
  const t = useTranslations("steps.2");
  const [dob, setDob] = useState("");
  const [eligibility, setEligibility] = useState<string | null>(null);
  const [dobError, setDobError] = useState("");

  const body = t("body");

  function handleCalc() {
    if (!dob) {
      setDobError("Please enter your date of birth before checking eligibility.");
      return;
    }
    setDobError("");
    const birth = new Date(dob);
    const today = new Date();
    // Accurate age check accounting for month/day
    const age = today.getFullYear() - birth.getFullYear() -
      (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
    if (age >= 18) {
      setEligibility(t("alreadyEligible"));
    } else {
      setEligibility(`You become eligible on ${getEligibilityDate(dob)}`);
    }
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

      {/* Age calculator */}
      <section className="space-y-3 rounded-2xl border bg-card p-5">
        <label className="block text-sm font-medium" htmlFor="dob">
          {t("ageCalcLabel")}
        </label>
        <div className="flex gap-2">
          <input
            id="dob"
            type="date"
            value={dob}
            onChange={(e) => { setDob(e.target.value); setDobError(""); }}
            className={`min-h-[44px] flex-1 rounded-xl border-2 px-3 text-sm transition-colors ${
              dobError ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-orange-400"
            } focus:outline-none`}
            max={new Date().toISOString().split("T")[0]}
          />
          <button
            onClick={handleCalc}
            className="min-h-[44px] rounded-xl bg-orange-500 px-4 font-semibold text-white hover:bg-orange-600"
          >
            Check
          </button>
        </div>

        {/* Validation error */}
        {dobError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-sm font-medium text-red-600"
            role="alert"
          >
            <span>⚠</span> {dobError}
          </motion.p>
        )}
        {eligibility && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700"
            aria-live="polite"
          >
            {eligibility}
          </motion.p>
        )}
      </section>

      <GamifiedQuiz
        stepNumber={2}
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
            difficulty: "medium",
          },
        ]}
        onAnswered={onAnswered}
      />
    </article>
  );
}
