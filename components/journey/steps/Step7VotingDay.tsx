import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { GamifiedQuiz } from "../GamifiedQuiz";
import { VoiceNarration } from "@/components/accessibility/VoiceNarration";
import { useJourneyStore } from "@/context/journeyStore";

type Props = { onAnswered: (correct: boolean) => void };

export function Step7VotingDay({ onAnswered }: Props) {
  const t = useTranslations("steps.7");
  const { addXp, awardBonus, completedBonuses, stepData, setStepData } = useJourneyStore();
  
  // Initialize from persistent store
  const [checked, setChecked] = useState<Set<number>>(() => {
    const saved = stepData[7];
    return Array.isArray(saved) ? new Set(saved as number[]) : new Set();
  });
  
  const [isVerified, setIsVerified] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const body = t("body");
  const alreadyAwarded = completedBonuses[7];

  const boothSteps = t.raw("boothSteps") as Array<{ official: string; action: string }>;
  const checklist = t.raw("checklist") as Array<{ label: string }>;

  const boothIcons = ["👤", "✍️", "🗳️"];
  const checklistIcons = ["🪪", "📄", "📵", "📍", "🏷️", "📜"];
  const correctIndices = [0, 1, 3]; // ID, Slip, Location

  const isCorrectSet = 
    checked.size === correctIndices.length && 
    correctIndices.every(idx => checked.has(idx));

  function handleVerify() {
    setIsVerified(true);
    if (isCorrectSet) {
      setShowError(false);
      if (!alreadyAwarded) {
        awardBonus(7, 50);
      }
    } else {
      setShowError(true);
    }
  }

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      
      // Persist to store
      setStepData(7, Array.from(next));
      return next;
    });
    // Reset verification state on change to force re-verify
    setIsVerified(false);
    setShowError(false);
  }

  return (
    <article className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <VoiceNarration text={body} />
      </div>

      <p className="leading-relaxed text-slate-600 dark:text-slate-300">{body}</p>

      {/* Booth sequence */}
      <div className="grid gap-3 sm:grid-cols-1">
        {boothSteps.map(({ official, action }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-orange-200 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-orange-900"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-2xl dark:bg-orange-900/30">
              {boothIcons[i]}
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-white">{official}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{action}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pre-departure checklist */}
      <section className="relative overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/40">
        {!alreadyAwarded && (
          <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold text-white shadow-sm animate-bounce z-10">
            <Sparkles size={10} /> {t("bonusPoints")}
          </div>
        )}

        <div className="flex items-center gap-2 mb-6">
          <Info size={18} className="text-orange-500" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t("checklistTitle")}</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {checklist.map(({ label }, i) => {
            const isSelected = checked.has(i);
            const isWrong = isSelected && !correctIndices.includes(i);
            
            return (
              <button
                key={i}
                disabled={alreadyAwarded || (isVerified && isCorrectSet)}
                onClick={() => toggle(i)}
                className={`group relative flex min-h-[56px] w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-200 ${
                  isSelected
                    ? isWrong
                      ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
                      : "border-green-500 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400"
                    : "border-white bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700"
                } ${(alreadyAwarded || (isVerified && isCorrectSet)) ? "opacity-80 cursor-default" : ""}`}
                aria-pressed={isSelected}
              >
                <span className={`text-2xl transition-transform group-hover:scale-110 ${isSelected ? "grayscale-0" : "grayscale opacity-70"}`}>
                  {checklistIcons[i]}
                </span>
                <span className="text-sm font-semibold leading-tight">{label}</span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    {isWrong ? (
                      <AlertTriangle size={16} className="text-red-500" />
                    ) : (
                      <CheckCircle size={16} className="text-green-500" />
                    )}
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>

        {/* Gamified Status Area */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {alreadyAwarded || (isVerified && isCorrectSet) ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-sm font-bold text-green-700 dark:text-green-400"
              >
                <CheckCircle size={20} />
                {t("missionComplete")}
              </motion.div>
            ) : (
              <motion.div key="verify-flow" className="space-y-4">
                <button
                  onClick={handleVerify}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 p-3 font-bold text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-600 active:scale-95 dark:shadow-none"
                >
                  {t("verifyButton")}
                </button>

                {showError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex flex-col gap-2"
                  >
                    <p className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                      <AlertTriangle size={14} /> {t("wrongSelection")}
                    </p>
                  </motion.div>
                )}

                {!showError && !alreadyAwarded && (
                  <p className="flex items-center gap-2 text-xs font-medium text-orange-600/80 italic">
                    <AlertTriangle size={14} /> {t("warningPoints")}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Quiz locked until checklist done */}
      {(alreadyAwarded || (isVerified && isCorrectSet)) ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
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
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center dark:border-slate-800 dark:bg-slate-900/20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
            <Info size={32} />
          </div>
          <h4 className="font-bold text-slate-400">Quiz Locked</h4>
          <p className="mt-1 text-sm text-slate-400">Complete the checklist verification above to unlock the quiz and earn points!</p>
        </div>
      )}
    </article>
  );
}
