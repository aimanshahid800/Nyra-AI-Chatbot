import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Lightbulb, Trophy, RotateCcw, XIcon } from "lucide-react";
import type { QuizData } from "../services/api";

interface Props {
  quiz: QuizData;
  onClose: () => void;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuizPopup({ quiz, onClose }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = quiz.questions[currentQ];
  const total = quiz.questions.length;

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    if (idx === q.correct_index) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ + 1 < total) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setRevealed(false);
      setShowHint(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setShowHint(false);
    setFinished(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="quiz-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: "rgba(0, 0, 0, 0.55)", backdropFilter: "blur(12px)" }}
      >
        <motion.div
          key="quiz-card"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[820px] max-h-[85vh] flex flex-col overflow-hidden relative"
          style={{
            background: "var(--surface-base)",
            borderRadius: "20px",
            border: "1px solid var(--border-default)",
            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 212, 255, 0.06), 0 0 120px rgba(123, 97, 255, 0.04)",
          }}
        >
          {/* Neon glow top edge */}
          <div
            className="absolute top-0 left-[10%] right-[10%] h-[1px]"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.4) 30%, rgba(123,97,255,0.4) 70%, transparent)",
            }}
          />

          {/* Header */}
          <div
            className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(0,212,255,0.12), rgba(123,97,255,0.08))",
                  border: "1px solid rgba(0,212,255,0.12)",
                }}
              >
                <Trophy size={15} style={{ color: "var(--accent-cyan)" }} />
              </div>
              <div>
                <h3 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {quiz.title}
                </h3>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-ghost)" }}>
                  {currentQ + 1} of {total} questions
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-white/[0.06]"
              style={{ border: "1px solid var(--border-subtle)" }}
              aria-label="Close quiz"
            >
              <X size={14} style={{ color: "var(--text-ghost)" }} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-6 pb-5 flex-shrink-0">
            <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "var(--surface-raised)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${((currentQ + 1) / total) * 100}%` }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-5">
            <AnimatePresence mode="wait">
              {!finished ? (
                <motion.div
                  key={currentQ}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.22 }}
                >
                  {/* Question */}
                  <p
                    className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-2.5"
                    style={{ color: "var(--accent-cyan)" }}
                  >
                    Question {currentQ + 1}
                  </p>
                  <p
                    className="text-[15px] font-medium leading-[1.6] mb-6"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {q.question}
                  </p>

                  {/* Options */}
                  <div className="space-y-3">
                    {q.options.map((opt, idx) => {
                      const isCorrect = idx === q.correct_index;
                      const isSelected = idx === selected;
                      const isWrongSelected = isSelected && !isCorrect && revealed;
                      const isCorrectRevealed = revealed && isCorrect;

                      let bg = "var(--surface-raised)";
                      let border = "var(--border-default)";

                      if (isCorrectRevealed) {
                        bg = "rgba(0, 212, 255, 0.08)";
                        border = "rgba(0, 212, 255, 0.25)";
                      } else if (isWrongSelected) {
                        bg = "rgba(220, 60, 60, 0.06)";
                        border = "rgba(220, 60, 60, 0.2)";
                      }

                      return (
                        <div key={idx}>
                          <button
                            onClick={() => handleSelect(idx)}
                            disabled={revealed}
                            className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-all duration-200 cursor-pointer"
                            style={{
                              background: bg,
                              border: `1px solid ${border}`,
                              borderRadius: "14px",
                            }}
                            onMouseEnter={(e) => {
                              if (!revealed) {
                                e.currentTarget.style.borderColor = "rgba(0,212,255,0.2)";
                                e.currentTarget.style.transform = "translateY(-1px)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!revealed) {
                                e.currentTarget.style.borderColor = "var(--border-default)";
                                e.currentTarget.style.transform = "translateY(0)";
                              }
                            }}
                          >
                            <span
                              className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[12px] font-bold flex-shrink-0 transition-all duration-200"
                              style={{
                                background: isCorrectRevealed
                                  ? "rgba(0, 212, 255, 0.15)"
                                  : isWrongSelected
                                    ? "rgba(220, 60, 60, 0.1)"
                                    : "var(--surface-overlay)",
                                color: isCorrectRevealed
                                  ? "var(--accent-cyan)"
                                  : isWrongSelected
                                    ? "#dc3c3c"
                                    : "var(--text-ghost)",
                              }}
                            >
                              {isCorrectRevealed ? <Check size={14} /> : OPTION_LABELS[idx]}
                            </span>
                            <span
                              className="text-[13.5px] font-medium flex-1"
                              style={{
                                color: isCorrectRevealed
                                  ? "var(--accent-cyan)"
                                  : isWrongSelected
                                    ? "#dc3c3c"
                                    : "var(--text-secondary)",
                              }}
                            >
                              {opt}
                            </span>
                            {revealed && isCorrectRevealed && (
                              <Check size={16} style={{ color: "var(--accent-cyan)", flexShrink: 0 }} />
                            )}
                            {isWrongSelected && (
                              <XIcon size={16} style={{ color: "#dc3c3c", flexShrink: 0 }} />
                            )}
                          </button>
                          {/* Explanation */}
                          {revealed && (isCorrectRevealed || isWrongSelected) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pt-2 pb-1">
                                {isWrongSelected && (
                                  <p className="text-[11px] font-semibold mb-0.5" style={{ color: "#dc3c3c" }}>
                                    Your answer
                                  </p>
                                )}
                                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                  {isWrongSelected
                                    ? `Correct answer: ${OPTION_LABELS[q.correct_index]}. ${q.options[q.correct_index]}`
                                    : q.hint || "This is the correct answer."
                                  }
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Hint */}
                  {q.hint && !revealed && (
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-1.5 mt-4 text-[11.5px] font-medium cursor-pointer transition-colors"
                      style={{ color: "var(--text-ghost)" }}
                    >
                      <Lightbulb size={12} />
                      {showHint ? "Hide Hint" : "Show Hint"}
                    </button>
                  )}
                  {showHint && q.hint && !revealed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mt-2 px-3.5 py-2.5 text-[12px] leading-relaxed"
                        style={{
                          background: "rgba(212, 149, 106, 0.06)",
                          border: "1px solid rgba(212, 149, 106, 0.12)",
                          borderRadius: "12px",
                          color: "var(--text-muted)",
                        }}
                      >
                        {q.hint}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-6"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{
                      background: score / total >= 0.7
                        ? "rgba(0, 212, 255, 0.1)"
                        : "rgba(212, 149, 106, 0.1)",
                      border: score / total >= 0.7
                        ? "1px solid rgba(0, 212, 255, 0.2)"
                        : "1px solid rgba(212, 149, 106, 0.2)",
                    }}
                  >
                    <Trophy
                      size={28}
                      style={{ color: score / total >= 0.7 ? "var(--accent-cyan)" : "var(--text-ghost)" }}
                    />
                  </div>
                  <h3 className="text-[22px] font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                    {score}/{total}
                  </h3>
                  <p className="text-[13px] mb-1" style={{ color: "var(--text-muted)" }}>
                    {score === total ? "Perfect score!" : score / total >= 0.7 ? "Great job!" : "Keep practicing!"}
                  </p>
                  <p className="text-[12px] mb-6" style={{ color: "var(--text-ghost)" }}>
                    {Math.round((score / total) * 100)}% correct
                  </p>
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-[12px] text-[13px] font-semibold transition-all duration-200 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
                    color: "#ffffff",
                    boxShadow: "0 2px 16px rgba(0, 212, 255, 0.25)",
                  }}
                  >
                    <RotateCcw size={13} />
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {!finished && (
            <div
              className="px-6 py-4 flex justify-end flex-shrink-0"
              style={{ borderTop: "1px solid var(--border-subtle)" }}
            >
              <button
                onClick={handleNext}
                disabled={!revealed}
                className="px-7 py-2.5 text-[13px] font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
                style={{
                  background: revealed
                    ? "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))"
                    : "var(--surface-raised)",
                  color: revealed ? "#ffffff" : "var(--text-ghost)",
                  borderRadius: "12px",
                  boxShadow: revealed ? "0 2px 16px rgba(0, 212, 255, 0.2)" : "none",
                  border: revealed ? "none" : "1px solid var(--border-default)",
                }}
              >
                {currentQ + 1 < total ? "Next" : "Results"}
                <span style={{ transform: "translateY(1px)", fontSize: "15px" }}>&#8250;</span>
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
