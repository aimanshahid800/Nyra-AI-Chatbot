import { useState, useRef, useEffect } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function InputBar({ onSend, disabled }: Props) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-white/5">
      <div className="flex items-end gap-3 glass-strong rounded-2xl px-4 py-3 glow-purple">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Nyra anything..."
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent outline-none resize-none text-sm text-gray-200 placeholder-gray-500 max-h-[120px]"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 flex-shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m-7 7l7-7 7 7" />
          </svg>
        </button>
      </div>
      <p className="text-[10px] text-gray-600 text-center mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
