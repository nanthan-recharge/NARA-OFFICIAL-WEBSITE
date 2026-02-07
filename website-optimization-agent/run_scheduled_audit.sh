#!/bin/bash

################################################################################
# NARA Website Optimization - Scheduled Audit Script
################################################################################
# This script runs automated website audits on a schedule (cron compatible)
#
# Usage:
#   ./run_scheduled_audit.sh [OPTIONS]
#
# Options:
#   --max-pages NUM    Maximum pages to crawl (default: 100)
#   --notify           Send email notification on completion
#   --comprehensive    Run comprehensive optimization workflow
#
# Cron Examples:
#   # Daily at 2 AM
#   0 2 * * * /path/to/run_scheduled_audit.sh --max-pages 50
#
#   # Weekly on Sunday at midnight
#   0 0 * * 0 /path/to/run_scheduled_audit.sh --comprehensive --notify
################################################################################

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_DIR="$PROJECT_ROOT/audit-history/audit_$TIMESTAMP"
LOG_FILE="$PROJECT_ROOT/audit-history/audit_$TIMESTAMP.log"

# Default options
MAX_PAGES=100
NOTIFY=false
COMPREHENSIVE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --max-pages)
      MAX_PAGES="$2"
      shift 2
      ;;
    --notify)
      NOTIFY=true
      shift
      ;;
    --comprehensive)
      COMPREHENSIVE=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Create output directory
mkdir -p "$PROJECT_ROOT/audit-history"
mkdir -p "$OUTPUT_DIR"

# Logging function
log() {
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$LOG_FILE"
}

log "=========================================="
log "NARA Website Optimization - Scheduled Audit"
log "=========================================="
log "Timestamp: $TIMESTAMP"
log "Max Pages: $MAX_PAGES"
log "Comprehensive: $COMPREHENSIVE"
log "Output Directory: $OUTPUT_DIR"
log ""

# Check Python environment
if ! command -v python3 &> /dev/null; then
  log "ERROR: python3 not found"
  exit 1
fi

# Navigate to script directory
cd "$SCRIPT_DIR" || exit 1

# Check dependencies
log "Checking dependencies..."
if ! python3 -c "import bs4, requests, lxml" 2>/dev/null; then
  log "Installing dependencies..."
  pip3 install -r requirements.txt >> "$LOG_FILE" 2>&1
fi

# Run audit
log "Starting website audit..."

if [ "$COMPREHENSIVE" = true ]; then
  log "Running comprehensive optimization workflow..."
  python3 run_complete_optimization.py \
    --max-pages "$MAX_PAGES" \
    --output "$OUTPUT_DIR" \
    >> "$LOG_FILE" 2>&1
  EXIT_CODE=$?
else
  log "Running basic optimization audit..."
  python3 nara_optimizer.py \
    --max-pages "$MAX_PAGES" \
    --output "$OUTPUT_DIR" \
    >> "$LOG_FILE" 2>&1
  EXIT_CODE=$?
fi

if [ $EXIT_CODE -eq 0 ]; then
  log "✅ Audit completed successfully"
else
  log "❌ Audit failed with exit code $EXIT_CODE"
  exit $EXIT_CODE
fi

# Extract metrics from report
log ""
log "Extracting audit metrics..."

if [ -f "$OUTPUT_DIR/optimization_report.json" ]; then
  TOTAL_PAGES=$(jq '.summary.total_pages // 0' "$OUTPUT_DIR/optimization_report.json")
  BROKEN_LINKS=$(jq '.broken_links | length' "$OUTPUT_DIR/optimization_report.json")
  DUPLICATES=$(jq '.duplicate_content | length' "$OUTPUT_DIR/optimization_report.json")
  PLACEHOLDERS=$(jq '.placeholder_text | length' "$OUTPUT_DIR/optimization_report.json")

  log "📊 Audit Results:"
  log "  Total Pages: $TOTAL_PAGES"
  log "  Broken Links: $BROKEN_LINKS"
  log "  Duplicate Content: $DUPLICATES"
  log "  Placeholder Text: $PLACEHOLDERS"

  # Generate quick summary
  cat > "$OUTPUT_DIR/QUICK_SUMMARY.txt" << EOF
NARA Website Audit - Quick Summary
===================================
Date: $(date +"%Y-%m-%d %H:%M:%S")
Max Pages Crawled: $MAX_PAGES
Total Pages Analyzed: $TOTAL_PAGES

Metrics:
--------
Broken Links: $BROKEN_LINKS
Duplicate Content: $DUPLICATES
Placeholder Text: $PLACEHOLDERS

Status:
-------
EOF

  if [ "$BROKEN_LINKS" -eq 0 ] && [ "$DUPLICATES" -eq 0 ]; then
    echo "✅ EXCELLENT - No critical issues found!" >> "$OUTPUT_DIR/QUICK_SUMMARY.txt"
  elif [ "$BROKEN_LINKS" -le 5 ] && [ "$DUPLICATES" -le 3 ]; then
    echo "⚠️ GOOD - Minor issues detected" >> "$OUTPUT_DIR/QUICK_SUMMARY.txt"
  else
    echo "❌ ATTENTION NEEDED - Multiple issues detected" >> "$OUTPUT_DIR/QUICK_SUMMARY.txt"
  fi

  echo "" >> "$OUTPUT_DIR/QUICK_SUMMARY.txt"
  echo "Full reports available at: $OUTPUT_DIR" >> "$OUTPUT_DIR/QUICK_SUMMARY.txt"

  # Display summary
  cat "$OUTPUT_DIR/QUICK_SUMMARY.txt" | tee -a "$LOG_FILE"
else
  log "⚠️ Warning: optimization_report.json not found"
fi

# Send notification if requested
if [ "$NOTIFY" = true ]; then
  log ""
  log "Sending email notification..."

  if command -v mail &> /dev/null; then
    SUBJECT="NARA Website Audit Complete - $TIMESTAMP"
    BODY=$(cat "$OUTPUT_DIR/QUICK_SUMMARY.txt")

    echo "$BODY" | mail -s "$SUBJECT" "${NOTIFICATION_EMAIL:-admin@example.com}"
    log "✅ Notification sent to ${NOTIFICATION_EMAIL:-admin@example.com}"
  else
    log "⚠️ 'mail' command not found - skipping notification"
  fi
fi

# Cleanup old audits (keep last 30 days)
log ""
log "Cleaning up old audit reports..."
find "$PROJECT_ROOT/audit-history" -name "audit_*" -type d -mtime +30 -exec rm -rf {} \; 2>/dev/null
log "Cleanup complete"

log ""
log "=========================================="
log "Audit workflow complete!"
log "Results saved to: $OUTPUT_DIR"
log "Log file: $LOG_FILE"
log "=========================================="

exit 0
