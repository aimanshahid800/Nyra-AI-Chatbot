import { Copy, Check } from "lucide-react";
import { useState } from "react";
import type { ChatMessage } from "../services/api";

interface Props {
  message: ChatMessage;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-start gap-3 px-5 py-2.5 animate-slide-up ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && (
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden"
          style={{
            background: "var(--surface-raised)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <img src="/images/nyra-logo.png" alt="Nyra" className="w-6 h-6 object-contain" />
        </div>
      )}

      <div className={`max-w-[75%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className="rounded-[18px] px-4 py-3 text-[13px] leading-[1.65] relative group transition-all duration-200"
          style={{
            background: isUser
              ? "linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(123, 97, 255, 0.06))"
              : "var(--surface-raised)",
            backdropFilter: isUser ? "blur(20px)" : undefined,
            border: isUser
              ? "1px solid rgba(0, 212, 255, 0.12)"
              : "1px solid var(--border-subtle)",
            color: isUser ? "var(--text-primary)" : "var(--text-secondary)",
            borderRadius: isUser ? "18px 18px 5px 18px" : "18px 18px 18px 5px",
            boxShadow: isUser
              ? "0 2px 12px rgba(0, 212, 255, 0.06)"
              : "var(--shadow-sm)",
          }}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>

          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 rounded-[6px] opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
              style={{
                color: "var(--text-ghost)",
                background: "var(--surface-overlay)",
                border: "1px solid var(--border-subtle)",
              }}
              aria-label="Copy message"
            >
              {copied ? <Check size={11} style={{ color: "var(--accent-sage)" }} /> : <Copy size={11} />}
            </button>
          )}
        </div>

        {!isUser && message.agent_used && (
          <span
            className="text-[9.5px] mt-1 px-2 py-0.5 rounded-[6px] font-medium"
            style={{
              color: "var(--text-ghost)",
              background: "var(--surface-raised)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            via {message.agent_used}
          </span>
        )}
      </div>

      {isUser && (
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
          style={{
            background: "var(--accent-warm-subtle)",
            border: "1px solid rgba(212, 149, 106, 0.1)",
            color: "var(--accent-warm)",
          }}
        >
          A
        </div>
      )}
    </div>
  );
}
