import { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MessageBubble from "./components/MessageBubble";
import InputBar from "./components/InputBar";
import TypingIndicator from "./components/TypingIndicator";
import { sendMessage, getHealth, type ChatMessage } from "./services/api";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await getHealth();
        setIsConnected(res.status === "healthy");
      } catch {
        setIsConnected(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    setShowWelcome(false);
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await sendMessage({
        message: text,
        session_id: sessionId || undefined,
      });

      setSessionId(res.session_id);

      const botMsg: ChatMessage = {
        role: "assistant",
        content: res.response,
        agent_used: res.agent_used,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        role: "assistant",
        content: "Sorry, something went wrong. Make sure the backend server is running on http://localhost:8000",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSessionId("");
    setShowWelcome(true);
  };

  const quickActions = [
    { icon: "\u{1F4C5}", title: "Create Study Plan", desc: "Smart schedule for exams" },
    { icon: "\u{1F9EA}", title: "Take a Quiz", desc: "MCQ practice on any topic" },
    { icon: "\u{1F4DD}", title: "Summarize Notes", desc: "Condense your long notes" },
    { icon: "\u{1F4AC}", title: "Ask Anything", desc: "Get help with any subject" },
  ];

  return (
    <div className="h-screen flex bg-dark-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header isConnected={isConnected} onNewChat={handleNewChat} />

        <div className="flex-1 overflow-y-auto">
          {showWelcome && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 flex items-center justify-center mb-6 glow-purple-strong">
                <span className="text-white font-bold text-3xl">N</span>
              </div>
              <h2 className="text-2xl font-bold gradient-text mb-2">
                Hi, I&apos;m Nyra
              </h2>
              <p className="text-gray-500 text-sm text-center max-w-md mb-8">
                Your personal AI study assistant. I can help you plan schedules,
                create quizzes, summarize notes, and answer your academic questions.
              </p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    onClick={() => handleSend(action.title)}
                    className="glass rounded-xl p-4 text-left hover:bg-white/5 transition-all duration-200 group cursor-pointer"
                  >
                    <span className="text-2xl mb-2 block">{action.icon}</span>
                    <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                      {action.title}
                    </p>
                    <p className="text-[11px] text-gray-600">{action.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-1">
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <InputBar onSend={handleSend} disabled={isTyping || !isConnected} />
      </div>
    </div>
  );
}
