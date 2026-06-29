const API_BASE = "http://localhost:8000";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  agent_used?: string;
  quiz_data?: QuizData;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  hint: string;
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
}

export interface ChatResponse {
  response: string;
  agent_used: string;
  session_id: string;
}

export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  return res.json();
}

export async function getHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function generateQuiz(topic: string, numQuestions: number = 5, difficulty: string = "medium"): Promise<QuizData> {
  const res = await fetch(`${API_BASE}/quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, num_questions: numQuestions, difficulty }),
  });

  if (!res.ok) {
    throw new Error(`Quiz generation failed: ${res.status}`);
  }

  return res.json();
}

const STORAGE_KEY = "nyra_sessions";

export function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function createSession(): ChatSession {
  return {
    id: crypto.randomUUID(),
    title: "New chat",
    messages: [],
    createdAt: Date.now(),
  };
}

export function generateTitle(firstMessage: string): string {
  const cleaned = firstMessage.replace(/[^\w\s]/g, "").trim();
  const words = cleaned.split(/\s+/).slice(0, 5);
  return words.join(" ") || "New chat";
}

export function extractQuizTopic(message: string): string | null {
  const patterns = [
    /quiz\s+(?:me\s+)?(?:on\s+|about\s+)?(.+?)(?:\s+with\s+\d+\s+mcqs?)?$/i,
    /generate\s+(?:a\s+)?quiz\s+(?:on\s+|about\s+)?(.+?)(?:\s+with\s+\d+\s+mcqs?)?$/i,
    /create\s+(?:a\s+)?quiz\s+(?:on\s+|about\s+)?(.+?)(?:\s+with\s+\d+\s+mcqs?)?$/i,
    /test\s+me\s+on\s+(.+?)(?:\s+with\s+\d+\s+mcqs?)?$/i,
  ];
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
}
