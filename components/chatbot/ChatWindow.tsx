"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Send, X } from "lucide-react";
import { MessageBubble } from "./MessageBubble";

type Message = { role: "user" | "assistant"; content: string };

type Props = { onClose: () => void };

export function ChatWindow({ onClose }: Props) {
  const t = useTranslations("chatbot");
  const suggestions = t.raw("suggestions") as string[];
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("chunavMitraChatHistory");
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
    setIsInitialized(true);
  }, []);

  // Save to sessionStorage on change
  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem("chunavMitraChatHistory", JSON.stringify(messages));
    }
  }, [messages, isInitialized]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let assistantText = "";

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    if (reader) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          // eslint-disable-next-line react-hooks/immutability
          assistantText += decoder.decode(value, { stream: true });
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: assistantText },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: "Sorry, something went wrong. Please try again." },
        ]);
      }
    }

    setLoading(false);
  }

  return (
    <div className="flex h-[480px] flex-col rounded-2xl border bg-background shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-2xl bg-orange-500 px-4 py-3 text-white">
        <div>
          <p className="font-bold">{t("title")}</p>
          <p className="text-xs opacity-90">{t("subtitle")}</p>
        </div>
        <button onClick={onClose} className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-orange-600" aria-label="Close chat">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-center text-xs text-muted-foreground">{t("prompt")}</p>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="w-full rounded-xl border px-3 py-2 text-left text-sm hover:bg-muted"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {loading && messages[messages.length - 1]?.role === "user" && (
          <MessageBubble role="assistant" content="..." />
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
        className="flex gap-2 border-t p-3"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          placeholder={t("placeholder")}
          className="min-h-[44px] max-h-[120px] flex-1 resize-none rounded-xl border px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          aria-label="Chat input"
          rows={1}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
