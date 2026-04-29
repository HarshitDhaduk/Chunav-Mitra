"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useJourneyStore } from "@/context/journeyStore";

const TOTAL_STEPS = 9;

export function TimelineSlider() {
  const t = useTranslations("journey");
  const { step } = useParams<{ step?: string }>();
  const { totalPoints, currentStep } = useJourneyStore();
  const active = step ? parseInt(step, 10) : currentStep;

  return (
    <div className="flex flex-1 items-center gap-4">
      {/* Step dots */}
      <div className="flex flex-1 items-center gap-1 overflow-x-auto">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => {
          const n = i + 1;
          const done = n < active;
          const current = n === active;
          return (
            <div key={n} className="flex items-center">
              <motion.div
                animate={{ scale: current ? 1.2 : 1 }}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  done
                    ? "bg-green-500 text-white"
                    : current
                    ? "bg-orange-500 text-white ring-2 ring-orange-300"
                    : "bg-muted text-muted-foreground"
                }`}
                aria-label={`Step ${n}`}
              >
                {done ? "✓" : n}
              </motion.div>
              {n < TOTAL_STEPS && (
                <div className={`h-0.5 w-4 ${done ? "bg-green-500" : "bg-muted"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Points */}
      <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
        <Star size={14} />
        <span>{totalPoints}</span>
      </div>

      <p className="hidden text-xs text-muted-foreground sm:block">
        {t("stepOf", { current: active, total: TOTAL_STEPS })}
      </p>
    </div>
  );
}
