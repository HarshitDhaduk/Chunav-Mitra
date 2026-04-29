"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { ChatWindow } from "./ChatWindow";

export function ChunавMitraFAB() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-4 z-40 w-[min(380px,calc(100vw-2rem))]"
          >
            <ChatWindow onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-40 flex min-h-[56px] min-w-[56px] items-center justify-center rounded-full bg-orange-500 text-white shadow-xl hover:bg-orange-600"
        aria-label={open ? "Close Chunav Mitra" : "Open Chunav Mitra chatbot"}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>
    </>
  );
}
