from fastapi import APIRouter, HTTPException

from prelegal.dependencies import CurrentUser
from prelegal.models.chat import ChatRequest, ChatResponse, GreetingResponse
from prelegal.services import chat_service

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.get("/greeting", response_model=GreetingResponse)
async def get_greeting(current_user: CurrentUser, document_type: str = "mutual_nda"):
    return GreetingResponse(message=chat_service.get_greeting(document_type))


@router.post("/message", response_model=ChatResponse)
async def send_message(body: ChatRequest, current_user: CurrentUser):
    history = [{"role": m.role, "content": m.content} for m in body.conversation_history]
    try:
        return await chat_service.get_ai_response(history, body.message, body.document_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=502, detail="AI service unavailable")
