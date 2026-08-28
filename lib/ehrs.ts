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
      { label: "Operational write-back", status: "documented", detail: "The vendor describes a robust write API library; verify the exact operation." },
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
    name: "AccuroEMR",
    vendor: "QHR Technologies",
    market: "Canadian ambulatory care",
    status: "partner-gated",
    access: "Commercial agreement and application review required",
    surfaces: ["REST API"],
    summary:
      "Accuro documents a REST API program, but access begins with a product and use-case review followed by an agreement. Available APIs depend on the application.",
    verdict:
      "There is a documented API route, but it is agreement-gated and application-specific.",
    nextStep:
      "Contact QHR with the product and use case, complete the agreement, and request the operation list for the approved application.",
    openAdaptFit: "conditional",
    openAdaptReason:
      "Consider a qualified UI workflow when the agreement path or approved API set cannot serve the needed operation.",
    capabilities: [
      { label: "REST API program", status: "documented", detail: "Official technical material describes REST API use." },
      { label: "Developer access", status: "partner-gated", detail: "Access requires vendor contact, use-case review, and an agreement." },
      { label: "Operation availability", status: "site-specific", detail: "The available API set depends on the approved application." },
    ],
    sources: [
      { label: "Accuro API", url: "https://accuroemr.com/accuroapi/", kind: "official" },
      { label: "Using the REST API", url: "https://accuroemr.com/accuroapi/technical/using-accuros-rest-api/", kind: "official" },
      { label: "API list", url: "https://accuroemr.com/accuroapi/technical/apis/", kind: "official" },
    ],
    lastReviewed: "2026-08-28",
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

export function getEhr(slug: string) {
  return ehrs.find((ehr) => ehr.slug === slug);
}

export function getWorkflow(slug: string) {
  return workflows.find((workflow) => workflow.slug === slug);
}
