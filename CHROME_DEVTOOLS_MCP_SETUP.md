# Chrome DevTools MCP Setup Guide

## Overview

Chrome DevTools MCP is now available for use with your NARA project. This guide shows you how to configure and use it for browser automation, testing, and debugging.

## Current Status

✅ **Repository cloned**: `/Users/nanthan/Desktop/nara digital/nara_digital_ocean/chrome-devtools-mcp/`  
✅ **Dependencies installed**: 181 packages installed successfully  
✅ **Node.js version**: v22.17.0 (compatible)  

## Quick Start - Recommended Method

The easiest way to use Chrome DevTools MCP is via **npx** (no build required):

```bash
npx -y chrome-devtools-mcp@latest
```

This will:
- Always use the latest published version
- Automatically handle dependencies
- No local build needed

## Using with MCP Clients

### GitHub Copilot CLI Configuration

Since you're using Copilot CLI, add Chrome DevTools MCP as a server:

```bash
# Start Copilot CLI
copilot

# Then in the Copilot CLI, run:
/mcp add
```

Configure these fields:
- **Server name**: `chrome-devtools`
- **Server Type**: `[1] Local`
- **Command**: `npx`
- **Arguments**: `-y, chrome-devtools-mcp@latest`

Press `CTRL+S` to save.

### Alternative: Manual MCP Configuration

If Copilot CLI uses a config file, add this JSON configuration:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

## Usage Options

### Option 1: Launch Chrome Automatically (Default)

```bash
npx -y chrome-devtools-mcp@latest
```

This will:
- Launch Chrome automatically
- Use default user profile at: `~/.cache/chrome-devtools-mcp/chrome-profile-stable`
- Run in headed mode (you see the browser window)

### Option 2: Headless Mode

For automated testing without UI:

```bash
npx -y chrome-devtools-mcp@latest --headless
```

### Option 3: Isolated Profile (Recommended for Testing)

Creates a temporary profile that's cleaned up automatically:

```bash
npx -y chrome-devtools-mcp@latest --isolated
```

### Option 4: Connect to Running Chrome

If you want to use your existing Chrome profile or browse manually:

**Step 1: Start Chrome with remote debugging**

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-profile-temp

# Linux
/usr/bin/google-chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-profile-temp

# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --remote-debugging-port=9222 ^
  --user-data-dir="%TEMP%\chrome-profile-temp"
```

**Step 2: Configure MCP to connect**

```bash
npx -y chrome-devtools-mcp@latest --browser-url=http://127.0.0.1:9222
```

## Common Configuration Options

### Set Custom Viewport Size

```bash
npx -y chrome-devtools-mcp@latest --viewport=1920x1080
```

### Use Chrome Canary

```bash
npx -y chrome-devtools-mcp@latest --channel=canary
```

### Enable Debug Logging

```bash
DEBUG=* npx -y chrome-devtools-mcp@latest --logFile=./chrome-mcp-debug.log
```

### Use Proxy Server

```bash
npx -y chrome-devtools-mcp@latest --proxyServer="http://proxy.example.com:8080"
```

### Accept Insecure Certificates (Development Only)

```bash
npx -y chrome-devtools-mcp@latest --acceptInsecureCerts
```

## Available Tools (39 total)

Once configured, you can ask Copilot to use these capabilities:

### Navigation & Page Management
- Create new pages/tabs
- Navigate to URLs
- Go back/forward in history
- Switch between pages
- Close pages
- Wait for elements/navigation

### Form Interaction
- Click elements (single/double)
- Fill form fields
- Fill multiple fields at once
- Upload files
- Drag and drop
- Hover over elements
- Handle dialogs (alerts/confirms)

### Debugging & Inspection
- Take screenshots (full page or element)
- Get DOM/accessibility tree snapshots
- View console logs and errors
- Execute JavaScript in page context
- List and inspect network requests

### Performance Testing
- Start/stop performance traces
- Analyze performance insights
- Get Core Web Vitals

### Emulation
- Throttle CPU performance
- Simulate network conditions (3G, 4G, etc.)
- Resize viewport

## Example Prompts for Copilot

Once configured, try these prompts:

```
Check the performance of https://naradevice.lk
```

```
Take a screenshot of https://naradevice.lk and test the mobile menu
```

```
Navigate to https://naradevice.lk/library and fill out the search form
```

```
Test https://naradevice.lk with slow 3G connection and report performance
```

```
Get all console errors from https://naradevice.lk
```

```
Take a full page screenshot of the admin panel at https://naradevice.lk/admin
```

## Use Cases for NARA Project

### 1. Automated UI Testing

Test multilingual content, forms, and navigation:

```
Navigate to https://naradevice.lk
Take a snapshot
Click on the language switcher (Tamil)
Verify the translation loaded correctly
Take a screenshot
```

### 2. Performance Monitoring

Track performance across divisions pages:

```
Start performance trace
Navigate to https://naradevice.lk/divisions/technology
Stop trace and analyze
Report Core Web Vitals
```

### 3. Visual Regression Testing

Capture screenshots for comparison:

```
Take a full page screenshot of the library system
Save to ./screenshots/library-baseline.png
```

### 4. Form Testing

Test maritime services or contact forms:

```
Navigate to the contact form
Fill form with test data
Submit and check for errors in console
```

### 5. Accessibility Auditing

Check accessibility tree structure:

```
Navigate to the media gallery
Take a snapshot with verbose output
Check for ARIA labels and roles
```

### 6. Network Debugging

Test API integrations:

```
Navigate to https://naradevice.lk
List all network requests
Get details of the Firebase API request
```

### 7. Responsive Testing

Test mobile layouts:

```
Resize page to 375x812 (iPhone X)
Navigate to the divisions page
Take a screenshot
```

## Security Warnings

⚠️ **Important Security Considerations:**

1. **Browser Content Exposure**: The MCP server exposes all browser content to AI assistants. Avoid browsing sensitive sites while connected.

2. **Remote Debugging Port**: When using `--browser-url`, you're opening a debugging port. Any local application can connect. Use with caution.

3. **Certificate Validation**: Never use `--acceptInsecureCerts` in production or with sensitive data.

4. **User Data**: When not using `--isolated`, the browser uses a persistent profile at `~/.cache/chrome-devtools-mcp/`. Be aware of stored cookies/data.

## Troubleshooting

### Issue: "tsc: command not found"

You don't need to build locally. Use npx instead:
```bash
npx -y chrome-devtools-mcp@latest
```

### Issue: Chrome won't launch

Try with specific Chrome path:
```bash
npx -y chrome-devtools-mcp@latest --executablePath="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

### Issue: Permission denied (macOS)

Chrome needs sandbox permissions. Either:
1. Grant permissions in System Preferences
2. Use `--browser-url` to connect to manually launched Chrome

### Issue: Port already in use

If using `--browser-url`, ensure no other Chrome instance is using port 9222:
```bash
lsof -ti:9222 | xargs kill -9  # Kill processes on port 9222
```

### Issue: Slow performance

Use headless mode and isolated profile:
```bash
npx -y chrome-devtools-mcp@latest --headless --isolated
```

### Enable Debug Logging

For detailed logs when reporting issues:
```bash
DEBUG=* npx -y chrome-devtools-mcp@latest --logFile=./debug.log 2>&1
```

## Building from Local Clone (Advanced)

If you want to modify the source in `chrome-devtools-mcp/`:

```bash
cd "/Users/nanthan/Desktop/nara digital/nara_digital_ocean/chrome-devtools-mcp"

# Install TypeScript locally
npm install typescript --save-dev

# Build
npm run build

# Run
node build/src/index.js
```

However, this is not recommended for normal use. Just use `npx` instead.

## Integration with CI/CD

For automated testing in your deployment pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run Chrome DevTools Tests
  run: |
    npx -y chrome-devtools-mcp@latest --headless --isolated &
    # Your test commands here
```

## Resources

- **Overview Document**: `chrome-devtools-mcp/CHROME_DEVTOOLS_MCP_OVERVIEW.md`
- **Official Docs**: https://github.com/ChromeDevTools/chrome-devtools-mcp
- **Tool Reference**: `chrome-devtools-mcp/docs/tool-reference.md`
- **Troubleshooting**: `chrome-devtools-mcp/docs/troubleshooting.md`

## Next Steps

1. ✅ Configure Chrome DevTools MCP in Copilot CLI using `/mcp add`
2. ✅ Test with a simple prompt: `Take a screenshot of https://naradevice.lk`
3. ✅ Explore automated testing for NARA features
4. ✅ Set up performance monitoring workflows
5. ✅ Integrate into CI/CD pipeline

## Summary

Chrome DevTools MCP is ready to use via `npx -y chrome-devtools-mcp@latest`. No local build required. Simply configure it in your MCP client (Copilot CLI) and start using browser automation, testing, and debugging capabilities with AI assistance.

For NARA-specific use cases, this tool can help with automated UI testing, performance monitoring, accessibility audits, and visual regression testing across your multilingual platform.
