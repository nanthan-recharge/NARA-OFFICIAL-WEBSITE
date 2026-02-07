# Daily Ebook Agent - Documentation

## Overview
The Daily Ebook Agent is an automated service that scans the CORE API for new marine and fisheries research publications, downloads PDFs, and adds them to your library catalogue.

## Features
- ✅ **Rate Limiting**: Implements delays between API requests to avoid hitting rate limits
- ✅ **Exponential Backoff**: Automatically retries failed requests with increasing delays
- ✅ **Error Handling**: Gracefully handles 429 (rate limit) and 500 (server error) responses
- ✅ **Smart Query Management**: Stops further queries if rate limiting persists
- ✅ **Configurable**: Easy-to-adjust settings for queries, delays, and retries

## Recent Improvements (2025-10-22)

### 1. Rate Limiting Protection
- **60-second delay** between queries (prevents rapid-fire requests)
- **Exponential backoff** retry strategy (10s → 20s → 40s)
- **3 retry attempts** with intelligent failure handling

### 2. API Key Warning System
The agent now warns you if no CORE API key is configured:
```
⚠️  WARNING: No CORE API key configured!
⚠️  Rate limits will be very restrictive without an API key.
⚠️  Get a free API key at: https://core.ac.uk/services/api
⚠️  Add CORE_API_KEY to your .env file
```

### 3. Optimized Query Strategy
- Reduced from 5 queries to **2 focused queries**:
  - "marine biodiversity Sri Lanka"
  - "fisheries management Bay of Bengal"
- Reduced result limit from 20 to **10 per query**
- More specific queries yield better-targeted results

### 4. Improved Error Messages
- Clear distinction between rate limit errors (429) and server errors (500)
- Detailed retry attempt logging
- Summary report shows exactly what succeeded and failed

## Setup Instructions

### 1. Get a CORE API Key (Recommended)
Without an API key, CORE's rate limits are extremely restrictive and the agent will fail with 429 errors.

**To get a free API key:**
1. Visit: https://core.ac.uk/services/api
2. Register for a free account
3. Get your API key from the dashboard
4. Add it to your `.env` file:

```bash
# In nara_digital_ocean/.env
CORE_API_KEY=your-actual-api-key-here
```

### 2. Configure the Agent
Edit `backend/scheduledJobs/dailyEbookAgent.js` to adjust settings:

```javascript
const CONFIG = {
  sources: {
    core: {
      queries: [
        'your custom query',
        'another query'
      ],
      limit: 10,                  // Results per query
      requestDelay: 60000,        // Delay between queries (ms)
      maxRetries: 3,              // Max retry attempts
      retryDelay: 10000,          // Initial retry delay (ms)
    }
  }
}
```

### 3. Run the Agent

**Manual run:**
```bash
cd backend
node scheduledJobs/dailyEbookAgent.js
```

**Background run:**
```bash
cd backend
node scheduledJobs/dailyEbookAgent.js 2>&1 &
```

**Scheduled run (daily at 2 AM UTC):**
The agent is configured to run automatically via cron schedule: `0 2 * * *`

## Understanding the Output

### Success Example
```
[INFO] 🤖 Daily Ebook Agent Started
[INFO] 🔍 Scanning CORE API for new publications...
[INFO]    Searching: "marine biodiversity Sri Lanka"
[INFO]    ✓ Found 10 results
[INFO]    ⏳ Waiting 60s before next query...
[INFO]    Searching: "fisheries management Bay of Bengal"
[INFO]    ✓ Found 8 results
[SUCCESS] ✅ Processed: 18 items
```

### Rate Limit Example
```
[WARNING]    ⚠️  Rate limited (429). Retrying in 10s... (Attempt 1/3)
[WARNING]    ⚠️  Rate limited (429). Retrying in 20s... (Attempt 2/3)
[WARNING]    ⚠️  Rate limited (429). Retrying in 40s... (Attempt 3/3)
[ERROR]    ❌ Max retries reached for rate limit
[ERROR]    ❌ Rate limit hit - skipping remaining queries
```

## Troubleshooting

### Issue: All queries fail with 429 errors
**Cause:** No CORE API key configured, or rate limit exceeded
**Solution:**
1. Add CORE_API_KEY to `.env` file
2. Increase `requestDelay` to 120000 (2 minutes)
3. Reduce number of queries

### Issue: Queries fail with 500 errors after retries
**Cause:** CORE API server issues or persistent rate limiting
**Solution:**
1. Wait a few hours and try again
2. Check CORE API status: https://core.ac.uk/status
3. Verify your API key is valid

### Issue: Agent finds 0 results
**Cause:** Queries too specific or no new publications
**Solution:**
1. Broaden your search queries
2. Remove location-specific terms
3. Try different keywords

## Configuration Reference

| Setting | Default | Description |
|---------|---------|-------------|
| `queries` | 2 focused queries | Search terms for CORE API |
| `limit` | 10 | Max results per query |
| `requestDelay` | 60000ms (60s) | Delay between queries |
| `maxRetries` | 3 | Retry attempts for failed requests |
| `retryDelay` | 10000ms (10s) | Initial retry delay (exponential) |
| `timeout` | 30000ms (30s) | Request timeout |

## Best Practices

1. **Always use an API key** - Free tier allows 10,000 requests/month
2. **Start with conservative settings** - Increase gradually if successful
3. **Monitor the logs** - Watch for patterns in failures
4. **Run during off-peak hours** - Scheduled for 2 AM UTC for a reason
5. **Review results periodically** - Ensure quality and relevance

## Future Enhancements

Potential improvements for future versions:
- [ ] Support for multiple data sources (OpenAlex, PubMed, etc.)
- [ ] Duplicate detection using DOI/title matching
- [ ] Auto-categorization using ML/NLP
- [ ] Email notifications with detailed reports
- [ ] Web dashboard for monitoring agent runs
- [ ] Incremental sync (only fetch new publications)

## Support

For issues or questions:
- Check the logs in the console output
- Review CORE API documentation: https://core.ac.uk/documentation/api
- Contact library@nara.ac.lk for assistance

---

**Last Updated:** 2025-10-22
**Version:** 2.0 (Rate Limiting & Retry Logic)
