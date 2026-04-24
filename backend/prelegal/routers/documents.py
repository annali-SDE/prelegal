from fastapi import APIRouter, status

from prelegal.dependencies import CurrentUser, DB
from prelegal.models.document import DocumentCreate, DocumentResponse, DocumentUpdate
from prelegal.services import document_service

router = APIRouter(prefix="/api/documents", tags=["documents"])


@router.get("", response_model=list[DocumentResponse])
async def list_documents(current_user: CurrentUser, db: DB):
    return await document_service.list_documents(db, current_user["id"])


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_document(body: DocumentCreate, current_user: CurrentUser, db: DB):
    return await document_service.create_document(
        db, current_user["id"], body.document_type, body.title, body.fields, body.chat_history
    )


@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_document(doc_id: int, current_user: CurrentUser, db: DB):
    return await document_service.get_document(db, doc_id, current_user["id"])


@router.put("/{doc_id}", response_model=DocumentResponse)
async def update_document(doc_id: int, body: DocumentUpdate, current_user: CurrentUser, db: DB):
    return await document_service.update_document(
        db, doc_id, current_user["id"], body.title, body.fields, body.chat_history
    )


@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(doc_id: int, current_user: CurrentUser, db: DB):
    await document_service.delete_document(db, doc_id, current_user["id"])
