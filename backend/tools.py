# tools.py - Study-specific tools with @function_tool decorator

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
    return f"QUIZ_REQUEST:{topic}:{num_questions}"


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
    return f"SUMMARIZE_REQUEST:{style}:{text[:2000]}"
