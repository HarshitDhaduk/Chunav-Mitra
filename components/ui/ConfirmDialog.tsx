"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "warning" | "success";
};

export function ConfirmDialog({
  open, title, description, confirmLabel, cancelLabel,
  onConfirm, onCancel, variant = "warning",
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 z-[70] w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <button
              onClick={onCancel}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="flex flex-col items-center gap-4 text-center">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                variant === "warning" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"
              }`}>
                <AlertTriangle size={26} />
              </div>

              <div>
                <h2 id="dialog-title" className="text-lg font-bold text-slate-900 dark:text-white">
                  {title}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
              </div>

              <div className="flex w-full gap-3">
                <button
                  onClick={onCancel}
                  className="min-h-[44px] flex-1 rounded-xl border border-slate-200 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  className={`min-h-[44px] flex-1 rounded-xl font-semibold text-white ${
                    variant === "warning"
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
