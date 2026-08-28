# Contributing

Thank you for helping make the EHR Integration Directory more accurate.

## Evidence standard

Prefer primary sources in this order:

1. official vendor API or developer documentation;
2. official vendor program, onboarding, or product documentation;
3. government certification records and published endpoint registries; and
4. a clearly labeled secondary source only when no primary source documents
   the access path.

Every proposed capability change should identify the product, operation,
integration surface, access requirement, and source URL. Scope the claim to
what the source establishes.

## Status vocabulary

- `documented`: an official public source describes the relevant path.
- `partner-gated`: access requires a marketplace, partner, licensing, or
  authorized-vendor program.
- `site-specific`: availability depends materially on customer approval,
  product edition, tenant configuration, or the exact operation.
- `not-found`: the reviewed public sources did not establish the path. This is
  not proof that it is unsupported.
- `unknown`: the available evidence is insufficient for a narrower claim.

## Pull requests

Keep each pull request focused on one vendor or one workflow when practical.
Include the review date and explain what the new source changes. Do not include
patient data, customer-confidential documentation, credentials, or screenshots
from authenticated vendor portals.
