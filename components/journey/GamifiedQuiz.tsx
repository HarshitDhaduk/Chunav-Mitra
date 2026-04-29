"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { useJourneyStore } from "@/context/journeyStore";
import { DIFFICULTY_POINTS, type Difficulty } from "@/lib/journey-config";

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  difficulty?: Difficulty;
};

type Props = {
  stepNumber: number;
  questions: QuizQuestion[];
  onAnswered: (correct: boolean, autoAdvance?: boolean) => void;
};

export function GamifiedQuiz({ stepNumber, questions, onAnswered }: Props) {
  const t = useTranslations("journey");
  const { addXp } = useJourneyStore();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);

  const q = questions[current];
  const answered = selected !== null;
  const isCorrect = selected === q.correctIndex;
  const isLast = current === questions.length - 1;

  function handleAnswer(index: number) {
    if (answered) return;
    setSelected(index);
    const correct = index === q.correctIndex;
    if (correct) {
      const xp = DIFFICULTY_POINTS[q.difficulty || "easy"];
      addXp(stepNumber, xp);
    }
  }

  function handleNext() {
    const correct = selected === q.correctIndex;
    const newResults = [...results, correct];
    setResults(newResults);

    if (isLast) {
      // All questions done — report overall as correct if at least half correct
      const totalCorrect = newResults.filter(Boolean).length;
      onAnswered(totalCorrect >= Math.ceil(questions.length / 2), true); // autoAdvance=true on finish
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  return (
    <section
      aria-label={t("quizTitle")}
      className="space-y-4 rounded-2xl border-2 border-slate-100 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
            ?
          </span>
          <h3 className="font-semibold text-slate-800 dark:text-white">{t("quizTitle")}</h3>
        </div>
        {/* Question counter */}
        <span className="text-xs font-medium text-slate-400">
          {current + 1} / {questions.length}
        </span>
      </div>

      {/* Progress dots */}
      {questions.length > 1 && (
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i < current
                  ? results[i]
                    ? "bg-green-400"
                    : "bg-red-400"
                  : i === current
                  ? "bg-orange-400"
                  : "bg-slate-200 dark:bg-slate-600"
              }`}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{q.question}</p>

          <div className="grid gap-2">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const correct = answered && i === q.correctIndex;
              const wrong = answered && isSelected && !isCorrect;

              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                  className={`min-h-[44px] rounded-xl border-2 px-4 py-2.5 text-left text-sm font-medium transition-all ${
                    correct
                      ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : wrong
                      ? "border-red-400 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : isSelected
                      ? "border-orange-400 bg-orange-50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
                      : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:border-orange-500 dark:hover:bg-orange-900/20 dark:hover:text-orange-300"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                        correct
                          ? "border-green-500 bg-green-500 text-white"
                          : wrong
                          ? "border-red-400 bg-red-400 text-white"
                          : "border-current"
                      }`}
                    >
                      {correct ? "✓" : wrong ? "✗" : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 rounded-xl p-3 text-sm font-medium ${
                  isCorrect
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                }`}
                aria-live="polite"
              >
                {isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {isCorrect
                  ? t("quizCorrect", { points: DIFFICULTY_POINTS[q.difficulty || "easy"] })
                  : t("quizWrong", { answer: q.options[q.correctIndex] })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next question / finish button */}
          {answered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleNext}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-orange-500 font-semibold text-white hover:bg-orange-600"
            >
              {isLast ? t("completeStep") : "Next Question"}
              <ChevronRight size={16} />
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
