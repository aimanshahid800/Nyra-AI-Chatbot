# tools.py - Study-specific tools with @function_tool decorator

import json
import asyncio
from agents import function_tool
from datetime import datetime, timedelta


@function_tool
def create_study_schedule(
    topics: list[str],
    hours_per_day: float,
    start_date: str,
    deadline: str
) -> str:
    """
    Generates a personalized study schedule from start_date to deadline.
    Args:
        topics: List of subjects/topics to study
        hours_per_day: How many hours per day to study
        start_date: Start date in YYYY-MM-DD format
        deadline: Deadline date in YYYY-MM-DD format
    """
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(deadline, "%Y-%m-%d")
    except ValueError:
        return "Invalid date format. Please use YYYY-MM-DD."

    if end <= start:
        return "Deadline must be after start date."

    total_days = (end - start).days + 1
    days_per_topic = max(1, total_days // len(topics))

    schedule = []
    day_counter = 0
    topic_idx = 0

    for day_num in range(total_days):
        if topic_idx >= len(topics):
            topic_idx = len(topics) - 1
        study_date = start + timedelta(days=day_num)
        schedule.append(
            f"{study_date.strftime(chr(37)+chr(97)+', %b %d')}: Study topics[{topic_idx}] for {hours_per_day}h"
        )
        day_counter += 1
        if day_counter >= days_per_topic and topic_idx < len(topics) - 1:
            topic_idx += 1
            day_counter = 0

    result = "\n".join(schedule)
    summary = f"\nTotal: {total_days} days | {len(topics)} topics | ~{days_per_topic} days per topic"
    return result + summary


@function_tool
def generate_mcq_quiz(topic: str, num_questions: int = 5) -> str:
    """
    Generates MCQ quiz questions for a given topic.
    Args:
        topic: The subject/topic for quiz questions
        num_questions: How many questions to generate (default 5)
    """
    from agent import gemini_client

    loop = asyncio.new_event_loop()
    try:
        prompt = f"""Generate exactly {num_questions} MCQ quiz questions about "{topic}" at university level.

Return ONLY valid JSON, no markdown, no code blocks. Use this exact format:
{{
  "questions": [
    {{
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 0,
      "explanation": "Brief explanation here"
    }}
  ]
}}

Rules:
- Each question must have exactly 4 options
- correct_index is 0-based (0=A, 1=B, 2=C, 3=D)
- Questions should be clear, accurate, and university level
- Mix question types: definitions, examples, comparisons"""

        completion = loop.run_until_complete(
            gemini_client.chat.completions.create(
                model="gemma4:31b-cloud",
                messages=[
                    {"role": "system", "content": "You are a quiz generator. Return only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
            )
        )

        raw = completion.choices[0].message.content.strip()
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1]
            if raw.endswith("```"):
                raw = raw[:-3]
            raw = raw.strip()

        quiz_data = json.loads(raw)
        questions = quiz_data.get("questions", [])

        result = f"Quiz on: {topic}\n\n"
        for i, q in enumerate(questions, 1):
            result += f"Q{i}. {q['question']}\n"
            for j, opt in enumerate(q.get("options", [])):
                letter = chr(97 + j)
                result += f"  {letter}) {opt}\n"
            correct_idx = q.get("correct_index", 0)
            correct_letter = chr(97 + correct_idx)
            result += f"  Answer: {correct_letter})\n"
            result += f"  Explanation: {q.get('explanation', 'N/A')}\n\n"

        return result

    except Exception as e:
        return f"Sorry, I couldn't generate the quiz right now. Error: {str(e)}"
    finally:
        loop.close()


@function_tool
def summarize_notes(text: str, style: str = "bullet-points") -> str:
    """
    Summarizes long notes into a concise format.
    Args:
        text: The text/content to summarize
        style: Style of summary - short, detailed, or bullet-points
    """
    if len(text) < 100:
        return f"Text is already short ({len(text)} chars). No summarization needed."

    from agent import gemini_client

    loop = asyncio.new_event_loop()
    try:
        prompt = f"""Summarize the following text in {style} style.

Text:
{text[:3000]}

Return a clear, concise summary in {style} format."""

        completion = loop.run_until_complete(
            gemini_client.chat.completions.create(
                model="gemma4:31b-cloud",
                messages=[
                    {"role": "system", "content": "You are a notes summarizer. Provide clear, concise summaries."},
                    {"role": "user", "content": prompt}
                ],
            )
        )

        return completion.choices[0].message.content.strip()

    except Exception as e:
        return f"Sorry, I couldn't summarize the notes right now. Error: {str(e)}"
    finally:
        loop.close()
