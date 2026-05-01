# schemas.py - Pydantic models for request/response

from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    agent_used: str
    session_id: str


class ScheduleRequest(BaseModel):
    topics: list[str]
    hours_per_day: float
    start_date: str
    deadline: str


class ScheduleResponse(BaseModel):
    schedule: list[str]
    total_days: int


class QuizRequest(BaseModel):
    topic: str
    num_questions: int = 5


class QuizResponse(BaseModel):
    questions: list[dict]
    topic: str


class SummarizeRequest(BaseModel):
    text: str
    style: str = "short"
