from fastapi import FastAPI ,APIRouter
from pydantic import BaseModel
from typing import List, Literal, Dict

app = FastAPI()

Cat=Literal["Social Media","Device","Financial"]

class Quiz_qs(BaseModel):
    id:str
    category:Cat
    text:str
    next_page:str

class Quiz_answ(BaseModel):
    id: str
    answer: bool  # True = yes, False = no

class QuizSubmit(BaseModel):
    answers: List[Quiz_answ]


QUESTIONS: List[Quiz_qs] = [
    # SOCIAL MEDIA ACCESS
        Quiz_qs(
        id="q1",
        category="Social Media",
        text="Have you ever shared your social media passwords with them? (Instagram, Snapchat, TikTok, etc.)",
        next_page="social_passwords"
    ),
        Quiz_qs(
        id="q2",
        category="Social Media",
        text="Are you logged into your social accounts on a device they can access?",
        next_page="social_logged_in_devices"
    ),
        Quiz_qs(
        id="q3",
        category="Social Media",
        text="Do they have access to your email that your social accounts are linked to?",
        next_page="social_email_recovery"
    ),

    # DEVICE ACCESS
        Quiz_qs(
        id="q4",
        category="Device",
        text="Do they know your phone passcode, pattern, or have Face ID/Touch ID access?",
        next_page="device_lock_screen"
    ),
        Quiz_qs(
        id="q5",
        category="Device",
        text="Are any of your devices shared with them or signed in with an account they know?",
        next_page="device_account_access"
    ),
        Quiz_qs(
        id="q6",
        category="Device",
        text="Do you share your location with them (Find My, Life360, Snap Map, Google Maps, etc.)?",
        next_page="device_location"
    ),

    # FINANCIAL ACCESS
        Quiz_qs(
        id="q7",
        category="Financial",
        text="Do they have access to your banking app, card info, or any financial passwords?",
        next_page="finance_passwords"
    ),
        Quiz_qs(
        id="q8",
        category="Financial",
        text="Do you share any subscriptions, payment methods, or joint accounts with them?",
        next_page="finance_shared_accounts"
    ),
]

router=APIRouter()
@router.get("/questions")

def get_quiz_questions():
    return QUESTIONS







"""
SOCIAL MEDIA 
-Have you ever shared your social media passwords with your partner?
(Instagram, Snapchat, TikTok, etc.)
-Are you logged into your social media accounts on a device they can access?
(their phone, shared tablet, shared laptop)
-Do they have access to your email account connected to your social media?
(Email access = full account recovery risk)

DEVICE 
-Do they know your phone unlock passcode or Face ID pattern?
-Have they ever used your phone or laptop without you present?
-Do you share location with them through apps like Find My, Snapchat, Life360, Google Maps, etc.?

FINANCE 
-Do they have access to your banking app, credit card, or financial passwords?
-Do you share any subscriptions, shared payment methods, or joint financial accounts?

"""