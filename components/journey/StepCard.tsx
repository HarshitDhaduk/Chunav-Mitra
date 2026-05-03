"use client";

import { useState, lazy, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import { useJourneyStore } from "@/context/journeyStore";
import { COMPLETION_BONUS } from "@/lib/journey-config";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const STEP_COMPONENTS = {
  1: lazy(() => import("./steps/Step1WhatIsElection").then((m) => ({ default: m.Step1WhatIsElection }))),
  2: lazy(() => import("./steps/Step2WhoCanVote").then((m) => ({ default: m.Step2WhoCanVote }))),
  3: lazy(() => import("./steps/Step3Registration").then((m) => ({ default: m.Step3Registration }))),
  4: lazy(() => import("./steps/Step4Timeline").then((m) => ({ default: m.Step4Timeline }))),
  5: lazy(() => import("./steps/Step5Nominations").then((m) => ({ default: m.Step5Nominations }))),
  6: lazy(() => import("./steps/Step6Campaigning").then((m) => ({ default: m.Step6Campaigning }))),
  7: lazy(() => import("./steps/Step7VotingDay").then((m) => ({ default: m.Step7VotingDay }))),
  8: lazy(() => import("./steps/Step8Counting").then((m) => ({ default: m.Step8Counting }))),
  9: lazy(() => import("./steps/Step9Government").then((m) => ({ default: m.Step9Government }))),
} as const;

type Props = { stepNumber: number; totalSteps: number };

export function StepCard({ stepNumber, totalSteps }: Props) {
  const t = useTranslations("common");
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const { setStep, addXp } = useJourneyStore();

  const [quizAnswered, setQuizAnswered] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  const StepComponent = STEP_COMPONENTS[stepNumber as keyof typeof STEP_COMPONENTS];
  const isLastStep = stepNumber === totalSteps;

  function goTo(step: number) {
    setStep(step);
    router.push(`/${locale}/journey/${step}`);
  }

  function advance() {
    addXp(stepNumber, COMPLETION_BONUS);
    if (!isLastStep) goTo(stepNumber + 1);
    else router.push(`/${locale}/simulator`);
  }

  // User clicks Next — validate quiz first
  function handleNextClick() {
    if (!quizAnswered) {
      setShowSkipConfirm(true);
      return;
    }
    setShowCompleteConfirm(true);
  }

  // Confirmed skip quiz → advance without quiz points
  function handleSkipConfirmed() {
    setShowSkipConfirm(false);
    advance();
  }

  // Confirmed step complete → advance with points
  function handleCompleteConfirmed() {
    setShowCompleteConfirm(false);
    advance();
  }

  function handleQuizAnswered(correct: boolean) {
    setQuizAnswered(true);
    advance();
  }

  const d = useTranslations("journey.dialogs");

  return (
    <>
      <motion.div
        key={stepNumber}
        initial={{ opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -32 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6"
      >
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center text-slate-400">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            </div>
          }
        >
          <StepComponent onAnswered={handleQuizAnswered} />
        </Suspense>

        {/* Navigation bar */}
        <div className="flex items-center gap-3 border-t pt-4">
          {stepNumber > 1 && (
            <button
              onClick={() => goTo(stepNumber - 1)}
              className="flex min-h-[44px] items-center gap-1.5 rounded-xl border-2 border-slate-200 px-5 font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={16} /> {t("back")}
            </button>
          )}

          <div className="flex flex-1 items-center justify-end gap-2">
            {/* Skip quiz hint — only shown when quiz not answered */}
            {!quizAnswered && (
              <button
                onClick={() => setShowSkipConfirm(true)}
                className="flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <SkipForward size={14} /> {t("skip")}
              </button>
            )}

            <button
              onClick={handleNextClick}
              className={`flex min-h-[44px] items-center gap-2 rounded-xl px-6 font-semibold text-white transition-all ${
                quizAnswered
                  ? "bg-orange-500 shadow-lg shadow-orange-200 hover:bg-orange-600 dark:shadow-orange-900"
                  : "bg-slate-400 hover:bg-slate-500"
              }`}
            >
              {isLastStep ? t("finish") : t("next")}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Skip quiz confirmation */}
      <ConfirmDialog
        open={showSkipConfirm}
        variant="warning"
        title={d("skip.title")}
        description={d("skip.description")}
        confirmLabel={d("skip.confirm")}
        cancelLabel={d("skip.cancel")}
        onConfirm={handleSkipConfirmed}
        onCancel={() => setShowSkipConfirm(false)}
      />

      {/* Step complete confirmation */}
      <ConfirmDialog
        open={showCompleteConfirm}
        variant="success"
        title={isLastStep ? d("complete.titleLast") : d("complete.title")}
        description={
          isLastStep
            ? d("complete.descriptionLast")
            : d("complete.description", { current: stepNumber, next: stepNumber + 1 })
        }
        confirmLabel={isLastStep ? d("complete.confirmLast") : d("complete.confirm")}
        cancelLabel={d("complete.cancel")}
        onConfirm={handleCompleteConfirmed}
        onCancel={() => setShowCompleteConfirm(false)}
      />
    </>
  );
}
