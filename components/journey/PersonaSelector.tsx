"use client";

import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, Vote, Users } from "lucide-react";
import { useJourneyStore, type Persona } from "@/context/journeyStore";

const PERSONAS: { key: Persona; icon: React.ReactNode; color: string }[] = [
  { key: "student", icon: <GraduationCap size={32} />, color: "from-blue-500 to-blue-600" },
  { key: "first-time", icon: <Vote size={32} />, color: "from-orange-500 to-orange-600" },
  { key: "general", icon: <Users size={32} />, color: "from-green-500 to-green-600" },
];

export function PersonaSelector() {
  const t = useTranslations("persona");
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const { setPersona } = useJourneyStore();

  function handleSelect(persona: Persona) {
    setPersona(persona);
    router.push(`/${locale}/journey/1`);
  }

  return (
    <div className="w-full max-w-2xl space-y-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        {PERSONAS.map(({ key, icon, color }, i) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(key)}
            className={`flex min-h-[160px] min-w-[44px] flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-lg`}
            aria-label={t(key)}
          >
            {icon}
            <span className="text-lg font-semibold">{t(key)}</span>
            <span className="text-sm opacity-90">
              {t(`${key}Desc` as Parameters<typeof t>[0])}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
