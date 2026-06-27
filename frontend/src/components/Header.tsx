import { Menu, Settings, Circle, Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface Props {
  isConnected: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ isConnected, onToggleSidebar }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="h-[60px] flex items-center justify-between px-5 flex-shrink-0 relative z-30"
      style={{
        background: theme === "dark" ? "rgba(9, 9, 11, 0.75)" : "rgba(248, 250, 252, 0.75)",
        backdropFilter: "blur(24px) saturate(1.3)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-[var(--radius-sm)] glass cursor-pointer transition-colors duration-200 hover:bg-white/[0.04]"
          aria-label="Toggle sidebar"
        >
          <Menu size={17} className="text-[var(--text-muted)]" />
        </button>

        <div className="flex items-center gap-2.5">
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
  );
}
