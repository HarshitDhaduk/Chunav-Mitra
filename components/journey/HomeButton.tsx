"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Home } from "lucide-react";
import { useJourneyStore } from "@/context/journeyStore";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type Props = { asLogo?: boolean };

export function HomeButton({ asLogo = false }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();

  const { reset } = useJourneyStore();

  function handleConfirm() {
    reset(); // Reset journey on leave
    setOpen(false);
    router.push(`/${locale}`);
  }

  return (
    <>
      {asLogo ? (
        // Logo variant — shown in sidebar header
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-3 px-6 py-5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
          aria-label="Go to home"
        >
          <span className="text-2xl">🗳️</span>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Chunav Mitra</p>
            <p className="text-xs text-slate-400">India Election Guide</p>
          </div>
        </button>
      ) : (
        // Text button variant — shown in sidebar footer and mobile header
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          aria-label="Go to home"
        >
          <Home size={15} />
          Back to Home
        </button>
      )}

      <ConfirmDialog
        open={open}
        variant="warning"
        title="Leave the journey?"
        description="Returning home will reset your current progress and points. Are you sure you want to leave?"
        confirmLabel="Go to Home"
        cancelLabel="Stay Here"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
