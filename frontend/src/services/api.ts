const API_BASE = "http://localhost:8000";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  agent_used?: string;
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

export async function sendMessage(
  request: ChatRequest
): Promise<ChatResponse> {
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
