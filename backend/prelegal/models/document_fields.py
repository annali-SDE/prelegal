from pydantic import BaseModel


class NdaFields(BaseModel):
    purpose: str | None = None
    effectiveDate: str | None = None
    mndaTermType: str | None = None
    mndaTermYears: int | None = None
    confidentialityTermType: str | None = None
    confidentialityTermYears: int | None = None
    governingLaw: str | None = None
    jurisdiction: str | None = None
    party1Name: str | None = None
    party1Title: str | None = None
    party1Company: str | None = None
    party1NoticeAddress: str | None = None
    party2Name: str | None = None
    party2Title: str | None = None
    party2Company: str | None = None
    party2NoticeAddress: str | None = None


class CsaFields(BaseModel):
    providerName: str | None = None
    providerTitle: str | None = None
    providerCompany: str | None = None
    providerNoticeAddress: str | None = None
    customerName: str | None = None
    customerTitle: str | None = None
    customerCompany: str | None = None
    customerNoticeAddress: str | None = None
    cloudServiceDescription: str | None = None
    subscriptionPeriod: str | None = None
    fees: str | None = None
    paymentProcess: str | None = None
    governingLaw: str | None = None
    chosenCourts: str | None = None
    effectiveDate: str | None = None


class DesignPartnerFields(BaseModel):
    providerName: str | None = None
    providerCompany: str | None = None
    providerNoticeAddress: str | None = None
    partnerName: str | None = None
    partnerCompany: str | None = None
    partnerNoticeAddress: str | None = None
    programDescription: str | None = None
    term: str | None = None
    effectiveDate: str | None = None
    fees: str | None = None
    governingLaw: str | None = None
    chosenCourts: str | None = None


class SlaFields(BaseModel):
    providerName: str | None = None
    providerCompany: str | None = None
    customerName: str | None = None
    customerCompany: str | None = None
    targetUptime: str | None = None
    targetResponseTime: str | None = None
    supportChannel: str | None = None
    scheduledDowntime: str | None = None
    uptimeCredit: str | None = None
    responseTimeCredit: str | None = None


class PsaFields(BaseModel):
    providerName: str | None = None
    providerCompany: str | None = None
    providerNoticeAddress: str | None = None
    customerName: str | None = None
    customerCompany: str | None = None
    customerNoticeAddress: str | None = None
    effectiveDate: str | None = None
    governingLaw: str | None = None
    chosenCourts: str | None = None
    generalCapAmount: str | None = None


class DpaFields(BaseModel):
    controllerName: str | None = None
    controllerCompany: str | None = None
    processorName: str | None = None
    processorCompany: str | None = None
    categoriesOfPersonalData: str | None = None
    categoriesOfDataSubjects: str | None = None
    natureAndPurposeOfProcessing: str | None = None
    durationOfProcessing: str | None = None
    approvedSubprocessors: str | None = None
    breachNotificationPeriod: str | None = None


class SoftwareLicenseFields(BaseModel):
    providerName: str | None = None
    providerCompany: str | None = None
    customerName: str | None = None
    customerCompany: str | None = None
    softwareDescription: str | None = None
    subscriptionPeriod: str | None = None
    permittedUses: str | None = None
    licenseLimits: str | None = None
    warrantyPeriod: str | None = None
    governingLaw: str | None = None
    effectiveDate: str | None = None


class PartnershipFields(BaseModel):
    party1Name: str | None = None
    party1Company: str | None = None
    party1NoticeAddress: str | None = None
    party2Name: str | None = None
    party2Company: str | None = None
    party2NoticeAddress: str | None = None
    partnershipDescription: str | None = None
    obligations: str | None = None
    territory: str | None = None
    effectiveDate: str | None = None
    endDate: str | None = None
    paymentProcess: str | None = None
    paymentSchedule: str | None = None
    governingLaw: str | None = None


class PilotFields(BaseModel):
    providerName: str | None = None
    providerCompany: str | None = None
    providerNoticeAddress: str | None = None
    customerName: str | None = None
    customerCompany: str | None = None
    customerNoticeAddress: str | None = None
    productDescription: str | None = None
    pilotPeriod: str | None = None
    generalCapAmount: str | None = None
    effectiveDate: str | None = None
    governingLaw: str | None = None
    chosenCourts: str | None = None


class BaaFields(BaseModel):
    providerName: str | None = None
    providerCompany: str | None = None
    coveredEntityName: str | None = None
    coveredEntityCompany: str | None = None
    servicesDescription: str | None = None
    baaEffectiveDate: str | None = None
    breachNotificationPeriod: str | None = None
    limitations: str | None = None


class AiAddendumFields(BaseModel):
    providerName: str | None = None
    providerCompany: str | None = None
    customerName: str | None = None
    customerCompany: str | None = None
    aiSystemDescription: str | None = None
    trainingRestrictions: str | None = None
    improvementRestrictions: str | None = None
    trainingData: str | None = None
    trainingPurposes: str | None = None
