export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  document_type: string;
  message: string;
  conversation_history: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
  extracted_fields: Record<string, unknown>;
  is_complete: boolean;
}
