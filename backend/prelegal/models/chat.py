from typing import Any, Literal

from pydantic import BaseModel, create_model

from prelegal.models.document_fields import (
    AiAddendumFields,
    BaaFields,
    CsaFields,
    DesignPartnerFields,
    DpaFields,
    NdaFields,
    PartnershipFields,
    PilotFields,
    PsaFields,
    SlaFields,
    SoftwareLicenseFields,
)


class ChatMessageInput(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    document_type: str = "mutual_nda"
    message: str
    conversation_history: list[ChatMessageInput] = []


def _make_ai_output(name: str, fields_cls: type[BaseModel]) -> type[BaseModel]:
    return create_model(
        name,
        reply=(str, ...),
        extracted_fields=(fields_cls, ...),
        is_complete=(bool, ...),
    )


# One structured-output model per document type
_DOCUMENT_OUTPUT_MODELS: dict[str, type[BaseModel]] = {
    "mutual_nda": _make_ai_output("NdaOutput", NdaFields),
    "mutual_nda_coverpage": _make_ai_output("NdaCoverpageOutput", NdaFields),
    "cloud_service_agreement": _make_ai_output("CsaOutput", CsaFields),
    "design_partner_agreement": _make_ai_output("DesignPartnerOutput", DesignPartnerFields),
    "service_level_agreement": _make_ai_output("SlaOutput", SlaFields),
    "professional_services_agreement": _make_ai_output("PsaOutput", PsaFields),
    "data_processing_agreement": _make_ai_output("DpaOutput", DpaFields),
    "software_license_agreement": _make_ai_output("SoftwareLicenseOutput", SoftwareLicenseFields),
    "partnership_agreement": _make_ai_output("PartnershipOutput", PartnershipFields),
    "pilot_agreement": _make_ai_output("PilotOutput", PilotFields),
    "business_associate_agreement": _make_ai_output("BaaOutput", BaaFields),
    "ai_addendum": _make_ai_output("AiAddendumOutput", AiAddendumFields),
}

# Kept for any code that still imports it directly
AiStructuredOutput = _DOCUMENT_OUTPUT_MODELS["mutual_nda"]


def get_output_model(document_type: str) -> type[BaseModel]:
    model = _DOCUMENT_OUTPUT_MODELS.get(document_type)
    if model is None:
        raise ValueError(f"Unsupported document type: {document_type!r}")
    return model


class ChatResponse(BaseModel):
    reply: str
    extracted_fields: dict[str, Any]
    is_complete: bool


class GreetingResponse(BaseModel):
    message: str
