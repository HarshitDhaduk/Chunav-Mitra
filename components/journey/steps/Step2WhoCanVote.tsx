"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { GamifiedQuiz } from "../GamifiedQuiz";
import { VoiceNarration } from "@/components/accessibility/VoiceNarration";
import { useJourneyStore } from "@/context/journeyStore";
import { Info, AlertTriangle, Sparkles } from "lucide-react";

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
  const { awardBonus, completedBonuses } = useJourneyStore();
  const [dob, setDob] = useState("");
  const [eligibility, setEligibility] = useState<string | null>(null);
  const [dobError, setDobError] = useState("");
  const [hasChecked, setHasChecked] = useState(false);

  const body = t("body");
  const alreadyAwarded = completedBonuses[2];

  function handleCalc() {
    if (!dob) {
      setDobError(t("dobError"));
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
      setEligibility(t("eligibleOn", { date: getEligibilityDate(dob) }));
    }

    if (!hasChecked && !alreadyAwarded) {
      awardBonus(2, 50);
    }
    setHasChecked(true);
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
      <section className="relative overflow-hidden space-y-3 rounded-2xl border-2 border-orange-100 bg-orange-50/30 p-5 dark:border-orange-900/20 dark:bg-orange-900/10">
        {!hasChecked && !alreadyAwarded && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm animate-bounce">
            <Sparkles size={10} /> {t("dobPoints")}
          </div>
        )}
        
        <label className="flex items-center gap-2 text-sm font-semibold text-orange-800 dark:text-orange-300" htmlFor="dob">
          <Info size={16} />
          {t("ageCalcLabel")}
        </label>
        
        <div className="flex gap-2">
          <input
            id="dob"
            type="date"
            value={dob}
            onChange={(e) => { setDob(e.target.value); setDobError(""); }}
            className={`min-h-[44px] flex-1 rounded-xl border-2 px-3 text-sm transition-all ${
              dobError ? "border-red-400 bg-red-50 focus:border-red-500" : "border-orange-200 bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            } focus:outline-none dark:bg-slate-900`}
            max={new Date().toISOString().split("T")[0]}
          />
          <button
            onClick={handleCalc}
            className="group relative flex items-center gap-2 min-h-[44px] overflow-hidden rounded-xl bg-orange-500 px-6 font-bold text-white transition-all hover:bg-orange-600 hover:shadow-lg active:scale-95"
          >
            <span className="relative z-10">{t("checkButton")}</span>
            <motion.div 
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </button>
        </div>

        <AnimatePresence>
          {/* Validation error */}
          {dobError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-1.5 text-sm font-medium text-red-600"
              role="alert"
            >
              <AlertTriangle size={14} /> {dobError}
            </motion.p>
          )}

          {/* Gamified warning if not checked */}
          {!hasChecked && !alreadyAwarded && !dobError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 text-xs font-medium text-orange-600/80 italic"
            >
              <AlertTriangle size={12} /> {t("warningPoints")}
            </motion.p>
          )}

          {eligibility && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-1 rounded-xl bg-green-500/10 border border-green-500/20 p-3 text-sm font-bold text-green-700 dark:text-green-400"
              aria-live="polite"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} />
                {eligibility}
              </div>
              {!alreadyAwarded && (
                <div className="text-[10px] uppercase tracking-wider opacity-80">
                  Mission Accomplished! +50 XP Earned
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
