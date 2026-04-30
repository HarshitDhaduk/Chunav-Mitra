"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import type { Candidate } from "./EVMSimulator";

type Props = { candidate: Candidate; onComplete: () => void };

export function VVPATDisplay({ candidate, onComplete }: Props) {
  const t = useTranslations("simulator");
  const [secondsLeft, setSecondsLeft] = useState(7);
  const [slipVisible, setSlipVisible] = useState(true);

  useEffect(() => {
    // Beep sound via Web Audio API
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.start();
    osc.stop(ctx.currentTime + 0.3);

    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setSlipVisible(false);
          setTimeout(onComplete, 800);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="space-y-4 rounded-2xl border-2 border-gray-300 bg-gray-100 p-6">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-500">
        {t("vvpatMachine")}
      </p>
      <h3 className="text-center font-semibold">{t("vvpatTitle")}</h3>
      <p className="text-center text-sm text-muted-foreground">{t("vvpatDesc")}</p>

      {/* Transparent window */}
      <div className="relative mx-auto h-32 w-48 overflow-hidden rounded-xl border-4 border-gray-400 bg-white">
        <AnimatePresence>
          {slipVisible && (
            <motion.div
              initial={{ y: -80 }}
              animate={{ y: 0 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex h-full flex-col items-center justify-center gap-1 p-3 text-center"
            >
              <span className="text-3xl">{candidate.symbol}</span>
              <span className="text-xs font-bold">{candidate.name}</span>
              <span className="text-xs text-gray-500">{t("serialNo")} {candidate.id}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Countdown */}
      <div className="text-center">
        <motion.span
          key={secondsLeft}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold text-orange-500"
          aria-live="polite"
          aria-label={`${secondsLeft} ${t("secondsRemaining")}`}
        >
          {secondsLeft}
        </motion.span>
        <p className="text-xs text-gray-500">{t("secondsRemaining")}</p>
      </div>

      {/* Sealed box */}
      <div className="flex items-center justify-center gap-2 rounded-xl bg-gray-800 p-3 text-white">
        <span>🔒</span>
        <span className="text-xs">{t("sealedBox")}</span>
      </div>
    </div>
  );
}
