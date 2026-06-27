export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-5 py-2.5 animate-slide-up">
      <div
        className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <img src="/images/nyra-logo.png" alt="Nyra" className="w-6 h-6 object-contain" />
      </div>
      <div
        className="rounded-[18px] rounded-tl-[5px] px-4 py-3 flex items-center gap-2"
        style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full typing-dot" style={{ background: "var(--accent-cyan)" }} />
        <div className="w-1.5 h-1.5 rounded-full typing-dot" style={{ background: "var(--accent-cyan)", opacity: 0.5 }} />
        <div className="w-1.5 h-1.5 rounded-full typing-dot" style={{ background: "var(--accent-cyan)", opacity: 0.25 }} />
      </div>
    </div>
  );
}
