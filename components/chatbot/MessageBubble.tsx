type Props = { role: "user" | "assistant"; content: string };

export function MessageBubble({ role, content }: Props) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
          isUser
            ? "bg-orange-500 text-white"
            : "border bg-card text-foreground"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
