import ReactMarkdown from "react-markdown";

type Props = { role: "user" | "assistant"; content: string };

export function MessageBubble({ role, content }: Props) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
          isUser
            ? "bg-orange-500 text-white"
            : "border bg-card text-foreground"
        }`}
      >
        {isUser ? (
          content
        ) : (
          <div className="space-y-2 [&>p]:m-0 [&>ul]:m-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:m-0 [&>ol]:list-decimal [&>ol]:pl-5 [&>h1]:font-bold [&>h2]:font-bold [&>h3]:font-bold">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

