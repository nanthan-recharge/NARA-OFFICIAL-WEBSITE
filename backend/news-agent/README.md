# NARA News Agent

Automated backend agent that ingests Sri Lankan marine and fisheries news, classifies content into the NARA newsroom categories, generates Sinhala/Tamil summaries via Gemini, and syncs results into the `newsArticles` Firestore collection powering the NARA Digital Ocean media pages.

## Features

- ✅ RSS-based ingestion from curated Sri Lankan news sources (Daily News, News.lk, FT.lk, Ada Derana, Sunday Observer)
- ✅ Keyword and domain filtering to keep coverage aligned with NARA's mandate
- ✅ Deduplication using SHA-256 content hashing
- ✅ Vertex Gemini integration for multi-language summaries, translations, key points, and category suggestions
- ✅ Heuristic fallback classifier to guarantee category coverage
- ✅ Batch persistence to Firestore with ingestion metadata for auditability
- ✅ Cron-friendly CLI (`npm run scrape`) plus long-running scheduler (`npm run schedule`)

## Prerequisites

- Node.js 18+
- Access to Google Cloud project with Vertex AI enabled and Gemini model deployed
- Firebase Admin SDK service account with write access to the target Firestore project

## Setup

1. **Install dependencies**
   ```bash
   cd backend/news-agent
   npm install
   ```

2. **Copy the example environment file**
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with project credentials**
   - `GCP_PROJECT_ID` / `GCP_LOCATION`: Vertex AI project and region (e.g. `asia-southeast1`)
   - `FIREBASE_SERVICE_ACCOUNT`: path to Admin SDK JSON or inline JSON string
   - `SCRAPER_ALLOWED_SOURCES`: comma-separated domain allow list
   - `TRANSLATION_LANGUAGES`: typically `si,ta`
   - Adjust `SCRAPER_SRI_LANKA_KEYWORDS` if you want a stricter or broader filter

4. **Provide Vertex / Firebase credentials**
   - Ensure the machine has application-default credentials for Vertex AI (e.g. `gcloud auth application-default login`) or set `GOOGLE_APPLICATION_CREDENTIALS` to a service account JSON file with Vertex permissions.
   - Verify the Firebase service account has `datastore.user` / `datastore.owner` or equivalent roles to write to Firestore.

5. **Dry-run ingestion**
   ```bash
   npm run scrape
   ```
   This performs a one-off fetch, enrichment, and Firestore write. Inspect logs for filtered or rejected articles.

6. **Schedule daily updates**
   ```bash
   npm run schedule
   ```
   Keeps the process alive and executes at the cron specified via `CRON_EXPRESSION` (defaults to `0 3 * * *`, i.e. 3 AM daily).

## Firestore Schema

The agent writes documents compatible with the existing `useNewsArticles` hook:
- `title`, `summary`, `content`
- `category` (matches front-end colour map)
- `publishedAt` (Firestore timestamp)
- `translations.{si,ta}` objects with `title`, `summary`, `content`, `category`
- `key_points`, `autoSummary`, `tags`
- `ingestionMetadata` with timestamps, classifier info, and Gemini model reference

## Customising Sources

Edit `src/config/sources.js` to adjust or extend the curated source list. Each entry supports:
- `topicFilters`: keywords enforced in addition to global Sri Lankan marine keywords
- `tags`: default tags applied to articles from that feed
- `language`: used for translation prompts and analytics

## Troubleshooting

- **No articles saved**: check logs for "Article skipped" messages—update keywords or allow-list settings.
- **Gemini failures**: ensure Vertex AI credentials are in place. The agent retries twice before falling back to heuristic classification.
- **Firestore permission errors**: confirm the service account has write access and the Firestore collection exists or allow creation.

## Next Steps

- Add HTML scrapers for pages without RSS feeds (extend `sourceService` to support selector-based extraction).
- Persist raw Gemini responses for audit in a separate collection if compliance requires it.
- Feed agent metrics into `StatsDashboard` by writing aggregated counters to Firestore or BigQuery.
