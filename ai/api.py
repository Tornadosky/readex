from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from typing import List, Dict, Any
from generate_questions import generate_and_parse_questions
from pdf_to_quizz import pdf_to_quizz, generate_quiz_from_highlights
import logging

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

# Configure logging
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Create a logger object
logger = logging.getLogger(__name__)

@app.post("/generate-questions/", response_model=List[Dict[str, Any]])
async def generate_questions(request: TextRequest):
    try:
        # You might need to adjust the call to `generate_and_parse_questions` to be async
        #questions = generate_and_parse_questions(request.text, request.question_number, request.difficulty)
        logger.info(f"Generating questions for text:")
        #questions = await pdf_to_quizz("../backend/uploads/1/Andrey_Kalenik_cv.pdf")
        questions = await generate_quiz_from_highlights([24], {24: "../backend/uploads/1/Andrey_Kalenik_cv.pdf"}, 2)
        if not isinstance(questions, list):
            raise TypeError("Expected a list of questions, got something else")
        return questions
    except Exception as e:
        logger.error(f"Error generating questions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
