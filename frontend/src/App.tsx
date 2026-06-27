import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck,
  FileText,
  Brain,
  GraduationCap,
  ArrowRight,
  Wand2,
} from "lucide-react";

import { Menu, Settings, Circle, Sun, Moon } from "lucide-react";
import { useTheme } from "./contexts/ThemeContext";
import Sidebar from "./components/Sidebar";
import InputBar from "./components/InputBar";
import MessageBubble from "./components/MessageBubble";
import TypingIndicator from "./components/TypingIndicator";
import RainBackground from "./components/RainBackground";
import { FlipFadeText } from "./components/ui/flip-fade-text";
import { FlipText } from "./components/ui/flip-text";
import {
  sendMessage,
  getHealth,
  loadSessions,
  saveSessions,
  createSession,
  generateTitle,
  type ChatSession,
  type ChatMessage,
} from "./services/api";

const QUICK_ACTIONS = [
  {
    icon: <CalendarCheck size={18} />,
    title: "Study Planner",
    desc: "Build a smart schedule for your exams",
    prompt: "Help me create a study schedule for my upcoming exams.",
    accent: "var(--accent-cyan)",
    bg: "var(--accent-cyan-subtle)",
  },
  {
    icon: <FileText size={18} />,
    title: "Summarize Notes",
    desc: "Condense long content into key points",
    prompt: "Can you summarize my notes? I'll paste them and need a clear version.",
    accent: "var(--accent-purple)",
    bg: "var(--accent-purple-subtle)",
  },
  {
    icon: <Brain size={18} />,
    title: "Quiz Me",
    desc: "Test your knowledge with MCQs",
    prompt: "Generate a quiz for me on a topic I'm studying. Give me MCQs with answers.",
    accent: "var(--accent-cyan)",
    bg: "var(--accent-cyan-subtle)",
  },
  {
    icon: <GraduationCap size={18} />,
    title: "Explain Concept",
    desc: "Break down any topic simply",
    prompt: "Explain a difficult concept to me in simple terms.",
    accent: "var(--accent-purple)",
    bg: "var(--accent-purple-subtle)",
  },
];

function NyraIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 150),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => onComplete(), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center" style={{ background: "var(--surface-base)" }}>
      <RainBackground />
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-[450px] h-[450px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.06), transparent 70%)", filter: "blur(80px)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(123,97,255,0.05), transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(6px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center text-center px-6"
          >
            {/* Logo with glow pulse */}
            <motion.div
              animate={{ scale: [1, 1.04, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="mb-4"
            >
              <img src="/images/nyra-logo.png" alt="Nyra" className="w-52 h-52 object-contain" />
            </motion.div>

            {/* NYRA text with flip-fade animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="mb-2"
            >
              <FlipFadeText
                words={["NYRA"]}
                className=""
                textClassName="text-[72px] font-bold tracking-tight"
                letterDuration={0.8}
                staggerDelay={0.08}
              />
            </motion.div>

            {/* AI ASSISTANT text with flip animation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 10 }}
              transition={{ duration: 0.5 }}
              className="text-[18px] font-medium tracking-[0.25em] uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              <FlipText duration={2.5} delay={0.2} together={false}>
                AI ASSISTANT
              </FlipText>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WelcomeScreen({ onAction }: { onAction: (prompt: string) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[380px] h-[380px] rounded-full animate-pulse-soft" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.02), transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-[320px] h-[320px] rounded-full animate-pulse-soft" style={{ background: "radial-gradient(circle, rgba(123,97,255,0.015), transparent 70%)", filter: "blur(80px)", animationDelay: "2s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
      >
        <div className="relative w-[72px] h-[72px] mb-8">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.25, 0.12] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,212,255,0.2), transparent 70%)", filter: "blur(20px)" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/images/nyra-logo.png" alt="Nyra" className="w-full h-full object-contain" />
          </div>
        </div>

        <h2
          className="text-[38px] font-bold mb-2.5 tracking-tight leading-[1.15]"
          style={{ color: "var(--text-primary)" }}
        >
          How can I help you
          <br />
          <span style={{ color: "var(--accent-cyan)" }}>study today?</span>
        </h2>
        <p className="text-[14px] font-light mb-12" style={{ color: "var(--text-muted)" }}>
          Choose a quick action or start typing below
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
          {QUICK_ACTIONS.map((action, i) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onAction(action.prompt)}
              className="group p-5 rounded-[var(--radius-lg)] text-left transition-all duration-200 cursor-pointer relative overflow-hidden"
              style={{
                background: "var(--surface-raised)",
                border: "1px solid var(--border-subtle)",
                boxShadow: "var(--shadow-sm)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--surface-overlay)";
                e.currentTarget.style.borderColor = "var(--border-default)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--surface-raised)";
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }}
            >
              <div
                className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center mb-4 transition-all duration-200"
                style={{
                  background: action.bg,
                  border: `1px solid ${action.accent}20`,
                  color: action.accent,
                }}
              >
                {action.icon}
              </div>
              <h3 className="text-[13px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                {action.title}
              </h3>
              <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {action.desc}
              </p>

              <div
                className="absolute bottom-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1.5 group-hover:translate-x-0"
                style={{ color: action.accent }}
              >
                <ArrowRight size={12} />
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 mt-8 px-4 py-2 rounded-full"
          style={{
            background: "var(--surface-raised)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <Wand2 size={11} style={{ color: "var(--text-ghost)" }} />
          <span className="text-[10px] font-medium" style={{ color: "var(--text-ghost)" }}>
            Powered by Gemini 2.0 Flash
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  useEffect(() => { setSessions(loadSessions()); }, []);

  useEffect(() => {
    getHealth().then(() => setIsConnected(true)).catch(() => setIsConnected(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages.length, isTyping]);

  const persist = useCallback((updated: ChatSession[]) => {
    setSessions(updated);
    saveSessions(updated);
  }, []);

  const handleNewChat = useCallback(() => {
    const session = createSession();
    persist([session, ...sessions]);
    setActiveSessionId(session.id);
  }, [sessions, persist]);

  const handleDeleteSession = useCallback((id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    persist(updated);
    if (activeSessionId === id) setActiveSessionId(updated.length > 0 ? updated[0].id : null);
  }, [sessions, activeSessionId, persist]);

  const handleSend = useCallback(async (text: string) => {
    let sessionId = activeSessionId;

    if (!sessionId) {
      const session = createSession();
      persist([session, ...sessions]);
      sessionId = session.id;
      setActiveSessionId(sessionId);
    }

    const userMsg: ChatMessage = { role: "user", content: text };
    const updatedSessions = sessions.map((s) =>
      s.id === sessionId
        ? { ...s, messages: [...s.messages, userMsg], title: s.messages.length === 0 ? generateTitle(text) : s.title }
        : s
    );

    if (!sessions.find((s) => s.id === sessionId)) {
      const session = createSession();
      session.messages = [userMsg];
      session.title = generateTitle(text);
      updatedSessions.unshift(session);
      sessionId = session.id;
      setActiveSessionId(sessionId);
    }

    persist(updatedSessions);
    setIsTyping(true);

    try {
      const res = await sendMessage({ message: text, session_id: sessionId });
      const assistantMsg: ChatMessage = { role: "assistant", content: res.response, agent_used: res.agent_used };
      setSessions((prev) => prev.map((s) => s.id === res.session_id ? { ...s, messages: [...s.messages, assistantMsg] } : s));
      setSessions((prev) => { saveSessions(prev); return prev; });
    } catch {
      const errorMsg: ChatMessage = { role: "assistant", content: "Sorry, I couldn't connect to the server. Make sure the backend is running on port 8000." };
      setSessions((prev) => prev.map((s) => s.id === sessionId ? { ...s, messages: [...s.messages, errorMsg] } : s));
      setSessions((prev) => { saveSessions(prev); return prev; });
    } finally {
      setIsTyping(false);
    }
  }, [activeSessionId, sessions, persist]);

  if (showIntro) return <NyraIntro onComplete={() => setShowIntro(false)} />;

  return (
    <div className="h-screen w-full flex overflow-hidden" style={{ background: "var(--surface-base)" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999, opacity: 0.012 }}>
        <div style={{ width: "100%", height: "100%", backgroundImage: "url('/noise.svg')" }} />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
      />

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header
          className="h-[60px] flex items-center justify-between px-5 flex-shrink-0 relative z-30"
          style={{
            background: theme === "dark" ? "rgba(9, 9, 11, 0.75)" : "rgba(248, 250, 252, 0.75)",
            backdropFilter: "blur(24px) saturate(1.3)",
          }}
        >
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-[var(--radius-sm)] glass cursor-pointer transition-colors duration-200 hover:bg-white/[0.04]"
              aria-label="Toggle sidebar"
            >
              <Menu size={17} className="text-[var(--text-muted)]" />
            </button>
            <div className="flex items-center gap-2">
              <Circle
                size={7}
                fill={isConnected ? "var(--accent-cyan)" : "#c45c4a"}
                stroke="none"
                style={{
                  filter: isConnected
                    ? "drop-shadow(0 0 6px rgba(0, 212, 255, 0.5))"
                    : "drop-shadow(0 0 6px rgba(196, 92, 74, 0.5))",
                }}
              />
              <span className="text-[11.5px] font-medium tracking-wide" style={{ color: "var(--text-muted)" }}>
                {isConnected ? "Gemini 2.0 Flash" : "Offline"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-[var(--radius-sm)] glass transition-all duration-200 cursor-pointer hover:bg-white/[0.04]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-[var(--accent-cyan)]" />
              ) : (
                <Moon size={16} className="text-[var(--accent-purple)]" />
              )}
            </button>
            <button
              className="p-2 rounded-[var(--radius-sm)] glass transition-all duration-200 cursor-pointer hover:bg-white/[0.04]"
              aria-label="Settings"
            >
              <Settings size={16} className="text-[var(--text-ghost)]" />
            </button>
            <div
              className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden"
              style={{
                background: "var(--surface-raised)",
                border: "1px solid rgba(0, 212, 255, 0.1)",
              }}
            >
              <img src="/images/nyra-logo.png" alt="Nyra" className="w-6 h-6 object-contain" />
            </div>
          </div>
        </header>

        {!activeSession || activeSession.messages.length === 0 ? (
          <WelcomeScreen onAction={handleSend} />
        ) : (
          <div className="flex-1 overflow-y-auto py-3">
            <div className="max-w-[720px] mx-auto">
              {activeSession.messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        <InputBar onSend={handleSend} disabled={isTyping} />
      </main>
    </div>
  );
}
