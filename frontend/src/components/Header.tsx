interface Props {
  isConnected: boolean;
  onNewChat: () => void;
}

export default function Header({ isConnected, onNewChat }: Props) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 glass">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center glow-purple">
          <span className="text-white font-bold text-lg">N</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold gradient-text">Nyra</h1>
          <p className="text-[11px] text-gray-500">AI Study Assistant</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Status */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}></div>
          <span className="text-xs text-gray-400">
            {isConnected ? "Online" : "Offline"}
          </span>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all duration-200 text-gray-300 cursor-pointer"
        >
          + New Chat
        </button>
      </div>
    </header>
  );
}
