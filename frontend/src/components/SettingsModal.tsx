import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, User, BookOpen, Brain, FileText, Languages, Download, Info,
  Type, ChevronRight, Check, DownloadCloud, FileJson, FileTextIcon,
} from "lucide-react";
import { useSettings, type Settings } from "../contexts/SettingsContext";
import { loadSessions } from "../services/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Section = "profile" | "study" | "quiz" | "notes" | "language" | "export" | "about" | "font";

const SECTIONS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <User size={16} /> },
  { id: "study", label: "Study Preferences", icon: <BookOpen size={16} /> },
  { id: "quiz", label: "Quiz Settings", icon: <Brain size={16} /> },
  { id: "notes", label: "Notes Style", icon: <FileText size={16} /> },
  { id: "language", label: "Language", icon: <Languages size={16} /> },
  { id: "font", label: "Font Size", icon: <Type size={16} /> },
  { id: "export", label: "Export Data", icon: <Download size={16} /> },
  { id: "about", label: "About", icon: <Info size={16} /> },
];

function SectionButton({ section, isActive, onClick }: {
  section: typeof SECTIONS[number];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[var(--radius-sm)] text-left transition-all duration-200 cursor-pointer group"
      style={{
        background: isActive ? "var(--accent-cyan-subtle)" : "transparent",
        border: isActive ? "1px solid rgba(0, 212, 255, 0.1)" : "1px solid transparent",
        color: isActive ? "var(--accent-cyan)" : "var(--text-muted)",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.02)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent";
      }}
    >
      <span className="flex-shrink-0">{section.icon}</span>
      <span className="text-[12.5px] font-medium flex-1">{section.label}</span>
      <ChevronRight size={12} style={{ opacity: isActive ? 0.6 : 0 }} className="transition-opacity" />
    </button>
  );
}

function TextInput({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text-ghost)" }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-[var(--radius-sm)] text-[13px] outline-none transition-all duration-200"
        style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--border-default)",
          color: "var(--text-primary)",
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = "rgba(0, 212, 255, 0.3)"}
        onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-default)"}
      />
    </div>
  );
}

function NumberInput({ label, value, onChange, min, max, step }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text-ghost)" }}>
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full px-3.5 py-2.5 rounded-[var(--radius-sm)] text-[13px] outline-none transition-all duration-200"
        style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--border-default)",
          color: "var(--text-primary)",
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = "rgba(0, 212, 255, 0.3)"}
        onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-default)"}
      />
    </div>
  );
}

function OptionGroup<T extends string>({ label, value, options, onChange }: {
  label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text-ghost)" }}>
        {label}
      </label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="py-2.5 px-3 rounded-[var(--radius-sm)] text-[12px] font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
            style={{
              background: value === opt.value ? "var(--accent-cyan-subtle)" : "var(--surface-raised)",
              border: value === opt.value ? "1px solid rgba(0, 212, 255, 0.2)" : "1px solid var(--border-default)",
              color: value === opt.value ? "var(--accent-cyan)" : "var(--text-muted)",
            }}
          >
            {value === opt.value && <Check size={11} />}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProfileSection({ settings, updateSettings }: { settings: Settings; updateSettings: (p: Partial<Settings>) => void }) {
  return (
    <div className="space-y-4">
      <TextInput
        label="Your Name"
        value={settings.profile.name}
        onChange={(v) => updateSettings({ profile: { ...settings.profile, name: v } })}
        placeholder="e.g. Aimi"
      />
      <TextInput
        label="University"
        value={settings.profile.university}
        onChange={(v) => updateSettings({ profile: { ...settings.profile, university: v } })}
        placeholder="e.g. LCWU, Lahore"
      />
      <TextInput
        label="Semester"
        value={settings.profile.semester}
        onChange={(v) => updateSettings({ profile: { ...settings.profile, semester: v } })}
        placeholder="e.g. 5th Semester"
      />
    </div>
  );
}

function StudySection({ settings, updateSettings }: { settings: Settings; updateSettings: (p: Partial<Settings>) => void }) {
  return (
    <div className="space-y-4">
      <NumberInput
        label="Daily Study Hours"
        value={settings.study.dailyHours}
        onChange={(v) => updateSettings({ study: { ...settings.study, dailyHours: v } })}
        min={1}
        max={16}
        step={0.5}
      />
      <TextInput
        label="Subjects / Topics"
        value={settings.study.subjects}
        onChange={(v) => updateSettings({ study: { ...settings.study, subjects: v } })}
        placeholder="e.g. Data Structures, OS, DB"
      />
      <TextInput
        label="Exam Dates"
        value={settings.study.examDates}
        onChange={(v) => updateSettings({ study: { ...settings.study, examDates: v } })}
        placeholder="e.g. 15 July 2026"
      />
    </div>
  );
}

function QuizSection({ settings, updateSettings }: { settings: Settings; updateSettings: (p: Partial<Settings>) => void }) {
  return (
    <div className="space-y-4">
      <OptionGroup
        label="Difficulty Level"
        value={settings.quiz.difficulty}
        onChange={(v) => updateSettings({ quiz: { ...settings.quiz, difficulty: v } })}
        options={[
          { value: "easy", label: "Easy" },
          { value: "medium", label: "Medium" },
          { value: "hard", label: "Hard" },
        ]}
      />
      <OptionGroup
        label="Questions per Quiz"
        value={String(settings.quiz.numQuestions)}
        onChange={(v) => updateSettings({ quiz: { ...settings.quiz, numQuestions: Number(v) } })}
        options={[
          { value: "5", label: "5" },
          { value: "10", label: "10" },
          { value: "15", label: "15" },
        ] as { value: string; label: string }[]}
      />
    </div>
  );
}

function NotesSection({ settings, updateSettings }: { settings: Settings; updateSettings: (p: Partial<Settings>) => void }) {
  return (
    <div className="space-y-4">
      <OptionGroup
        label="Default Summary Style"
        value={settings.notes.defaultStyle}
        onChange={(v) => updateSettings({ notes: { defaultStyle: v } })}
        options={[
          { value: "bullet-points", label: "Bullet Points" },
          { value: "paragraph", label: "Paragraph" },
          { value: "detailed", label: "Detailed" },
        ]}
      />
      <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-ghost)" }}>
        Nyra will use this format when summarizing your notes by default.
      </p>
    </div>
  );
}

function LanguageSection({ settings, updateSettings }: { settings: Settings; updateSettings: (p: Partial<Settings>) => void }) {
  return (
    <div className="space-y-4">
      <OptionGroup
        label="Preferred Language"
        value={settings.language}
        onChange={(v) => updateSettings({ language: v })}
        options={[
          { value: "english", label: "English" },
          { value: "roman-urdu", label: "Roman Urdu" },
          { value: "urdu", label: "Urdu" },
        ]}
      />
      <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-ghost)" }}>
        Nyra already speaks a mix of English and Roman Urdu. This setting adjusts her default response style.
      </p>
    </div>
  );
}

function FontSection({ settings, updateSettings }: { settings: Settings; updateSettings: (p: Partial<Settings>) => void }) {
  return (
    <div className="space-y-4">
      <OptionGroup
        label="Chat Text Size"
        value={settings.fontSize}
        onChange={(v) => updateSettings({ fontSize: v })}
        options={[
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ]}
      />
    </div>
  );
}

function ExportSection() {
  const [exported, setExported] = useState<"json" | "text" | null>(null);

  const exportAs = (format: "json" | "text") => {
    const sessions = loadSessions();
    let content: string;
    let filename: string;
    let mime: string;

    if (format === "json") {
      content = JSON.stringify(sessions, null, 2);
      filename = `nyra-export-${Date.now()}.json`;
      mime = "application/json";
    } else {
      const lines = sessions.map((s) => {
        const header = `=== ${s.title} (${new Date(s.createdAt).toLocaleDateString()}) ===`;
        const msgs = s.messages.map((m) => `[${m.role.toUpperCase()}]: ${m.content}`).join("\n\n");
        return header + "\n" + msgs;
      });
      content = lines.join("\n\n\n");
      filename = `nyra-export-${Date.now()}.txt`;
      mime = "text/plain";
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setExported(format);
    setTimeout(() => setExported(null), 2000);
  };

  return (
    <div className="space-y-3">
      <p className="text-[12px] leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
        Download all your chat history and conversations.
      </p>
      <button
        onClick={() => exportAs("json")}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[var(--radius-md)] transition-all duration-200 cursor-pointer group"
        style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--border-default)",
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(0, 212, 255, 0.2)"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-default)"}
      >
        <div className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center" style={{ background: "var(--accent-cyan-subtle)" }}>
          <FileJson size={16} style={{ color: "var(--accent-cyan)" }} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[12.5px] font-semibold" style={{ color: "var(--text-primary)" }}>Export as JSON</p>
          <p className="text-[10.5px]" style={{ color: "var(--text-ghost)" }}>Structured data format</p>
        </div>
        {exported === "json" ? (
          <Check size={14} style={{ color: "var(--accent-cyan)" }} />
        ) : (
          <DownloadCloud size={14} style={{ color: "var(--text-ghost)" }} className="group-hover:text-[var(--accent-cyan)] transition-colors" />
        )}
      </button>
      <button
        onClick={() => exportAs("text")}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[var(--radius-md)] transition-all duration-200 cursor-pointer group"
        style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--border-default)",
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(123, 97, 255, 0.2)"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-default)"}
      >
        <div className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center" style={{ background: "var(--accent-purple-subtle)" }}>
          <FileTextIcon size={16} style={{ color: "var(--accent-purple)" }} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[12.5px] font-semibold" style={{ color: "var(--text-primary)" }}>Export as Text</p>
          <p className="text-[10.5px]" style={{ color: "var(--text-ghost)" }}>Plain readable format</p>
        </div>
        {exported === "text" ? (
          <Check size={14} style={{ color: "var(--accent-purple)" }} />
        ) : (
          <DownloadCloud size={14} style={{ color: "var(--text-ghost)" }} className="group-hover:text-[var(--accent-purple)] transition-colors" />
        )}
      </button>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center text-center py-4">
        <div className="relative w-[64px] h-[64px] mb-3">
          <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.15), transparent 70%)" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/images/nyra-logo.png" alt="Nyra" className="w-14 h-14 object-contain" />
          </div>
        </div>
        <h3 className="text-[16px] font-bold" style={{ color: "var(--text-primary)" }}>Nyra AI</h3>
        <p className="text-[11px] mt-0.5" style={{ color: "var(--text-ghost)" }}>Personal AI Study Assistant</p>
      </div>

      <div className="space-y-2.5">
        {[
          { label: "Version", value: "1.0.0" },
          { label: "Frontend", value: "React + TypeScript + Tailwind" },
          { label: "Backend", value: "FastAPI + Python" },
          { label: "AI Model", value: "Gemini 2.0 Flash" },
          { label: "Architecture", value: "Multi-Agent System" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between px-3 py-2 rounded-[var(--radius-sm)]" style={{ background: "var(--surface-raised)" }}>
            <span className="text-[11px] font-medium" style={{ color: "var(--text-ghost)" }}>{item.label}</span>
            <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>{item.value}</span>
          </div>
        ))}
      </div>

      <div className="text-center pt-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <p className="text-[11px]" style={{ color: "var(--text-ghost)" }}>
          Built with love by <span style={{ color: "var(--accent-cyan)" }}>Aimi</span>
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: "var(--text-ghost)" }}>
          CS Student @ LCWU, Lahore
        </p>
      </div>
    </div>
  );
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const { settings, updateSettings } = useSettings();
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const renderSection = () => {
    switch (activeSection) {
      case "profile": return <ProfileSection settings={settings} updateSettings={updateSettings} />;
      case "study": return <StudySection settings={settings} updateSettings={updateSettings} />;
      case "quiz": return <QuizSection settings={settings} updateSettings={updateSettings} />;
      case "notes": return <NotesSection settings={settings} updateSettings={updateSettings} />;
      case "language": return <LanguageSection settings={settings} updateSettings={updateSettings} />;
      case "font": return <FontSection settings={settings} updateSettings={updateSettings} />;
      case "export": return <ExportSection />;
      case "about": return <AboutSection />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100]"
            style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
          />
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-[640px] h-[min(520px,80vh)] rounded-[var(--radius-xl)] overflow-hidden flex pointer-events-auto"
              style={{
                background: "var(--surface-base)",
                border: "1px solid var(--border-default)",
                boxShadow: "var(--shadow-lg), 0 0 80px rgba(0, 212, 255, 0.04)",
              }}
            >
              {/* Sidebar nav */}
              <div
                className="w-[190px] flex-shrink-0 overflow-y-auto py-4 px-2.5 hidden sm:block"
                style={{ borderRight: "1px solid var(--border-subtle)" }}
              >
                <div className="px-3 mb-4">
                  <h2 className="text-[13px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Settings</h2>
                </div>
                <div className="space-y-0.5">
                  {SECTIONS.map((s) => (
                    <SectionButton
                      key={s.id}
                      section={s}
                      isActive={activeSection === s.id}
                      onClick={() => setActiveSection(s.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col min-w-0">
                <div
                  className="h-[48px] flex items-center justify-between px-5 flex-shrink-0"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <h3 className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                    {SECTIONS.find((s) => s.id === activeSection)?.label}
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-[var(--radius-sm)] transition-all duration-200 cursor-pointer hover:bg-white/[0.04]"
                    aria-label="Close settings"
                  >
                    <X size={14} style={{ color: "var(--text-ghost)" }} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5">
                  {renderSection()}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
