from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from typing import List, Dict, Any
from generate_questions import generate_and_parse_questions

app = FastAPI()

class TextRequest(BaseModel):
    text: str
    question_number: int = 2
    difficulty: str = "hard"

class Question(BaseModel):
    question: str
    option_1: str
    option_2: str
    option_3: str
    option_4: str
    answer: str

@app.post("/generate-questions/", response_model=List[Dict[str, Any]])
async def generate_questions(request: TextRequest):
    try:
        # You might need to adjust the call to `generate_and_parse_questions` to be async
        questions = generate_and_parse_questions(request.text, request.question_number, request.difficulty)
        return questions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
