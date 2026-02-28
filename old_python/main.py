#main page 
#running file: uvicorn main:app --reload 

from pydantic import BaseModel
from quiz import router

class QuizAnswer(BaseModel):
    category: str
    shared: bool

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"status": "ok"}

app.include_router(router,prefix="/quiz")