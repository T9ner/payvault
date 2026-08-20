# Legal Feature

- Purpose: Legal and compliance pages, including Privacy Policy and Terms of Service.
- Ownership: `src/features/legal/legal-layout.tsx`, `src/features/legal/privacy-policy.tsx`, and `src/features/legal/terms-of-service.tsx`.

## Local Contracts

1. **Layout Requirements**
   - Wrapped in `LegalLayout` with sticky top header containing black Quirk logo and "Back to Home" navigation.
   - Clean white background (`#FFFFFF`) with neutral typography (`#080808` headings, `#444444` body text).
   - Contact email addresses must reference `dbosshonour@gmail.com`.

2. **Writing Tone**
   - Unslop standard: sentence case section headings, clear definitions of data handling and hardware encryption, and zero legal filler words.

## Verification

```bash
pnpm --filter quirk-dashboard build
```
