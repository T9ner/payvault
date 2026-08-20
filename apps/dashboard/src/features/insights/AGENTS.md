# Insights Feature

- Purpose: Architecture research articles, technical deep dives, and distributed systems engineering write-ups.
- Ownership: `src/features/insights/insights-data.ts`, `src/features/insights/insight-detail.tsx`, and `src/routes/insights/index.tsx`.

## Local Contracts

1. **Content Schema**
   - Articles are defined in `insights-data.ts` conforming to the `InsightArticle` interface:
     - `slug`: Unique URL parameter (`/insights/$slug`).
     - `tag`: Category label (Engineering, Treasury, Security).
     - `date`: Publication month/year.
     - `title`: Sentence case technical headline.
     - `excerpt`: Concise 1-2 sentence overview.
     - `author` & `authorRole`: Attributed engineering group.
     - `readTime`: Estimated reading duration.
     - `content`: Array of paragraphs written according to unslop rules.
     - `codeSnippet`: Optional relevant code example.

2. **Styling & Layout**
   - Clean editorial white layout with black Quirk logo (`lightMode={true}`).
   - Monochromatic code blocks with copy action.
   - Related articles grid at the bottom of each article.

## Verification

```bash
pnpm --filter quirk-dashboard build
```
