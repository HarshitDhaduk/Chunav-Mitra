"use client";

import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen, Cpu, MessageCircle, Globe, ShieldCheck, Accessibility,
  ChevronRight, GraduationCap, Vote, Users, Star, ArrowRight,
} from "lucide-react";
import { useJourneyStore, type Persona } from "@/context/journeyStore";

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

// ─── Sub-components ───────────────────────────────────────────────────────────

function Navbar() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">Chunav Mitra</span>
        </div>
        <div className="flex items-center gap-2">
          {["en", "hi", "gu"].map((l) => (
            <button
              key={l}
              onClick={() => router.push(`/${l}` as any)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                locale === l
                  ? "bg-orange-500 text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {l === "en" ? "EN" : l === "hi" ? "हि" : "ગુ"}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const t = useTranslations("landing");
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-24 pt-32">
      {/* India flag colour accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-green-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Floating emoji decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="animate-float absolute left-[8%] top-[20%] text-4xl opacity-20">🗳️</span>
        <span className="animate-float-delay absolute right-[10%] top-[30%] text-3xl opacity-20">🏛️</span>
        <span className="animate-float absolute bottom-[25%] left-[15%] text-3xl opacity-20">📋</span>
        <span className="animate-float-delay absolute bottom-[20%] right-[8%] text-4xl opacity-20">🇮🇳</span>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-300"
        >
          <ShieldCheck size={12} />
          {t("badge")}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-4 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl"
        >
          {t("heroTitle")}{" "}
          <span className="gradient-text">{t("heroTitleHighlight")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg"
        >
          {t("heroSubtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button
            onClick={() => router.push(`/${locale}/journey/1` as any)}
            className="group flex min-h-[52px] items-center gap-2 rounded-2xl bg-orange-500 px-8 py-3 font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-600 hover:shadow-orange-500/50"
          >
            {t("ctaPrimary")}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => router.push(`/${locale}/simulator` as any)}
            className="flex min-h-[52px] items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
          >
            <Cpu size={18} />
            {t("ctaSimulator")}
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-4"
        >
          {[
            { value: t("statsVoters"), desc: t("statsVotersDesc"), icon: "🗳️" },
            { value: t("statsSteps"), desc: t("statsStepsDesc"), icon: "📚" },
            { value: t("statsLanguages"), desc: t("statsLanguagesDesc"), icon: "🌐" },
          ].map(({ value, desc, icon }) => (
            <div key={value} className="glass rounded-2xl p-4 text-center">
              <div className="mb-1 text-2xl">{icon}</div>
              <div className="text-lg font-black text-white sm:text-xl">{value}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const t = useTranslations("landing");

  const FEATURES = [
    { icon: <BookOpen size={22} />, title: t("feature1Title"), desc: t("feature1Desc"), color: "bg-blue-500" },
    { icon: <Cpu size={22} />, title: t("feature2Title"), desc: t("feature2Desc"), color: "bg-orange-500" },
    { icon: <MessageCircle size={22} />, title: t("feature3Title"), desc: t("feature3Desc"), color: "bg-purple-500" },
    { icon: <Globe size={22} />, title: t("feature4Title"), desc: t("feature4Desc"), color: "bg-green-500" },
    { icon: <ShieldCheck size={22} />, title: t("feature5Title"), desc: t("feature5Desc"), color: "bg-red-500" },
    { icon: <Accessibility size={22} />, title: t("feature6Title"), desc: t("feature6Desc"), color: "bg-teal-500" },
  ];

  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
            {t("featuresTitle")}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-slate-500 dark:text-slate-400">
            {t("featuresSubtitle")}
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map(({ icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              variants={fadeUp}
              custom={i}
              className="group rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className={`mb-4 inline-flex rounded-xl ${color} p-3 text-white`}>
                {icon}
              </div>
              <h3 className="mb-2 font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const t = useTranslations("landing");

  const STEPS = [
    { num: "01", title: t("how1Title"), desc: t("how1Desc"), icon: "👤" },
    { num: "02", title: t("how2Title"), desc: t("how2Desc"), icon: "🏆" },
    { num: "03", title: t("how3Title"), desc: t("how3Desc"), icon: "🗳️" },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
            {t("howTitle")}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-slate-500 dark:text-slate-400">
            {t("howSubtitle")}
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-3"
        >
          {STEPS.map(({ num, title, desc, icon }, i) => (
            <motion.div key={num} variants={fadeUp} custom={i} className="relative text-center">
              {/* Connector line */}
              {i < 2 && (
                <div className="absolute left-[calc(50%+3rem)] top-10 hidden h-0.5 w-[calc(100%-6rem)] bg-gradient-to-r from-orange-300 to-orange-100 sm:block" />
              )}
              <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-200 dark:shadow-orange-900">
                <span className="text-3xl">{icon}</span>
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
                  {num}
                </span>
              </div>
              <h3 className="mb-2 font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PersonaSelectorSection() {
  const t = useTranslations("landing");
  const tPersona = useTranslations("persona");
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const { setPersona, reset } = useJourneyStore();

  const PERSONAS: { key: Persona; icon: React.ReactNode; gradient: string; emoji: string }[] = [
    { key: "student", icon: <GraduationCap size={28} />, gradient: "from-blue-500 to-blue-700", emoji: "📚" },
    { key: "first-time", icon: <Vote size={28} />, gradient: "from-orange-500 to-orange-700", emoji: "🗳️" },
    { key: "general", icon: <Users size={28} />, gradient: "from-green-500 to-green-700", emoji: "👥" },
  ];

  function handleSelect(persona: Persona) {
    reset(); // Reset scores/progress when starting fresh
    setPersona(persona);
    router.push(`/${locale}/journey/1` as any);
  }

  return (
    <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-black text-white sm:text-4xl">
            {t("personaTitle")}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-slate-400">
            {t("personaSubtitle")}
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-5 sm:grid-cols-3"
        >
          {PERSONAS.map(({ key, gradient, emoji }, i) => (
            <motion.button
              key={key}
              variants={fadeUp}
              custom={i}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(key)}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 text-left shadow-xl`}
            >
              {/* Background emoji watermark */}
              <span className="absolute -bottom-4 -right-4 text-8xl opacity-10 transition-transform group-hover:scale-110">
                {emoji}
              </span>

              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-white/20 p-3 text-white">
                  {/* icon rendered via persona key */}
                  {key === "student" && <GraduationCap size={24} />}
                  {key === "first-time" && <Vote size={24} />}
                  {key === "general" && <Users size={24} />}
                </div>
                <h3 className="mb-1 text-lg font-bold text-white">{tPersona(key)}</h3>
                <p className="text-sm text-white/80">
                  {tPersona(`${key}Desc` as Parameters<typeof tPersona>[0])}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-white/70">
                  Start Journey <ChevronRight size={14} />
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const t = useTranslations("landing");

  return (
    <footer className="border-t bg-white py-10 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Chunav Mitra</span>
          </div>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">{t("footerTagline")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: <ShieldCheck size={13} />, label: t("footerEci") },
              { icon: <Star size={13} />, label: t("footerNeutral") },
              { icon: <Globe size={13} />, label: t("footerFree") },
            ].map(({ icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400"
              >
                {icon} {label}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Chunav Mitra. Built in alignment with ECI SVEEP guidelines.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PersonaSelectorSection />
      <Footer />
    </div>
  );
}
