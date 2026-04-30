"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { Candidate } from "./EVMSimulator";

type Props = { candidates: Candidate[]; onVote: (candidate: Candidate) => void };

export function BallotingUnit({ candidates, onVote }: Props) {
  const t = useTranslations("simulator");

  return (
    <div className="rounded-2xl border-2 border-gray-300 bg-gray-100 p-6">
      <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-gray-500">
        {t("ballotingUnit")}
      </p>
      <p className="mb-4 text-center text-sm font-medium">{t("chooseCandidate")}</p>

      <div className="space-y-3">
        {candidates.map((candidate) => (
          <motion.button
            key={candidate.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onVote(candidate)}
            className="flex min-h-[56px] w-full items-center gap-4 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 hover:border-blue-400"
            aria-label={`Vote for ${candidate.name}`}
          >
            {/* Serial number */}
            <span className="w-6 text-center text-sm font-bold text-gray-500">{candidate.id}</span>

            {/* Symbol */}
            <span className="text-2xl">{candidate.symbol}</span>

            {/* Name */}
            <span className="flex-1 text-left font-medium">
              {candidate.id === 4 ? t("nota") : candidate.name}
            </span>

            {/* Blue vote button */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
              ▶
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
