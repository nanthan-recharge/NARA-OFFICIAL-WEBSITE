# NARA Digital Library - Backend Services

## 🚀 Overview

This backend service handles automated ebook processing, scheduled uploads, and library management tasks.

## 📦 Features

### 1. Daily Ebook Agent
- **Schedule**: Runs daily at 2:00 AM UTC (7:30 AM Sri Lanka Time)
- **Functions**:
  - Scans CORE API for new publications
  - Downloads and processes PDFs
  - Auto-categorizes books
  - Uploads to Firebase Storage
  - Updates library catalogue
  - Sends email notifications

### 2. Manual Operations
- Manually trigger agent runs
- Process upload queue
- Bulk categorization
- Metadata extraction

## 🛠️ Setup

### Prerequisites
- Node.js 16+ installed
- Firebase Admin SDK credentials
- CORE API key (optional)

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env with your credentials
nano .env
```

### Configuration

Edit `.env` file with your credentials:

```env
CORE_API_KEY=your_core_api_key_here
FIREBASE_PROJECT_ID=nara-web-73384
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@nara-web-73384.iam.gserviceaccount.com
```

## 🎯 Usage

### Start Scheduler (Production)

```bash
# Start the scheduler daemon
npm run agent:start

# The agent will now run daily at 2:00 AM UTC
```

### Manual Run (Testing)

```bash
# Run agent immediately (for testing)
npm run agent:manual

# View the logs in console
```

### Test Agent (No Upload)

```bash
# Test agent without uploading to Firebase
npm run agent:test
```

## 📊 Agent Operations

### 1. Scan CORE API
```javascript
Queries:
- "marine biodiversity"
- "fisheries management"
- "ocean conservation"
- "aquatic resources"
- "coastal ecosystem"

Limit: 20 results per query
```

### 2. Auto-Categorization Rules

| Keywords | Category |
|----------|----------|
| thesis, dissertation | THESIS |
| BOBP, bay of bengal | BOBP |
| map, cartography | MAP |
| journal, article | JR |
| report, research paper | RPAPER |
| Default | RBOOK |

### 3. Upload Queue

Location: `/backend/queue/upload_queue.json`

Format:
```json
[
  {
    "title": "Book Title",
    "author": "Author Name",
    "category": "RBOOK",
    "pdfUrl": "/path/to/file.pdf",
    "status": "pending",
    "addedAt": "2025-10-17T10:30:00Z"
  }
]
```

## 📈 Monitoring

### Logs

Logs are saved in console output. In production, pipe to log file:

```bash
npm run agent:start > logs/agent.log 2>&1 &
```

### Notifications

Email notifications are sent on:
- ✅ Successful run (if enabled)
- ❌ Error/failure
- 📊 Daily summary report

## 🔧 Advanced Configuration

### Custom Schedule

Edit `scheduledJobs/dailyEbookAgent.js`:

```javascript
const CONFIG = {
  schedule: '0 2 * * *', // Cron expression
  // ...
};
```

### Add New Sources

Add custom sources in configuration:

```javascript
sources: {
  custom_api: {
    enabled: true,
    apiUrl: 'https://api.example.com',
    apiKey: process.env.CUSTOM_API_KEY
  }
}
```

## 🐛 Troubleshooting

### Agent Not Running

```bash
# Check if process is running
ps aux | grep "node.*scheduler"

# Check logs
tail -f logs/agent.log
```

### Failed Downloads

- Check internet connection
- Verify CORE API key is valid
- Check PDF URL accessibility

### Upload Failures

- Verify Firebase credentials
- Check Storage rules allow write
- Ensure sufficient storage quota

## 📝 Maintenance

### Daily Tasks
- ✅ Check agent logs for errors
- ✅ Monitor upload queue size
- ✅ Review categorization accuracy

### Weekly Tasks
- ✅ Backup upload queue
- ✅ Clean up temp files
- ✅ Review notification emails

### Monthly Tasks
- ✅ Update CORE API queries
- ✅ Tune categorization rules
- ✅ Review storage usage

## 🚦 Production Deployment

### Using PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start scheduledJobs/scheduler.js --name nara-library-agent

# Auto-start on reboot
pm2 startup
pm2 save

# Monitor
pm2 monit
```

### Using systemd (Linux)

Create `/etc/systemd/system/nara-library-agent.service`:

```ini
[Unit]
Description=NARA Library Daily Ebook Agent
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/nara_digital_ocean/backend
ExecStart=/usr/bin/node scheduledJobs/scheduler.js
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable nara-library-agent
sudo systemctl start nara-library-agent
sudo systemctl status nara-library-agent
```

## 📞 Support

For issues or questions:
- Email: library@nara.ac.lk
- GitHub: [NARA Digital Library Issues](https://github.com/nara/digital-library/issues)

---

**Last Updated**: October 17, 2025
**Version**: 1.0.0
