import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquare, Trash2, X, Hash, Clock } from "lucide-react";
import type { ChatSession } from "../services/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
}

function groupByDate(sessions: ChatSession[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;
  const groups: { label: string; items: ChatSession[] }[] = [];
  const map = new Map<string, ChatSession[]>();
  for (const s of [...sessions].reverse()) {
    let label: string;
    if (s.createdAt >= today) label = "Today";
    else if (s.createdAt >= yesterday) label = "Yesterday";
    else {
      const d = new Date(s.createdAt);
      label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    if (!map.has(label)) {
      map.set(label, []);
      groups.push({ label, items: map.get(label)! });
    }
    map.get(label)!.push(s);
  }
  return groups;
}

export default function Sidebar({ isOpen, onClose, sessions, activeSessionId, onSelectSession, onNewChat, onDeleteSession }: Props) {
  const groups = groupByDate(sessions);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:relative z-50 top-0 left-0 h-full w-[280px] flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          background: "linear-gradient(180deg, rgba(110, 100, 252, 0.2) 0%, var(--surface-base) 40%)",
          borderRight: "1px solid var(--border-subtle)",
        }}
      >
        {/* Logo */}
        <div className="p-5 pb-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img src="/images/nyra-logo.png" alt="Nyra" className="w-full h-full object-contain" />
                </div>
                <div
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                  style={{
                    background: "var(--accent-cyan)",
                    boxShadow: "0 0 8px rgba(0, 212, 255, 0.4)",
                  }}
                />
              </div>
              <div>
                <h1 className="text-[15px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                  Nyra
                </h1>
                <p className="text-[9.5px] font-medium tracking-[0.08em] uppercase" style={{ color: "var(--text-ghost)" }}>
                  AI Study Assistant
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-[var(--radius-sm)] glass cursor-pointer transition-colors hover:bg-white/[0.04]"
            >
              <X size={14} className="text-[var(--text-muted)]" />
            </button>
          </div>

          {/* New Chat */}
          <button
            onClick={onNewChat}
            className="w-full py-2.5 px-3.5 rounded-[var(--radius-md)] text-[12.5px] font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer group"
            style={{
              background: "var(--accent-cyan-subtle)",
              border: "1px solid rgba(0, 212, 255, 0.12)",
              color: "var(--accent-cyan)",
            }}
          >
            <Plus size={14} strokeWidth={2.5} className="transition-transform group-hover:rotate-90 duration-300" />
            New Chat
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-4">
          {groups.length === 0 && (
            <div className="text-center py-10">
              <div className="glass w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center mx-auto mb-3">
                <MessageSquare size={18} className="text-[var(--text-ghost)]" />
              </div>
              <p className="text-[11.5px] font-medium" style={{ color: "var(--text-ghost)" }}>
                No conversations yet
              </p>
            </div>
          )}

          {groups.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-1.5 px-2 mb-2">
                <Clock size={10} className="text-[var(--text-ghost)]" />
                <p className="text-[9.5px] uppercase tracking-[0.12em] font-semibold" style={{ color: "var(--text-ghost)" }}>
                  {group.label}
                </p>
              </div>
              <div className="space-y-0.5">
                {group.items.map((session) => {
                  const isActive = activeSessionId === session.id;
                  return (
                    <div
                      key={session.id}
                      onClick={() => { onSelectSession(session.id); onClose(); }}
                      className="group flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] cursor-pointer transition-all duration-150"
                      style={{
                        background: isActive ? "var(--accent-cyan-subtle)" : "transparent",
                        border: isActive ? "1px solid rgba(0, 212, 255, 0.1)" : "1px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <Hash size={11} style={{ color: isActive ? "var(--accent-cyan)" : "var(--text-ghost)", flexShrink: 0 }} />
                      <span
                        className="flex-1 truncate text-[12px] font-medium"
                        style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)" }}
                      >
                        {session.title}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-[6px] transition-all cursor-pointer hover:bg-white/[0.05]"
                        style={{ color: "var(--text-ghost)" }}
                        aria-label="Delete chat"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 text-center" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <p className="text-[10px] font-medium" style={{ color: "#688491ff" }}>
            Built by <span style={{ color: "var(--accent-cyan)" }}>Aimi</span>
          </p>
          <p className="text-[9px] mt-0.5" style={{ color: "#688491ff" }}>
            React + FastAPI + Gemini
          </p>
        </div>
      </aside>
    </>
  );
}
