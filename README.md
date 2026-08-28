# EHR Integration Directory

An evidence-backed directory of public API paths, FHIR and HL7 capabilities,
partner requirements, sandbox access, documented write operations, and EHR
workflows that still end at the user interface.

Published by [OpenAdapt](https://openadapt.ai). The live directory is available
at [ehrintegrationdirectory.com](https://ehrintegrationdirectory.com).

## What is included

- Searchable profiles for major EHR and practice-management products
- Operation-specific evidence states instead of platform-wide yes/no claims
- Direct links to official vendor documentation
- Workflow guides for scheduling, demographics, documents, claims, referrals,
  and work queues
- A machine-readable JSON endpoint at `/api/directory`
- Sitemap, canonical metadata, robots directives, and Dataset structured data

The directory uses five evidence states: `documented`, `partner-gated`,
`site-specific`, `not-found`, and `unknown`.

`not-found` means that the reviewed public sources did not establish the path.
It does not mean the vendor does not support it.

## Run locally

Requirements: Node.js 22.13 or newer and npm.

```bash
npm ci
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Deployment

The production site is deployed from the `main` branch with Vercel. Pull
requests receive preview deployments, while a successful merge to `main`
updates the production deployment. GitHub Actions runs lint, tests, and a
production build before changes are merged.

The canonical production origin is
[ehrintegrationdirectory.com](https://ehrintegrationdirectory.com).

## Project structure

- `app/` — pages, metadata, sitemap, robots, and JSON API
- `components/` — directory interface and UI primitives
- `lib/ehrs.ts` — source-linked directory records and workflow definitions
- `tests/` — rendered output and component checks

## Contributing evidence

Corrections and new profiles are welcome. A useful evidence contribution names:

1. the exact EHR product and version, when known;
2. the exact operation or state change;
3. the access context, such as public, partner-gated, or customer-approved; and
4. an official source URL that directly supports the claim.

Please do not infer “unsupported” from an absent public document. See
[`CONTRIBUTING.md`](CONTRIBUTING.md) for the review standard.

## Licensing

The application code is available under the [MIT License](LICENSE). The curated
directory dataset in `lib/ehrs.ts` is available under
[CC BY 4.0](DATA_LICENSE.md). Vendor names and linked documentation remain the
property of their respective owners.
