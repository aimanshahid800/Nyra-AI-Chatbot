interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: Props) {
  const features = [
    { icon: "\u{1F4C5}", label: "Study Planner", desc: "Smart schedules" },
    { icon: "\u{1F9EA}", label: "Quiz Mode", desc: "MCQ practice" },
    { icon: "\u{1F4DD}", label: "Summarizer", desc: "Condense notes" },
    { icon: "\u{1F4AC}", label: "Study Chat", desc: "Ask anything" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:relative z-50 top-0 left-0 h-full w-64 glass-strong flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-semibold text-sm gradient-text">Nyra</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-3">Features</p>
          {features.map((feature) => (
            <div
              key={feature.label}
              className="p-3 rounded-xl glass hover:bg-white/5 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{feature.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {feature.label}
                  </p>
                  <p className="text-[10px] text-gray-600">{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5">
          <p className="text-[10px] text-gray-600 text-center">
            Built by <span className="text-purple-400">Aimi</span>
          </p>
          <p className="text-[9px] text-gray-700 text-center mt-1">
            React + FastAPI + Gemini AI
          </p>
        </div>
      </aside>
    </>
  );
}
