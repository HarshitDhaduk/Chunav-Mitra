"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ControlUnit } from "./ControlUnit";
import { BallotingUnit } from "./BallotingUnit";
import { VVPATDisplay } from "./VVPATDisplay";
import { useJourneyStore } from "@/context/journeyStore";

type SimulatorState = "idle" | "ballot-released" | "vote-cast" | "vvpat" | "complete";

export type Candidate = { id: number; name: string; symbol: string };

const CANDIDATES: Candidate[] = [
  { id: 1, name: "Arjun Kumar", symbol: "🍎" },
  { id: 2, name: "Priya Sharma", symbol: "🚲" },
  { id: 3, name: "Ravi Patel", symbol: "⭐" },
  { id: 4, name: "NOTA", symbol: "🚫" },
];

export function EVMSimulator() {
  const t = useTranslations("simulator");
  const { addBadge, addXp } = useJourneyStore();
  const [state, setState] = useState<SimulatorState>("idle");
  const [selected, setSelected] = useState<Candidate | null>(null);

  function handleBallotPress() {
    setState("ballot-released");
  }

  function handleVote(candidate: Candidate) {
    setSelected(candidate);
    setState("vvpat");
  }

  function handleVVPATComplete() {
    setState("complete");
    addBadge("simulatorPro");
    addXp(0, 50); // simulator bonus XP
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ControlUnit onBallotPress={handleBallotPress} />
          </motion.div>
        )}

        {state === "ballot-released" && (
          <motion.div key="ballot" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <BallotingUnit candidates={CANDIDATES} onVote={handleVote} />
          </motion.div>
        )}

        {state === "vvpat" && selected && (
          <motion.div key="vvpat" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <VVPATDisplay candidate={selected} onComplete={handleVVPATComplete} />
          </motion.div>
        )}

        {state === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <div className="text-6xl">🎉</div>
            <h2 className="text-xl font-bold text-green-600">{t("complete")}</h2>

            {/* Security facts */}
            <div className="rounded-2xl border bg-card p-5 text-left">
              <h3 className="mb-3 font-semibold">🔒 Why EVMs are Secure</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {(["noPower", "noInternet", "otp", "rateLimit"] as const).map((key) => (
                  <li key={key} className="flex gap-2">
                    <span>•</span>
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => { setState("idle"); setSelected(null); }}
              className="min-h-[44px] w-full rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
