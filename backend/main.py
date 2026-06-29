# main.py - FastAPI Server for Nyra AI Chatbot

import uuid
import json
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from agents import Runner
from schemas import ChatRequest, ChatResponse, QuizRequest, QuizData
from agent import nyra_agent, config, gemini_client


# ============ FastAPI App Setup ============
app = FastAPI(
    title="Nyra AI - Study Assistant API",
    description="Backend API for Nyra - Personal AI Study Assistant",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory chat history
chat_histories: dict[str, list[dict]] = {}


# ============ Health Check ============
@app.get("/health")
async def health_check():
    return {"status": "healthy", "agent": "Nyra", "version": "1.0.0"}


# ============ Chat Endpoint ============
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    session_id = request.session_id or str(uuid.uuid4())

    # Get or create session history
    if session_id not in chat_histories:
        chat_histories[session_id] = []

    # Add user message to history
    chat_histories[session_id].append({"role": "user", "content": request.message})

    try:
        # Run the agent
        result = await Runner.run(
            nyra_agent,
            input=request.message,
            run_config=config,
        )

        response_text = result.final_output or "Sorry, I could not generate a response."

        # Add assistant response to history
        chat_histories[session_id].append({"role": "assistant", "content": response_text})

        # Determine which agent was used
        agent_used = "Nyra"
        for event in result.raw_responses:
            if hasattr(event, 'agent'):
                agent_used = event.agent.name
                break

        return ChatResponse(
            response=response_text,
            agent_used=agent_used,
            session_id=session_id,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============ Quiz Generation Endpoint ============
@app.post("/quiz", response_model=QuizData)
async def generate_quiz(request: QuizRequest):
    try:
        difficulty_map = {"easy": "basic", "medium": "intermediate", "hard": "advanced"}
        diff_label = difficulty_map.get(request.difficulty, "intermediate")

        prompt = f"""Generate exactly {request.num_questions} MCQ quiz questions about "{request.topic}" at {diff_label} level.

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks. Use this exact format:
{{
  "title": "Quiz title here",
  "questions": [
    {{
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 0,
      "hint": "Brief hint here"
    }}
  ]
}}

Rules:
- Each question must have exactly 4 options
- correct_index is 0-based (0=A, 1=B, 2=C, 3=D)
- Hints should be short and helpful
- Questions should be clear and accurate
- Mix question types: definitions, examples, comparisons, code snippets"""

        completion = await gemini_client.chat.completions.create(
            model="gemma4:31b-cloud",
            messages=[
                {"role": "system", "content": "You are a quiz generator. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
        )

        raw = completion.choices[0].message.content.strip()

        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1]
            if raw.endswith("```"):
                raw = raw[:-3]
            raw = raw.strip()

        quiz_data = json.loads(raw)

        questions = []
        for q in quiz_data.get("questions", []):
            questions.append({
                "question": q["question"],
                "options": q["options"],
                "correct_index": q["correct_index"],
                "hint": q.get("hint", ""),
            })

        return QuizData(
            title=quiz_data.get("title", f"{request.topic} Quiz"),
            questions=questions,
        )

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse quiz data: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============ Get Chat History ============
@app.get("/history/{session_id}")
async def get_history(session_id: str):
    if session_id not in chat_histories:
        return {"messages": [], "session_id": session_id}
    return {"messages": chat_histories[session_id], "session_id": session_id}


# ============ Clear Chat History ============
@app.delete("/history/{session_id}")
async def clear_history(session_id: str):
    if session_id in chat_histories:
        del chat_histories[session_id]
    return {"status": "cleared", "session_id": session_id}


# ============ Run Server ============
if __name__ == "__main__":
    import uvicorn
    print("Nyra AI Backend starting on http://localhost:8000")
    print("API docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
