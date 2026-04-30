"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

type Props = { onBallotPress: () => void };

export function ControlUnit({ onBallotPress }: Props) {
  const t = useTranslations("simulator");

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border-2 border-gray-300 bg-gray-100 p-8">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{t("controlUnit")}</p>
        <p className="mt-1 text-sm text-gray-600">{t("official")}</p>
      </div>

      {/* Status light */}
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <span className="text-xs text-gray-500">{t("waiting")}</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBallotPress}
        className="min-h-[56px] min-w-[120px] rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg hover:bg-blue-700"
        aria-label={t("ballotBtn")}
      >
        {t("ballotBtn")}
      </motion.button>

      <p className="text-center text-xs text-gray-500">{t("pressBallot")}</p>
    </div>
  );
}
