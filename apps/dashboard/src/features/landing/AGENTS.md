# Landing Page Feature

- Purpose: Primary public landing page for Quirk (`/`).
- Ownership: `src/features/landing/index.tsx`.

## Local Contracts

1. **Design System & Metaphor**
   - Implements the "clean white financial infrastructure platform floating in space" aesthetic.
   - Background: Pure white (`#FFFFFF`) with off-white containers (`#FAFAFA`, `#F7F7F5`).
   - Centerpiece: Topology network SVG diagram showing Application -> Quirk -> Payment Rails.
   - Subtle animated concentric orbital rings (`quirk-orbit-slow`, `quirk-orbit-reverse`).
   - The "Bigger Vision" section is a deliberate deep-dark cosmic focal element (`#080808` background with `#FFFFFF` text) placed against the white page to create depth of scale.

2. **Copy & Tone**
   - Strictly adhere to `unslop` writing rules: active voice, sentence case headings, no em dashes, no corporate puffery, and honest early roadmap presentation.
   - Core headline: "Payment infrastructure, without the complexity."
   - Target audience pills: Marketplaces, Fintechs, Commerce Platforms, SaaS Platforms, Payment-Enabled Tech.

3. **Actions & Interactivity**
   - Primary hero CTA: "Explore the API" (smooth scroll to `#developers`).
   - Secondary hero CTA: "Talk to us" (`mailto:engineering@quirk.dev`).
   - Code snippet tabs: TypeScript, Python, cURL with copy-to-clipboard functionality.

## Verification

```bash
pnpm --filter quirk-dashboard build
```
