import { useState, useRef, useEffect } from "react";
import { ArrowUp, Paperclip, Mic } from "lucide-react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function InputBar({ onSend, disabled }: Props) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = input.trim().length > 0 && !disabled;

  return (
    <div className="px-5 pb-5 pt-1 flex justify-center relative z-20">
      <div className="w-full max-w-[720px]" id="input-main">
        <div id="input-poda" className="relative">
          <div className="input-neon-glow" />
          <div className="input-neon-layer input-neon-dark" />
          <div className="input-neon-layer input-neon-dark" />
          <div className="input-neon-layer input-neon-white" />
          <div className="input-neon-layer input-neon-border" />

          <div
            id="input-inner"
            className="relative w-full rounded-[12px] overflow-hidden"
            style={{ background: "var(--surface-raised)" }}
          >
            <div className="flex items-end gap-1.5 p-3 pl-4 pr-2.5">
              <button
                className="p-2 rounded-[var(--radius-sm)] flex-shrink-0 mb-0.5 transition-all duration-200 cursor-pointer hover:bg-white/[0.04]"
                style={{ color: "var(--text-ghost)" }}
                aria-label="Attach file"
              >
                <Paperclip size={16} />
              </button>

              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Nyra anything..."
                disabled={disabled}
                rows={1}
                className="flex-1 bg-transparent outline-none resize-none text-[13.5px] py-2 max-h-[160px]"
                style={{ color: "var(--text-primary)" }}
              />

              <div className="flex items-center gap-1 flex-shrink-0 mb-0.5">
                <button
                  className="p-2 rounded-[var(--radius-sm)] transition-all duration-200 cursor-pointer hover:bg-white/[0.04]"
                  style={{ color: "var(--text-ghost)" }}
                  aria-label="Voice input"
                >
                  <Mic size={16} />
                </button>

                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center transition-all duration-200 cursor-pointer"
                  style={{
                    background: canSend
                      ? "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))"
                      : "rgba(0, 212, 255, 0.06)",
                    color: canSend ? "#09090b" : "var(--text-ghost)",
                    boxShadow: canSend ? "0 2px 12px rgba(0, 212, 255, 0.25)" : "none",
                  }}
                  aria-label="Send message"
                >
                  <ArrowUp size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-5 pb-3">
              <span className="text-[10px] font-medium" style={{ color: "var(--text-ghost)" }}>
                Shift + Enter for new line
              </span>
              {input.length > 0 && (
                <span className="text-[10px] font-medium" style={{ color: "var(--text-ghost)" }}>
                  {input.length} / 2000
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
