"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { useJourneyStore } from "@/context/journeyStore";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type Props = { asLogo?: boolean };

export function HomeButton({ asLogo = false }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("journey.dialogs.leave");
  const common = useTranslations("common");

  const { reset } = useJourneyStore();

  function handleConfirm() {
    reset(); // Reset journey on leave
    setOpen(false);
    router.push(`/${locale}` as any);
  }

  return (
    <>
      {asLogo ? (
        // Logo variant — shown in sidebar or header
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-80"
          aria-label={t("title")}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-xl dark:bg-orange-900/30">
            🗳️
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-slate-900 dark:text-white">
              Chunav Mitra
            </p>
            <p className="text-[10px] leading-tight text-slate-400">
              India Election Guide
            </p>
          </div>
        </button>
      ) : (
        // Text button variant — shown in sidebar footer and mobile header
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          aria-label={t("title")}
        >
          <Home size={15} />
          {common("back")}
        </button>
      )}

      <ConfirmDialog
        open={open}
        variant="warning"
        title={t("title")}
        description={t("description")}
        confirmLabel={t("confirm")}
        cancelLabel={t("cancel")}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
