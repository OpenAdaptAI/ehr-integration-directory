export type EvidenceStatus =
  | "documented"
  | "partner-gated"
  | "site-specific"
  | "not-found"
  | "unknown";

export type Source = {
  label: string;
  url: string;
  kind: "official" | "registry" | "secondary";
};

export type Capability = {
  label: string;
  status: EvidenceStatus;
  detail: string;
};

export type EhrRecord = {
  slug: string;
  name: string;
  vendor: string;
  market: string;
  status: EvidenceStatus;
  access: string;
  surfaces: string[];
  summary: string;
  verdict: string;
  nextStep: string;
  openAdaptFit: "low" | "conditional" | "strong";
  openAdaptReason: string;
  capabilities: Capability[];
  sources: Source[];
  lastReviewed: string;
};

export const statusLabels: Record<EvidenceStatus, string> = {
  documented: "Documented",
  "partner-gated": "Partner-gated",
  "site-specific": "Site-specific",
  "not-found": "Not found publicly",
  unknown: "Unknown",
};

// Sources shared by several Canadian profiles.
const ONTARIOMD_CERTIFIED: Source = {
  label: "OntarioMD certified EMRs",
  url: "https://www.ontariomd.ca/emr-certification/certified-emrs",
  kind: "registry",
};
const BC_DRO_INTEGRATIONS: Source = {
  label: "B.C. Digital Referrals and Orders: EMR integrations",
  url: "https://dro.phsa.ca/about-dro/emr-integrations",
  kind: "registry",
};
const OCEAN_NETWORK_INTEGRATIONS: Source = {
  label: "Ocean network integrations",
  url: "https://www.oceanmd.com/network-integrations/",
  kind: "official",
};
const OCEAN_ACCURO_WORKFLOWS: Source = {
  label: "Accuro and Ocean workflows (Ocean, November 2023)",
  url: "https://www.oceanmd.com/news/accuro-deepens-ocean-integration-with-enhanced-workflows/",
  kind: "official",
};
const TELUS_EMR_ADD_ONS: Source = {
  label: "TELUS EMR add-ons",
  url: "https://www.telus.com/en/health/health-professionals/clinics/emr-add-ons",
  kind: "official",
};
const WELLSTAR_DEVELOPER_PROGRAM: Source = {
  label: "WELLSTAR Developer Program",
  url: "https://info.wellstar.health/wellstar-developer-program",
  kind: "official",
};

export const ehrs: EhrRecord[] = [
  {
    slug: "epic",
    name: "Epic",
    vendor: "Epic Systems",
    market: "Enterprise health systems",
    status: "site-specific",
    access: "Public developer docs and sandbox; production access depends on the organization and interface",
    surfaces: ["FHIR R4", "SMART on FHIR", "HL7", "Web services"],
    summary:
      "Epic publishes a broad interface catalog, testing resources, and a public endpoint directory. Whether a workflow can write directly depends on the exact API, customer authorization, and local deployment.",
    verdict:
      "Start with the official interface catalog. Treat write-back as operation-specific, not as a platform-wide yes or no.",
    nextStep:
      "Name the target operation, locate the matching API, and confirm production enablement with the Epic customer organization.",
    openAdaptFit: "conditional",
    openAdaptReason:
      "Useful when the required operation has no practical enabled interface at the target organization but is available in an approved UI workflow.",
    capabilities: [
      {
        label: "Public documentation",
        status: "documented",
        detail: "Open.epic publishes FHIR, HL7, web-service, and other interface material.",
      },
      {
        label: "Developer test path",
        status: "documented",
        detail: "Sandbox patients, endpoints, and SMART testing are publicly described.",
      },
      {
        label: "Operational write-back",
        status: "site-specific",
        detail: "Availability varies by API, workflow, customer authorization, and deployment.",
      },
    ],
    sources: [
      { label: "Developer resources", url: "https://open.epic.com/DeveloperResources", kind: "official" },
      { label: "FHIR interfaces", url: "https://open.epic.com/interface/FHIR", kind: "official" },
      { label: "Epic support and API access", url: "https://open.epic.com/EpicSupport", kind: "official" },
    ],
    lastReviewed: "2026-08-28",
  },
  {
    slug: "oracle-health",
    name: "Oracle Health Millennium",
    vendor: "Oracle Health",
    market: "Enterprise health systems",
    status: "site-specific",
    access: "Public API catalog with SMART authorization; production use requires an authorized deployment context",
    surfaces: ["FHIR R4", "SMART on FHIR", "Millennium APIs"],
    summary:
      "Oracle documents Millennium Platform APIs, SMART authorization, and operation-level resources. Some writes are explicitly documented, but availability must be checked per operation and tenant.",
    verdict:
      "There is a credible direct API path for documented operations. Validate the exact method and authorization context before designing around it.",
    nextStep:
      "Look up the target resource and method in the Millennium catalog, then validate scopes and tenant enablement.",
    openAdaptFit: "conditional",
    openAdaptReason:
      "A UI path may be worth qualifying only when the needed operation is absent, unavailable in the deployment, or operationally blocked.",
    capabilities: [
      { label: "Public documentation", status: "documented", detail: "Oracle publishes R4, DSTU2, and EHR API documentation." },
      { label: "Authorization", status: "documented", detail: "SMART authorization and registered-user access are documented." },
      { label: "Operational write-back", status: "site-specific", detail: "Several writes are documented; applicability remains resource- and tenant-specific." },
    ],
    sources: [
      { label: "Millennium Platform APIs", url: "https://docs.oracle.com/en/industries/health/millennium-platform-apis/index.html", kind: "official" },
      { label: "API catalog", url: "https://docs.oracle.com/en/industries/health/millennium-platform-apis/apis.html", kind: "official" },
      { label: "FHIR authorization", url: "https://docs.oracle.com/en/industries/health/millennium-platform-apis/fhir-authorization-framework/", kind: "official" },
    ],
    lastReviewed: "2026-08-28",
  },
  {
    slug: "athenahealth",
    name: "athenaOne",
    vendor: "athenahealth",
    market: "Ambulatory care",
    status: "documented",
    access: "Public documentation; OAuth and customer authorization apply",
    surfaces: ["FHIR R4", "OAuth 2.0", "athena APIs"],
    summary:
      "athenahealth publicly describes FHIR endpoints and a broad library of write APIs across administrative and clinical workflows.",
    verdict:
      "Use the direct API first when the target operation appears in the catalog. Confirm customer authorization and workflow-specific requirements.",
    nextStep:
      "Find the operation in the complete API list, test in the supported environment, and validate required scopes.",
    openAdaptFit: "low",
    openAdaptReason:
      "Prefer the documented API. Consider a qualified UI workflow only for a specific gap that the API catalog does not cover in practice.",
    capabilities: [
      { label: "Public documentation", status: "documented", detail: "FHIR and proprietary API guides are public." },
      { label: "Authorization", status: "documented", detail: "OAuth 2.0 flows and access requirements are documented." },
      { label: "Operational write-back", status: "documented", detail: "The vendor describes a broad library of write APIs; verify the exact operation." },
    ],
    sources: [
      { label: "FHIR APIs", url: "https://docs.athenahealth.com/api/docs/fhir-apis", kind: "official" },
      { label: "Complete API list", url: "https://docs.athenahealth.com/api/resources/complete_list_athena_apis", kind: "official" },
      { label: "Authorization overview", url: "https://docs.athenahealth.com/api/guides/authorization-overview", kind: "official" },
    ],
    lastReviewed: "2026-08-28",
  },
  {
    slug: "meditech",
    name: "MEDITECH Expanse",
    vendor: "MEDITECH",
    market: "Hospitals and health systems",
    status: "not-found",
    access: "Public patient-access FHIR documentation; operational integration details require vendor or site review",
    surfaces: ["FHIR R4", "US Core", "Argonaut R2"],
    summary:
      "MEDITECH publishes patient health data API resources and FHIR implementation material. The reviewed public pages did not establish a general operational write-back path.",
    verdict:
      "Do not interpret public patient-access documentation as proof of operational writes. Escalate the exact workflow for vendor and customer review.",
    nextStep:
      "Check the current capability statement and ask the MEDITECH customer organization about the specific write operation.",
    openAdaptFit: "strong",
    openAdaptReason:
      "A demonstrated UI workflow may be a strong qualification candidate when no practical write interface can be confirmed.",
    capabilities: [
      { label: "Patient-access FHIR", status: "documented", detail: "FHIR R4 and patient access material are public." },
      { label: "Developer test path", status: "unknown", detail: "No general public sandbox path was established in the reviewed sources." },
      { label: "Operational write-back", status: "not-found", detail: "Not found in the public documentation reviewed; this is not a claim of non-support." },
    ],
    sources: [
      { label: "REST API resources", url: "https://home.meditech.com/en/d/restapiresources/pages/apidoc.htm", kind: "official" },
      { label: "Patient access API FAQ", url: "https://home.meditech.com/en/d/restapiresources/pages/patientaccessapisfaqs.htm", kind: "official" },
    ],
    lastReviewed: "2026-08-28",
  },
  {
    slug: "eclinicalworks",
    name: "eClinicalWorks",
    vendor: "eClinicalWorks",
    market: "Ambulatory care",
    status: "partner-gated",
    access: "Developer portal account and review; customer authorization may apply",
    surfaces: ["FHIR R4", "SMART on FHIR", "Backend services", "Bulk data"],
    summary:
      "eClinicalWorks describes provider-facing SMART applications, backend services, bulk access, and a self-service developer program. Detailed operation availability sits behind the portal and deployment context.",
    verdict:
      "Register in the developer program and verify the target operation before assuming either read or write behavior.",
    nextStep:
      "Create a developer account, identify the app model, and validate scopes and production approval requirements.",
    openAdaptFit: "conditional",
    openAdaptReason:
      "Relevant when portal review shows the needed operational write is unavailable or materially impractical for the customer workflow.",
    capabilities: [
      { label: "FHIR and SMART", status: "documented", detail: "FHIR, provider-facing SMART, backend, and bulk patterns are publicly described." },
      { label: "Developer access", status: "partner-gated", detail: "Self-service registration is reviewed and approved." },
      { label: "Operational write-back", status: "unknown", detail: "Must be checked in the developer portal for the exact resource and app model." },
    ],
    sources: [
      { label: "Interoperability platform", url: "https://www.eclinicalworks.com/products-services/interoperability/", kind: "official" },
      { label: "Certified EHR technology", url: "https://www.eclinicalworks.com/resources/certified-ehr-technology/", kind: "official" },
      { label: "Open interoperability announcement", url: "https://www.eclinicalworks.com/eclinicalworks-announces-open-interoperability/", kind: "official" },
    ],
    lastReviewed: "2026-08-28",
  },
  {
    slug: "nextgen",
    name: "NextGen Enterprise",
    vendor: "NextGen Healthcare",
    market: "Ambulatory and specialty care",
    status: "partner-gated",
    access: "Public overview plus authenticated developer portal and onboarding",
    surfaces: ["FHIR R4", "FHIR DSTU2", "Developer portal"],
    summary:
      "NextGen publishes a public API overview and FHIR availability by product. Detailed developer materials and onboarding require portal registration.",
    verdict:
      "Use the public overview to identify the product family, then confirm the exact operation inside the portal.",
    nextStep:
      "Complete API onboarding and verify edition, resource, method, scopes, and customer deployment requirements.",
    openAdaptFit: "conditional",
    openAdaptReason:
      "Qualify a UI route only after the portal and customer review fail to produce a practical interface for the exact operation.",
    capabilities: [
      { label: "Public API overview", status: "documented", detail: "FHIR R4 and DSTU2 availability is described publicly." },
      { label: "Detailed developer access", status: "partner-gated", detail: "The developer portal requires signup or login." },
      { label: "Operational write-back", status: "unknown", detail: "Operation-level write evidence must be verified inside the portal." },
    ],
    sources: [
      { label: "NextGen API overview", url: "https://www.nextgen.com/api", kind: "official" },
      { label: "Developer portal", url: "https://developer.nextgen.com/", kind: "official" },
      { label: "API onboarding", url: "https://www.nextgen.com/api-on-boarding", kind: "official" },
    ],
    lastReviewed: "2026-08-28",
  },
  {
    slug: "veradigm",
    name: "Veradigm EHR",
    vendor: "Veradigm",
    market: "Ambulatory care",
    status: "site-specific",
    access: "Public FHIR docs and sandbox credentials; EHR launch and production setup depend on tier and client configuration",
    surfaces: ["FHIR R4", "SMART on FHIR", "OAuth 2.0", "OpenID Connect"],
    summary:
      "Veradigm publishes detailed FHIR resources, SMART authorization patterns, sandbox setup, and an endpoint directory. Production provider and system access requires configuration and may require a qualifying tier.",
    verdict:
      "The public path is unusually legible. Verify the target resource method and deployment tier before implementation.",
    nextStep:
      "Review the resource method, obtain sandbox credentials, then confirm EHR launch or backend configuration with the client.",
    openAdaptFit: "conditional",
    openAdaptReason:
      "Consider UI execution for an exact operation missing from the published resource methods or blocked by deployment constraints.",
    capabilities: [
      { label: "Public FHIR resources", status: "documented", detail: "Supported R4 resources and methods are published." },
      { label: "Sandbox and auth", status: "documented", detail: "SMART flows and sandbox credential steps are described." },
      { label: "Production deployment", status: "site-specific", detail: "EHR launch and client configuration depend on tier and environment." },
    ],
    sources: [
      { label: "FHIR introduction", url: "https://developer.veradigm.com/Fhir/Introduction", kind: "official" },
      { label: "FHIR resources", url: "https://developer.veradigm.com/Fhir/Resources", kind: "official" },
      { label: "SMART on FHIR", url: "https://developer.veradigm.com/Fhir/SMARTonFHIR", kind: "official" },
    ],
    lastReviewed: "2026-08-28",
  },
  {
    slug: "greenway",
    name: "Greenway Intergy / Prime Suite",
    vendor: "Greenway Health",
    market: "Ambulatory care",
    status: "site-specific",
    access: "Public docs and app registration; backend service access requires client permission",
    surfaces: ["FHIR R4", "SMART on FHIR", "Backend services"],
    summary:
      "Greenway publishes FHIR R4 documentation for Intergy and Prime Suite, plus guides for SMART apps and backend services. Production backend access explicitly involves client approval.",
    verdict:
      "A documented integration path exists, but production viability depends on app type, resource method, product, and client permission.",
    nextStep:
      "Choose SMART launch or backend services, register the app, and validate the target resource and client approval path.",
    openAdaptFit: "conditional",
    openAdaptReason:
      "Useful when the needed operation falls outside published methods or client-approved API access cannot serve the workflow.",
    capabilities: [
      { label: "Public FHIR documentation", status: "documented", detail: "FHIR R4 guides for supported Greenway products are public." },
      { label: "App registration", status: "documented", detail: "SMART and backend application creation are documented." },
      { label: "Production access", status: "site-specific", detail: "Backend service access requires site or client approval." },
    ],
    sources: [
      { label: "Getting started", url: "https://developers.greenwayhealth.com/developer-platform/docs/getting-started", kind: "official" },
      { label: "API overview", url: "https://developers.greenwayhealth.com/developer-platform/docs/api-an-overview", kind: "official" },
      { label: "Backend services", url: "https://developers.greenwayhealth.com/developer-platform/docs/how-to-create-a-backend-services-application", kind: "official" },
    ],
    lastReviewed: "2026-08-28",
  },
  {
    slug: "advancedmd",
    name: "AdvancedMD",
    vendor: "AdvancedMD",
    market: "Ambulatory and practice management",
    status: "partner-gated",
    access: "Developer license request with a documented testing sandbox",
    surfaces: ["REST", "XML-RPC", "FHIR"],
    summary:
      "AdvancedMD describes proprietary Connect APIs that replicate much of the product UI, alongside a developer license request and testing sandbox.",
    verdict:
      "The proprietary API is the primary path and appears broad, but access is gated. Verify the exact method after licensing.",
    nextStep:
      "Submit the API connection request, obtain sandbox access, and test the target workflow against the licensed API.",
    openAdaptFit: "low",
    openAdaptReason:
      "Prefer the broad proprietary API. Reconsider only if licensing or a missing operation makes it impractical for the specific deployment.",
    capabilities: [
      { label: "Broad proprietary API", status: "documented", detail: "AdvancedMD states that Connect APIs replicate nearly all UI functionality." },
      { label: "Developer access", status: "partner-gated", detail: "A developer license and connection request are required." },
      { label: "Testing sandbox", status: "documented", detail: "A testing environment is publicly described." },
    ],
    sources: [
      { label: "Developer solutions", url: "https://www.advancedmd.com/group-practice/developer-solutions/", kind: "official" },
      { label: "API connection request", url: "https://www.advancedmd.com/api-connection-request/", kind: "official" },
      { label: "Testing sandbox", url: "https://www.advancedmd.com/group-practice/testing-sandbox/", kind: "official" },
    ],
    lastReviewed: "2026-08-28",
  },
  {
    slug: "pointclickcare",
    name: "PointClickCare",
    vendor: "PointClickCare",
    market: "Long-term and post-acute care",
    status: "partner-gated",
    access: "Marketplace or Amplify partner program access",
    surfaces: ["Cures Act APIs", "Proprietary APIs", "Developer tools"],
    summary:
      "PointClickCare describes developer tools and APIs through its partner ecosystem. Operation-level documentation and production access are gated by the program.",
    verdict:
      "Treat the partner program as the primary route. No broad public claim about write operations is justified from the reviewed pages.",
    nextStep:
      "Qualify for the partner program and request documentation for the exact clinical or administrative operation.",
    openAdaptFit: "strong",
    openAdaptReason:
      "A UI workflow may merit qualification when partner access is unavailable or the required operation is outside the approved API surface.",
    capabilities: [
      { label: "Developer program", status: "documented", detail: "The vendor publicly describes partner access to developer tools and APIs." },
      { label: "Detailed documentation", status: "partner-gated", detail: "Operation-level materials require program access." },
      { label: "Operational write-back", status: "unknown", detail: "Must be verified for the exact partner product and operation." },
    ],
    sources: [
      { label: "Developer program", url: "https://developer.pointclickcare.com/", kind: "official" },
    ],
    lastReviewed: "2026-08-28",
  },
  {
    slug: "accuro",
    name: "Accuro EMR",
    vendor: "QHR Technologies (part of Loblaw Companies)",
    market: "Canadian ambulatory care",
    status: "partner-gated",
    access: "Email QHR, sign a Terms of Use, build in a 6-month sandbox, pass certification, then sign an agreement",
    surfaces: ["REST API", "OAuth 2.0", "Ocean eReferral"],
    summary:
      "QHR publishes a REST API for Accuro, and its public API reference lists write operations. Access starts with an email to QHR and a signed Terms of Use. You then get API tokens and a sandbox for 6 months. After testing and certification, QHR draws up an agreement, and you agree on a production date.",
    verdict:
      "There's a documented write path for patients, documents, waitlists, referral orders, tasks, and appointments. It's agreement-gated, and each clinic may need its own approval.",
    nextStep:
      "Email inquiry@AccuroEMR.com with your contact details, company URL, and a short product overview. Name the exact operation, and ask which endpoints your approved application can call before you build against the sandbox.",
    openAdaptFit: "conditional",
    openAdaptReason:
      "Use the API once QHR approves it for your operation. Screen work fits the gaps, such as a clinic that's still waiting for access or a field the approved endpoints don't cover.",
    capabilities: [
      {
        label: "REST API reference",
        status: "documented",
        detail:
          "QHR's public API reference (version 12.7.0 when we checked) lists endpoints with the OAuth 2.0 scopes they need. QHR's example also shows the Accuro user permission an endpoint needs. The reference advises integrators to validate their own input and output data.",
      },
      {
        label: "Documented write operations",
        status: "documented",
        detail:
          "The reference lists endpoints that create patients and save documents, waitlist entries, referral orders, tasks, and appointments. Each one needs its own write scope.",
      },
      {
        label: "Developer test path",
        status: "documented",
        detail: "After you return the signed Terms of Use, QHR provides API tokens and a sandbox that stays active for 6 months.",
      },
      {
        label: "Production access",
        status: "partner-gated",
        detail:
          "You send QHR the pass certificate after testing. QHR then draws up an agreement. Once everyone signs it, you and QHR agree on a date to move to the production API.",
      },
      {
        label: "Clinic enablement",
        status: "site-specific",
        detail:
          "One integrator's guide says each physician applies, the clinic signs QHR's indemnity agreement, and setup typically takes up to 3 weeks.",
      },
      {
        label: "Hosted delivery",
        status: "documented",
        detail: "QHR's requirements page says each workstation needs the Citrix Workspace app to run Accuro Cloud.",
      },
      {
        label: "Referral network",
        status: "documented",
        detail:
          "Ocean says that after a referral from a new patient is imported into Accuro, Ocean can create the patient's chart. B.C.'s Digital Referrals and Orders program lists Accuro as integrated.",
      },
    ],
    sources: [
      { label: "Accuro API", url: "https://accuroemr.com/accuroapi/", kind: "official" },
      { label: "Using Accuro's REST API", url: "https://accuroemr.com/accuroapi/technical/using-accuros-rest-api/", kind: "official" },
      { label: "API list and scopes", url: "https://accuroemr.com/accuroapi/technical/apis/", kind: "official" },
      { label: "Accuro API reference", url: "https://apidocs.dev.qhrtech.com/docs/", kind: "official" },
      { label: "Accuro Cloud system requirements", url: "https://accuroemr.com/cloud-system-requirements/", kind: "official" },
      OCEAN_ACCURO_WORKFLOWS,
      BC_DRO_INTEGRATIONS,
      ONTARIOMD_CERTIFIED,
      {
        label: "Integrator setup guide (Empathia AI)",
        url: "https://support.empathia.ai/support/solutions/articles/153000246463-how-to-set-up-your-qhr-accuro-empathia-ai-integration",
        kind: "secondary",
      },
    ],
    lastReviewed: "2026-10-08",
  },
  {
    slug: "ps-suite",
    name: "PS Suite EMR",
    vendor: "TELUS Health",
    market: "Canadian ambulatory care",
    status: "partner-gated",
    access: "No public API reference found; partner add-ons go through TELUS, then a clinic administrator turns each one on",
    surfaces: ["TELUS partner add-ons", "Ocean eReferral"],
    summary:
      "TELUS lists add-ons from outside partners for PS Suite, but we found no public API reference. One partner's setup guide says the partner sends the clinic's paperwork to TELUS, TELUS connects the EMR, and a clinic administrator then enables the add-on inside PS Suite.",
    verdict:
      "Treat PS Suite as partner-gated. Ask TELUS what a partner add-on can write before you plan around one.",
    nextStep:
      "Contact TELUS Health with the exact operation. Ask whether a partner add-on can write it, and how a clinic approves and enables the add-on.",
    openAdaptFit: "conditional",
    openAdaptReason:
      "Ask TELUS first. If no add-on covers the step, staff type it in by hand today, and that's the kind of screen work OpenAdapt automates and checks.",
    capabilities: [
      { label: "Public API reference", status: "not-found", detail: "Not found in the reviewed public sources; this is not a claim of non-support." },
      { label: "Partner add-ons", status: "documented", detail: "TELUS's add-on page covers CHR, Med Access, and PS Suite, and lists add-ons from outside partners." },
      {
        label: "Clinic enablement",
        status: "site-specific",
        detail:
          "A partner's guide (August 2026) says TELUS connects the EMR, which can take up to 10 business days. A PS Suite administrator then enables the add-on in Integration Management.",
      },
      {
        label: "Deployment",
        status: "documented",
        detail: "TELUS lists a hosted (ASP) offering in Ontario and Alberta and a local offering in Ontario. OntarioMD certifies PS Suite for local and hosted use.",
      },
      { label: "Referral network", status: "documented", detail: "Ocean lists PS Suite among its integrations." },
      {
        label: "Writing data back",
        status: "unknown",
        detail: "The reviewed sources don't say which records a partner add-on can write. It depends on the partner agreement.",
      },
    ],
    sources: [
      { label: "PS Suite EMR", url: "https://www.telus.com/en/health/health-professionals/clinics/ps-suite", kind: "official" },
      TELUS_EMR_ADD_ONS,
      OCEAN_NETWORK_INTEGRATIONS,
      ONTARIOMD_CERTIFIED,
      { label: "Partner setup guide (Tali AI)", url: "https://help.tali.ai/en/articles/set-up-the-ps-suite-integration", kind: "secondary" },
    ],
    lastReviewed: "2026-10-08",
  },
  {
    slug: "med-access",
    name: "Med Access EMR",
    vendor: "TELUS Health",
    market: "Canadian ambulatory care",
    status: "partner-gated",
    access: "No public API reference found; outside tools connect through TELUS's add-on program",
    surfaces: ["TELUS partner add-ons", "Ocean eReferral"],
    summary:
      "Med Access is TELUS Health's web-based EMR. We found no public API reference for it. Outside tools connect through TELUS's add-on program, and B.C.'s eReferral program lists Med Access as integrated.",
    verdict:
      "Treat Med Access as partner-gated. Confirm with TELUS what an add-on can write.",
    nextStep:
      "Contact TELUS Health with the exact operation, and ask which add-on or partner route covers it.",
    openAdaptFit: "conditional",
    openAdaptReason:
      "Ask TELUS first. If no add-on covers the step, staff type it in by hand today, and that's the kind of screen work OpenAdapt automates and checks.",
    capabilities: [
      { label: "Public API reference", status: "not-found", detail: "Not found in the reviewed public sources; this is not a claim of non-support." },
      { label: "Partner add-ons", status: "documented", detail: "TELUS's add-on page covers Med Access and lists add-ons from outside partners." },
      { label: "Web-based client", status: "documented", detail: "TELUS describes Med Access as web-based, with access from anywhere that has an internet connection." },
      {
        label: "Referral network",
        status: "documented",
        detail: "B.C.'s Digital Referrals and Orders program lists Med Access as integrated, and Ocean lists it among its integrations.",
      },
      { label: "Writing data back", status: "unknown", detail: "The reviewed sources don't say which records an add-on can write." },
    ],
    sources: [
      { label: "Med Access EMR", url: "https://www.telus.com/en/health/health-professionals/clinics/med-access", kind: "official" },
      TELUS_EMR_ADD_ONS,
      BC_DRO_INTEGRATIONS,
      OCEAN_NETWORK_INTEGRATIONS,
      ONTARIOMD_CERTIFIED,
    ],
    lastReviewed: "2026-10-08",
  },
  {
    slug: "telus-chr",
    name: "Collaborative Health Record (CHR)",
    vendor: "TELUS Health",
    market: "Canadian ambulatory care",
    status: "partner-gated",
    access: "Paid CHR Enterprise API, limited to a select few customers; needs a signed contract and TELUS enablement for each CHR domain",
    surfaces: ["GraphQL", "JWT (RS512)", "Ocean eReferral"],
    summary:
      "TELUS documents a CHR Enterprise API that reads and writes CHR data through GraphQL. Its public schema includes mutations that create patients, appointments, incoming referral records, and tasks. It's a paid feature, and TELUS turns it on for each CHR domain after a contract and a privacy and security review.",
    verdict:
      "There's a documented write path, including referral records. Access depends on the clinic's contract with TELUS.",
    nextStep:
      "Check the exact mutation in the public schema, then confirm the clinic has, or will buy, CHR Enterprise API access for its domain.",
    openAdaptFit: "low",
    openAdaptReason:
      "Use the Enterprise API when the clinic has it. Screen work only makes sense for a clinic without API access, or for a step the schema doesn't cover.",
    capabilities: [
      {
        label: "Public documentation",
        status: "documented",
        detail: "TELUS publishes Enterprise API guides and a public schema viewer you can explore before you have access.",
      },
      {
        label: "Documented write operations",
        status: "documented",
        detail:
          "The schema lists mutations such as createPatient, createAppointment, createIncomingReferralRecord, and createTask. CHR applies the account's own rules to API writes, such as an appointment type's booking times and a provider's working hours.",
      },
      {
        label: "Access",
        status: "partner-gated",
        detail:
          "TELUS calls the API a paid feature that's currently limited to a select few customers. Access needs a signed contract, an intake questionnaire, and a privacy and security review before production.",
      },
      { label: "Developer test path", status: "documented", detail: "Subscribers get a sandbox CHR domain with fake patient data." },
      {
        label: "Audit trail",
        status: "documented",
        detail: "CHR records every API action in its audit log under the API consumer that made it, and keeps API requests and responses for 90 days.",
      },
      { label: "Referral network", status: "documented", detail: "Ocean lists TELUS Health CHR among its integrations." },
    ],
    sources: [
      { label: "CHR Enterprise API", url: "https://help.inputhealth.com/en/articles/6483215-chr-enterprise-api", kind: "official" },
      { label: "Enterprise API onboarding", url: "https://help.inputhealth.com/en/articles/6368814-enterprise-api-onboarding-overview", kind: "official" },
      { label: "API reference documentation", url: "https://help.inputhealth.com/en/articles/5941595-api-reference-documentation", kind: "official" },
      { label: "Enterprise API schema viewer", url: "https://apidocs.ca.inputhealth.com/enterprise-api", kind: "official" },
      { label: "Collaborative Health Record", url: "https://www.telus.com/en/health/health-professionals/clinics/collaborative-health-record", kind: "official" },
      OCEAN_NETWORK_INTEGRATIONS,
      ONTARIOMD_CERTIFIED,
    ],
    lastReviewed: "2026-10-08",
  },
  {
    slug: "oscar-pro",
    name: "OSCAR Pro",
    vendor: "WELLSTAR (WELL Health)",
    market: "Canadian ambulatory care",
    status: "partner-gated",
    access: "WELLSTAR Developer Program: apply with a pilot clinic's letter of support, sign a sandbox agreement, then pass a conformance review",
    surfaces: ["WELLSTAR Developer Program", "REST (/ws/)", "OAuth 1.0", "Ocean eReferral"],
    summary:
      "OSCAR Pro is WELLSTAR's edition of the open-source OSCAR EMR. WELLSTAR runs a developer program that it describes as one integration path for OSCAR Pro and Juno. Open-source OSCAR also documents a REST layer secured with OAuth 1.0.",
    verdict:
      "There's a documented route, but it runs through WELLSTAR's program and each clinic's setup.",
    nextStep:
      "Apply to the WELLSTAR Developer Program with your product, the target EMRs, and a signed letter from a clinic that's willing to pilot. Confirm the OSCAR Pro version and host at that clinic.",
    openAdaptFit: "conditional",
    openAdaptReason:
      "Use the WELLSTAR route when it covers your step. Screen work fits steps the approved integration doesn't reach.",
    capabilities: [
      {
        label: "Developer program",
        status: "partner-gated",
        detail:
          "You apply with product details, target EMRs, and a signed letter of support from a WELLSTAR clinic that's willing to pilot. API documentation and a test environment come after a sandbox agreement. Launch needs a validation and conformance review.",
      },
      {
        label: "Open-source REST layer",
        status: "documented",
        detail: "The OSCAR developer wiki documents OAuth 1.0 endpoints under /ws/oauth. The page dates from 2017.",
      },
      {
        label: "Client registration",
        status: "site-specific",
        detail:
          "One integrator's guide says API access isn't on by default and an administrator registers each API client inside OSCAR. Details vary by OSCAR variant and host.",
      },
      {
        label: "Referral network",
        status: "documented",
        detail: "B.C.'s Digital Referrals and Orders program lists OSCAR Pro as integrated, and Ocean lists it among its integrations.",
      },
      { label: "Writing data back", status: "site-specific", detail: "Depends on the version, the host, and the integration the clinic approves." },
    ],
    sources: [
      { label: "OSCAR Pro partners", url: "https://oscarpro.ca/partners/", kind: "official" },
      WELLSTAR_DEVELOPER_PROGRAM,
      { label: "OSCAR Pro (WELL Health)", url: "https://well.company/oscar-pro/", kind: "official" },
      {
        label: "OSCAR REST API documentation (wiki, 2017)",
        url: "https://oscaremr.atlassian.net/wiki/spaces/OS/pages/85396074/Documenting+the+REST+API",
        kind: "official",
      },
      BC_DRO_INTEGRATIONS,
      OCEAN_NETWORK_INTEGRATIONS,
      ONTARIOMD_CERTIFIED,
      { label: "OSCAR API guide (Cortico)", url: "https://cortico.health/article/oscar-emr-api-integration/", kind: "secondary" },
    ],
    lastReviewed: "2026-10-08",
  },
  {
    slug: "juno",
    name: "Juno EMR",
    vendor: "WELLSTAR (WELL Health)",
    market: "Canadian ambulatory care",
    status: "partner-gated",
    access: "WELLSTAR Developer Program; no public API reference found",
    surfaces: ["WELLSTAR Developer Program", "Ocean eReferral"],
    summary:
      "Juno is a cloud EMR from WELLSTAR, hosted in Canada. WELLSTAR names Juno in its developer program alongside OSCAR Pro. We found no public API reference for Juno itself.",
    verdict:
      "Treat Juno as partner-gated. Ask WELLSTAR whether its program covers your exact operation on Juno.",
    nextStep:
      "Apply to the WELLSTAR Developer Program, name Juno as a target EMR, and ask which operations the Juno integration can write.",
    openAdaptFit: "conditional",
    openAdaptReason:
      "Ask WELLSTAR first. Screen work fits only the steps the program doesn't cover.",
    capabilities: [
      { label: "Public API reference", status: "not-found", detail: "Not found in the reviewed public sources; this is not a claim of non-support." },
      {
        label: "Developer program",
        status: "partner-gated",
        detail: "WELLSTAR's developer program covers Juno and OSCAR Pro. It asks for a pilot clinic's letter of support and a sandbox agreement.",
      },
      { label: "Cloud delivery", status: "documented", detail: "Juno says it's cloud-based, needs no installation, and is hosted in Canada." },
      {
        label: "Referral network",
        status: "documented",
        detail: "Ocean lists Juno among its integrations. B.C.'s Digital Referrals and Orders program lists a Juno integration as underway.",
      },
      {
        label: "Writing data back",
        status: "partner-gated",
        detail:
          "WELLSTAR shares API documentation only after a sandbox agreement. One booking vendor says its API connection writes bookings, intake responses, and messages back to the Juno chart.",
      },
    ],
    sources: [
      { label: "Juno EMR", url: "https://www.junoemr.com/", kind: "official" },
      WELLSTAR_DEVELOPER_PROGRAM,
      { label: "OSCAR Pro partners (WELLSTAR integration path)", url: "https://oscarpro.ca/partners/", kind: "official" },
      BC_DRO_INTEGRATIONS,
      OCEAN_NETWORK_INTEGRATIONS,
      ONTARIOMD_CERTIFIED,
      { label: "Juno integration (Cortico)", url: "https://cortico.health/emr/juno/", kind: "secondary" },
    ],
    lastReviewed: "2026-10-08",
  },
  {
    slug: "ocean",
    name: "Ocean eReferral network",
    vendor: "OceanMD (WELL Health)",
    market: "Canadian eReferral network",
    status: "documented",
    access: "Email Ocean Support with your test email domain, company name, and a clinical or jurisdictional project sponsor, then build against Ocean's test site",
    surfaces: ["HL7 FHIR eReferral", "FHIR R4", "OAuth 2.0"],
    summary:
      "Ocean is a referral network that connects to EMRs. Its FHIR eReferral API lets an EMR or client management system receive referrals and send back status, demographic updates, and messages. WELL Health, which bought Ocean's maker in December 2021, says Ocean serves over 4,900 clinics and hospitals and handles more than 1.67 million referrals a year (March 2026).",
    verdict:
      "There's a documented route for moving referrals and their status between systems. Getting a referral into the receiving clinic's chart still depends on that clinic's EMR.",
    nextStep:
      "Email Ocean Support with your test domain, company name, and project sponsor, and build on the v0.11.1 API.",
    openAdaptFit: "low",
    openAdaptReason:
      "Use the FHIR API to move referrals. Screen work may still apply after a referral arrives, if staff file it by hand in an EMR without a write route.",
    capabilities: [
      {
        label: "FHIR eReferral API",
        status: "documented",
        detail: "Ocean supports eReC v1.2.0 (Beta), v0.11.1, and v0.10.0, and recommends v0.11.1 for new integrators.",
      },
      {
        label: "Developer setup",
        status: "documented",
        detail: "Ocean publishes the setup steps. They start with an email to Ocean Support that names a clinical or jurisdictional project sponsor.",
      },
      {
        label: "Updates sent back to Ocean",
        status: "documented",
        detail: "An integrated system can send status updates such as accepted, booked, or cancelled, plus demographic updates and referral messages.",
      },
      {
        label: "Filing in the receiving chart",
        status: "site-specific",
        detail: "Depends on the receiving EMR. In Accuro, the referral is imported first, and Ocean can then create a new patient's chart.",
      },
      {
        label: "Ontario standard",
        status: "documented",
        detail: "eHealth Ontario publishes an eReferral and eConsult FHIR implementation guide for trial use.",
      },
    ],
    sources: [
      { label: "HL7 FHIR eReferral setup guide", url: "https://support.cognisantmd.com/hc/en-us/articles/360058125332", kind: "official" },
      OCEAN_NETWORK_INTEGRATIONS,
      {
        label: "Ontario eReferral-eConsult FHIR guide",
        url: "https://ehealthontario.on.ca/en/standards/ontario-ereferral-implementation-guide-fhir-overview",
        kind: "official",
      },
      {
        label: "WELL Health release, March 20, 2026",
        url: "https://news-releases.well.company/news-releases/well-health-supports-ontarios-commitment-to-a-provincewide-primary-care-medical-record-system/",
        kind: "official",
      },
      { label: "OceanMD (WELL Health)", url: "https://well.company/ocean-by-cognisant-md/", kind: "official" },
      OCEAN_ACCURO_WORKFLOWS,
      BC_DRO_INTEGRATIONS,
    ],
    lastReviewed: "2026-10-08",
  },
  {
    slug: "dentrix",
    name: "Dentrix",
    vendor: "Henry Schein One",
    market: "Dental practices",
    status: "partner-gated",
    access: "Authorized vendor program or product-specific API program",
    surfaces: ["API Exchange", "OAuth 2.0", "Dentrix API Program"],
    summary:
      "Henry Schein One offers API Exchange to authorized vendors and maintains product-specific programs for Dentrix and Dentrix Ascend.",
    verdict:
      "The supported route is a vendor partnership, not an anonymous public API. Product version and operation determine availability.",
    nextStep:
      "Choose the applicable Dentrix product, apply to the API program, and validate the exact operation after authorization.",
    openAdaptFit: "strong",
    openAdaptReason:
      "A qualified UI workflow can be relevant when an organization cannot use the vendor program or the approved interface lacks a needed task.",
    capabilities: [
      { label: "Official integration program", status: "documented", detail: "API Exchange and product-specific integration programs are public." },
      { label: "Developer access", status: "partner-gated", detail: "Access is intended for authorized vendors." },
      { label: "Operational write-back", status: "unknown", detail: "Must be verified by product and operation inside the program." },
    ],
    sources: [
      { label: "API Exchange", url: "https://www.henryscheinone.com/dental-solutions/api-exchange/", kind: "official" },
      { label: "Dentrix developer FAQ", url: "https://ddp.dentrix.com/pages/faq", kind: "official" },
      { label: "API Exchange for practices", url: "https://www.henryscheinone.com/dental-solutions/api-exchange/api-exchange-practices/", kind: "official" },
    ],
    lastReviewed: "2026-08-28",
  },
  {
    slug: "tebra",
    name: "Tebra / Kareo",
    vendor: "Tebra",
    market: "Independent practices",
    status: "site-specific",
    access: "Customer key and security permissions; partner terms may apply",
    surfaces: ["SOAP API"],
    summary:
      "Tebra publishes a SOAP API integration guide. Access depends on a customer key, user permissions, and the applicable customer or partner relationship.",
    verdict:
      "A documented API path exists, but operation availability and commercial access should be verified for the exact account.",
    nextStep:
      "Review the SOAP operation, obtain a customer key, configure a least-privilege user, and validate partner terms.",
    openAdaptFit: "conditional",
    openAdaptReason:
      "A UI path is worth evaluating only for an operation the SOAP API cannot practically complete.",
    capabilities: [
      { label: "Public integration guide", status: "documented", detail: "Official help material describes the SOAP API." },
      { label: "Customer authorization", status: "site-specific", detail: "A customer key and security permissions are required." },
      { label: "Operational write-back", status: "site-specific", detail: "Verify the specific SOAP operation and account permissions." },
    ],
    sources: [
      { label: "API integration guide", url: "https://helpme.tebra.com/Tebra_PM/12_API_and_Integration/01_Get_Started_with_Tebra_API_Integration/Tebra_API_Integration_User_Guide", kind: "official" },
      { label: "API and integration", url: "https://helpme.tebra.com/Tebra_PM/12_API_and_Integration", kind: "official" },
      { label: "API terms", url: "https://www.tebra.com/api-terms-of-use", kind: "official" },
    ],
    lastReviewed: "2026-08-28",
  },
];

export const workflows = [
  { slug: "scheduling-writeback", name: "Scheduling write-back", description: "Create, reschedule, cancel, or reconcile appointments." },
  { slug: "patient-demographics", name: "Patient demographics", description: "Create or update identity, contact, and coverage-adjacent fields." },
  { slug: "documents-and-notes", name: "Documents and notes", description: "Attach documents, route notes, and verify chart placement." },
  { slug: "claims-and-charge-capture", name: "Claims and charge capture", description: "Enter or reconcile charges, codes, and claim state." },
  { slug: "referral-intake", name: "Referral intake", description: "Convert inbound referrals into structured records and work items." },
  { slug: "work-queue-status", name: "Work-queue status", description: "Update queues, tasks, dispositions, and follow-up state." },
];

/** Canadian profiles carry a market that starts with "Canadian". */
export function isCanadian(ehr: EhrRecord): boolean {
  return ehr.market.startsWith("Canadian");
}

export const canadianEhrs = ehrs.filter(isCanadian);

/** The most recent review date in the dataset, as YYYY-MM-DD. */
export const latestReview: string = ehrs.reduce(
  (latest, ehr) => (ehr.lastReviewed > latest ? ehr.lastReviewed : latest),
  ehrs[0].lastReviewed,
);

/** Formats a YYYY-MM-DD review date as, for example, "October 8, 2026". */
export function formatReviewDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Searchable text for a record. Adds "Canada" to Canadian profiles, whose market says "Canadian". */
export function searchText(ehr: EhrRecord): string {
  return [
    ehr.name,
    ehr.vendor,
    ehr.market,
    isCanadian(ehr) ? "Canada" : "",
    ehr.summary,
    ehr.access,
    ...ehr.surfaces,
    ...ehr.capabilities.flatMap((capability) => [capability.label, capability.detail]),
  ].join(" ");
}

export function getEhr(slug: string) {
  return ehrs.find((ehr) => ehr.slug === slug);
}

export function getWorkflow(slug: string) {
  return workflows.find((workflow) => workflow.slug === slug);
}
