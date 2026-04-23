export interface NdaFormData {
  purpose: string;
  effectiveDate: string;
  mndaTermType: "expires" | "until_terminated";
  mndaTermYears: number;
  confidentialityTermType: "years" | "perpetuity";
  confidentialityTermYears: number;
  governingLaw: string;
  jurisdiction: string;

  party1Name: string;
  party1Title: string;
  party1Company: string;
  party1NoticeAddress: string;
  party1SignatureData: string;
  party1Date: string;

  party2Name: string;
  party2Title: string;
  party2Company: string;
  party2NoticeAddress: string;
  party2SignatureData: string;
  party2Date: string;
}

export const defaultFormData: NdaFormData = {
  purpose: "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate: new Date().toISOString().split("T")[0],
  mndaTermType: "expires",
  mndaTermYears: 1,
  confidentialityTermType: "years",
  confidentialityTermYears: 1,
  governingLaw: "",
  jurisdiction: "",

  party1Name: "",
  party1Title: "",
  party1Company: "",
  party1NoticeAddress: "",
  party1SignatureData: "",
  party1Date: "",

  party2Name: "",
  party2Title: "",
  party2Company: "",
  party2NoticeAddress: "",
  party2SignatureData: "",
  party2Date: "",
};
