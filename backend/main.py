from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import your services
# Make sure rag_engine.py, translator.py, and security_agent.py exist in the backend folder
from rag_engine import RAGService
from translator import TerjmanService 
from security_agent import SecurityAgent

app = FastAPI(title="ZELIG API - Digital Morocco")

# --- CORS CONFIGURATION (CRITICAL) ---
# Allows the Frontend (port 5173) to talk to Backend (port 8001) without permission errors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- INITIALIZE AI ENGINES ---
print("🚀 Starting ZELIG Engines...")
rag_service = RAGService()        # The Tourist Guide
translator = TerjmanService()     # The Translator
security_agent = SecurityAgent()  # The Security Monitor
print("✅ All Engines Ready.")

# --- DATA MODELS ---
class ChatRequest(BaseModel):
    query: str

class TranslationRequest(BaseModel):
    text: str

# --- API ENDPOINTS ---

@app.get("/")
def home():
    return {"status": "Online", "version": "Final"}

# 1. Chat with Guide
@app.post("/api/chat")
async def chat(request: ChatRequest):
    response = rag_service.get_answer(request.query)
    return {"response": response["result"]}

# 2. Translation (Terjman)
@app.post("/api/translate")
async def translate_text(request: TranslationRequest):
    print(f"📥 Translating: {request.text}")
    if not request.text:
        raise HTTPException(status_code=400, detail="Text provided is empty")
    
    translated_text = translator.translate(request.text)
    return {"translation": translated_text}

# 3. Security Check (New!)
@app.get("/api/security/{city}")
def check_security(city: str):
    return security_agent.analyze(city)
