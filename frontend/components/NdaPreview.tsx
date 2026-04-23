"use client";

import { NdaFormData } from "@/types/nda";

interface NdaPreviewProps {
  data: NdaFormData;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "[Date]";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function Blank({ value, placeholder }: { value: string; placeholder: string }) {
  const text = value.trim() || placeholder;
  const isEmpty = !value.trim();
  return (
    <span
      className={`font-medium ${isEmpty ? "text-indigo-400 border-b border-dashed border-indigo-300" : "text-slate-800"}`}
    >
      {text}
    </span>
  );
}

export default function NdaPreview({ data }: NdaPreviewProps) {
  const mndaTerm =
    data.mndaTermType === "expires"
      ? `${data.mndaTermYears} year(s) from the Effective Date`
      : "until terminated in accordance with the terms of the MNDA";

  const confidentialityTerm =
    data.confidentialityTermType === "years"
      ? `${data.confidentialityTermYears} year(s) from the Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws`
      : "in perpetuity";

  return (
    <div
      id="nda-preview"
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-slate-700 font-serif leading-relaxed"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* Cover Page */}
      <div id="pdf-cover-header" className="text-center mb-10 pb-8 border-b border-slate-200">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Common Paper</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Mutual Non-Disclosure Agreement
        </h1>
        <p className="text-sm text-slate-500">Version 1.0</p>
      </div>

      <div id="pdf-cover-note" className="mb-8 p-5 bg-slate-50 rounded-xl border border-slate-100">
        <p className="text-xs text-slate-500 mb-3 italic">
          This MNDA consists of this Cover Page and the Common Paper Mutual NDA Standard Terms
          Version 1.0. Modifications to the Standard Terms should be made on the Cover Page.
        </p>
      </div>

      {/* Cover fields */}
      <div id="pdf-cover-fields" className="space-y-6 mb-10">
        <CoverField label="Purpose">
          <Blank value={data.purpose} placeholder="[Purpose of disclosure]" />
        </CoverField>

        <CoverField label="Effective Date">
          <Blank value={formatDate(data.effectiveDate)} placeholder="[Effective Date]" />
        </CoverField>

        <CoverField label="MNDA Term">
          Expires <Blank value={mndaTerm} placeholder="[Term]" />
          {data.mndaTermType === "expires" && (
            <> — or continues until terminated.</>
          )}
        </CoverField>

        <CoverField label="Term of Confidentiality">
          <Blank value={confidentialityTerm} placeholder="[Confidentiality Term]" />
        </CoverField>

        <CoverField label="Governing Law & Jurisdiction">
          <span className="font-semibold">Governing Law: </span>
          <Blank value={data.governingLaw} placeholder="[State]" />
          <br />
          <span className="font-semibold">Jurisdiction: </span>
          <Blank value={data.jurisdiction} placeholder="[City, State]" />
        </CoverField>

        <CoverField label="MNDA Modifications">
          <span className="text-slate-400 italic">None</span>
        </CoverField>
      </div>

      {/* Signature Table */}
      <div id="pdf-signature-section" className="mb-10">
        <p className="text-sm mb-4 text-slate-600">
          By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective
          Date.
        </p>

        <div className="grid grid-cols-2 gap-6">
          <PartyBlock
            label="Party 1"
            name={data.party1Name}
            title={data.party1Title}
            company={data.party1Company}
            noticeAddress={data.party1NoticeAddress}
            signatureData={data.party1SignatureData}
            date={data.party1Date}
          />
          <PartyBlock
            label="Party 2"
            name={data.party2Name}
            title={data.party2Title}
            company={data.party2Company}
            noticeAddress={data.party2NoticeAddress}
            signatureData={data.party2SignatureData}
            date={data.party2Date}
          />
        </div>
      </div>

      {/* Standard Terms — page-break target for PDF export */}
      <div id="pdf-standard-terms">
      <hr className="border-slate-200 my-10" />

      <h2 className="text-lg font-bold text-slate-900 mb-6">Standard Terms</h2>

      <div className="space-y-5 text-sm leading-7 text-slate-700">
        <Clause number="1" title="Introduction">
          This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover
          Page) (&ldquo;<strong>MNDA</strong>&rdquo;) allows each party (&ldquo;
          <strong>Disclosing Party</strong>&rdquo;) to disclose or make available information in
          connection with the{" "}
          <Blank value={data.purpose} placeholder="[Purpose]" /> which (1) the Disclosing Party
          identifies to the receiving party (&ldquo;<strong>Receiving Party</strong>&rdquo;) as
          &ldquo;confidential&rdquo;, &ldquo;proprietary&rdquo;, or the like or (2) should be
          reasonably understood as confidential or proprietary due to its nature and the
          circumstances of its disclosure (&ldquo;<strong>Confidential Information</strong>&rdquo;).
          Each party&apos;s Confidential Information also includes the existence and status of the
          parties&apos; discussions and information on the Cover Page. To use this MNDA, the parties
          must complete and sign a cover page incorporating these Standard Terms (&ldquo;
          <strong>Cover Page</strong>&rdquo;).
        </Clause>

        <Clause number="2" title="Use and Protection of Confidential Information">
          The Receiving Party shall: (a) use Confidential Information solely for the{" "}
          <Blank value={data.purpose} placeholder="[Purpose]" />; (b) not disclose Confidential
          Information to third parties without the Disclosing Party&apos;s prior written approval,
          except that the Receiving Party may disclose Confidential Information to its employees,
          agents, advisors, contractors and other representatives having a reasonable need to know
          for the <Blank value={data.purpose} placeholder="[Purpose]" />, provided these
          representatives are bound by confidentiality obligations no less protective of the
          Disclosing Party than the applicable terms in this MNDA; and (c) protect Confidential
          Information using at least the same protections the Receiving Party uses for its own
          similar information but no less than a reasonable standard of care.
        </Clause>

        <Clause number="3" title="Exceptions">
          The Receiving Party&apos;s obligations in this MNDA do not apply to information that it
          can demonstrate: (a) is or becomes publicly available through no fault of the Receiving
          Party; (b) it rightfully knew or possessed prior to receipt from the Disclosing Party
          without confidentiality restrictions; (c) it rightfully obtained from a third party without
          confidentiality restrictions; or (d) it independently developed without using or
          referencing the Confidential Information.
        </Clause>

        <Clause number="4" title="Disclosures Required by Law">
          The Receiving Party may disclose Confidential Information to the extent required by law,
          regulation or regulatory authority, subpoena or court order, provided (to the extent
          legally permitted) it provides the Disclosing Party reasonable advance notice of the
          required disclosure and reasonably cooperates, at the Disclosing Party&apos;s expense,
          with the Disclosing Party&apos;s efforts to obtain confidential treatment for the
          Confidential Information.
        </Clause>

        <Clause number="5" title="Term and Termination">
          This MNDA commences on the{" "}
          <Blank value={formatDate(data.effectiveDate)} placeholder="[Effective Date]" /> and
          expires at the end of the <Blank value={mndaTerm} placeholder="[MNDA Term]" />. Either
          party may terminate this MNDA for any or no reason upon written notice to the other party.
          The Receiving Party&apos;s obligations relating to Confidential Information will survive
          for the <Blank value={confidentialityTerm} placeholder="[Term of Confidentiality]" />,
          despite any expiration or termination of this MNDA.
        </Clause>

        <Clause number="6" title="Return or Destruction of Confidential Information">
          Upon expiration or termination of this MNDA or upon the Disclosing Party&apos;s earlier
          request, the Receiving Party will: (a) cease using Confidential Information; (b) promptly
          after the Disclosing Party&apos;s written request, destroy all Confidential Information in
          the Receiving Party&apos;s possession or control or return it to the Disclosing Party; and
          (c) if requested by the Disclosing Party, confirm its compliance with these obligations in
          writing.
        </Clause>

        <Clause number="7" title="Proprietary Rights">
          The Disclosing Party retains all of its intellectual property and other rights in its
          Confidential Information and its disclosure to the Receiving Party grants no license under
          such rights.
        </Clause>

        <Clause number="8" title="Disclaimer">
          ALL CONFIDENTIAL INFORMATION IS PROVIDED &ldquo;AS IS&rdquo;, WITH ALL FAULTS, AND
          WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS
          FOR A PARTICULAR PURPOSE.
        </Clause>

        <Clause number="9" title="Governing Law and Jurisdiction">
          This MNDA and all matters relating hereto are governed by, and construed in accordance
          with, the laws of the State of{" "}
          <Blank value={data.governingLaw} placeholder="[Governing Law]" />, without regard to the
          conflict of laws provisions of such{" "}
          <Blank value={data.governingLaw} placeholder="[Governing Law]" />. Any legal suit, action,
          or proceeding relating to this MNDA must be instituted in the federal or state courts
          located in <Blank value={data.jurisdiction} placeholder="[Jurisdiction]" />. Each party
          irrevocably submits to the exclusive jurisdiction of such{" "}
          <Blank value={data.jurisdiction} placeholder="[Jurisdiction]" /> in any such suit, action,
          or proceeding.
        </Clause>

        <Clause number="10" title="Equitable Relief">
          A breach of this MNDA may cause irreparable harm for which monetary damages are an
          insufficient remedy. Upon a breach of this MNDA, the Disclosing Party is entitled to seek
          appropriate equitable relief, including an injunction, in addition to its other remedies.
        </Clause>

        <Clause number="11" title="General">
          Neither party has an obligation under this MNDA to disclose Confidential Information to
          the other or proceed with any proposed transaction. Neither party may assign this MNDA
          without the prior written consent of the other party, except that either party may assign
          this MNDA in connection with a merger, reorganization, acquisition or other transfer of
          all or substantially all its assets or voting securities. This MNDA (including the Cover
          Page) constitutes the entire agreement of the parties with respect to its subject matter,
          and supersedes all prior and contemporaneous understandings, agreements, representations,
          and warranties, whether written or oral, regarding such subject matter. This MNDA may only
          be amended, modified, waived, or supplemented by an agreement in writing signed by both
          parties.
        </Clause>
      </div>

      <p className="mt-8 text-xs text-slate-400 text-center">
        Common Paper Mutual Non-Disclosure Agreement Version 1.0 — free to use under CC BY 4.0.
      </p>
      </div>{/* end #pdf-standard-terms */}
    </div>
  );
}

function CoverField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-100 pb-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <div className="text-sm text-slate-700">{children}</div>
    </div>
  );
}

function PartyBlock({
  label,
  name,
  title,
  company,
  noticeAddress,
  signatureData,
  date,
}: {
  label: string;
  name: string;
  title: string;
  company: string;
  noticeAddress: string;
  signatureData: string;
  date: string;
}) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-3 text-sm">
      <p className="font-semibold text-slate-800 text-xs uppercase tracking-wide">{label}</p>

      <div className="min-h-18 border border-slate-100 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden">
        {signatureData ? (
          <img src={signatureData} alt={`${label} signature`} className="max-h-16 object-contain" />
        ) : (
          <span className="text-xs text-slate-300 italic">Signature</span>
        )}
      </div>

      <SignatureRow label="Print Name" value={name} />
      <SignatureRow label="Title" value={title} />
      <SignatureRow label="Company" value={company} />
      <SignatureRow label="Notice Address" value={noticeAddress} />
      <SignatureRow label="Date" value={formatDate(date)} />
    </div>
  );
}

function SignatureRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 border-b border-slate-100 pb-1">
      <span className="text-xs text-slate-400 w-28 shrink-0">{label}</span>
      <span className={`text-xs flex-1 ${value && value !== "[Date]" ? "text-slate-800" : "text-slate-300"}`}>
        {value || "—"}
      </span>
    </div>
  );
}

function Clause({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <p>
      <strong>
        {number}. {title}.
      </strong>{" "}
      {children}
    </p>
  );
}
