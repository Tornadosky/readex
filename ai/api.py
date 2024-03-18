from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from typing import List, Dict, Any
from generate_questions import generate_and_parse_questions

app = FastAPI()

origins = [
    "http://localhost:5173",  # Adjust the port accordingly if your frontend runs on a different one
    "http://127.0.0.1:5173",
    # Add any other origins as needed, or use "*" to allow all origins (not recommended for production)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows the origins listed in `origins`
    allow_credentials=True,
    allow_methods=["GET", "POST"],  # Allows only specified methods
    allow_headers=["X-Requested-With", "Content-Type"],  # Allows only specified headers
)

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
