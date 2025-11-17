# AI Guard Verification Checklist

Use this guide to verify your AI Guard setup and debug any issues.

## Pre-Setup Verification

### System Requirements

```bash
# Check Node.js version (should be v18+)
node --version

# Check npm version (should be v9+)
npm --version

# Verify Git is installed
git --version
```

**Expected output:**
```
v18.15.0  (or higher)
9.6.0     (or higher)
git version 2.40.0
```

### Chrome/Chromium Browser

- [ ] Chrome installed (or Brave, Edge, Opera)
- [ ] Chrome version 90+ (check: chrome://version/)
- [ ] Developer mode available

## Post-Installation Verification

### Step 1: Dependencies Installed

```bash
# Check node_modules exists
ls node_modules | head -5

# Verify key dependencies
cat package.json | grep -A5 '"dependencies"'
```

**Expected output:**
```
preact          v10.19.3+
@crxjs/vite-plugin  v2.0.0+
```

### Step 2: Build Verification

```bash
# Check if dist folder exists and has files
ls -la dist/

# Should contain:
# - manifest.json
# - content.js (or content.ts)
# - popup.html (or similar)
# - styles/
```

**Critical files in dist/:**
```
manifest.json           (required - Extension manifest)
content.js              (required - Content script)
popup.html              (required - Extension popup)
styles/                 (required - CSS files)
```

### Step 3: TypeScript Compilation

```bash
# Run type checking
npm run type-check
```

**Expected output:**
```
Successfully compiled X files with TypeScript 5.3.3
```

**If errors appear:**
```bash
# View detailed errors
npm run type-check 2>&1 | head -20

# Fix common issues
npm run lint:fix
```

### Step 4: Linting Check

```bash
# Check for code issues
npm run lint
```

**Expected:** No critical errors (warnings are okay)

## Chrome Extension Installation Verification

### Step 1: Extension Loaded

1. Open `chrome://extensions/`
2. Look for "AI Guard" in the list
3. Verify it shows:
   - [ ] Extension name: "AI Guard"
   - [ ] Version: "0.1.0"
   - [ ] Status: "Enabled" (toggle is blue)
   - [ ] ID: (should display a hash)

### Step 2: Extension Files

Click "Details" on AI Guard extension:
- [ ] Extension homepage shows GitHub repo
- [ ] Permissions listed correctly:
  - `activeTab`
  - `storage`
- [ ] Host permissions show:
  - `https://chat.openai.com/*`
  - `https://claude.ai/*`
  - `https://gemini.google.com/*`

### Step 3: Inspect Extension

1. On `chrome://extensions/`, find AI Guard
2. Click "Service Worker" link
3. DevTools should open
4. Go to **Console** tab
5. Look for initialization messages

**Expected console output:**
```
[AI Guard] Extension initialized
[AI Guard] Content scripts registered
[AI Guard] Manifest V3 loaded successfully
```

**If no messages:**
- [ ] Check if Service Worker crashed (red indicator)
- [ ] Reload extension from chrome://extensions
- [ ] Rebuild: `npm run build`

## Runtime Verification

### Step 1: Navigate to AI Platform

1. Open [ChatGPT](https://chat.openai.com)
2. Open Developer Console: `F12` or `Cmd+Option+I`
3. Go to **Console** tab
4. Refresh page: `F5` or `Cmd+R`

### Step 2: Check Content Script Injection

**Look for messages like:**
```
[AI Guard] Content script loaded
[AI Guard] Brain tracker initialized
[AI Guard] Dashboard mounted on ChatGPT
```

**If NOT present:**
- [ ] Check page is https://chat.openai.com (not subdomain)
- [ ] Verify manifest permissions
- [ ] Hard refresh: `Cmd+Shift+R` or `Ctrl+Shift+R`
- [ ] Rebuild and reload extension

### Step 3: Locate Dashboard

1. Look for the **🧠 brain icon** in top-right corner
2. Click it to expand dashboard
3. Verify dashboard shows sections:
   - [ ] Memory Metrics
   - [ ] Context Analysis
   - [ ] Reasoning Quality
   - [ ] Attention
   - [ ] Emotional State
   - [ ] Collapsible icon (▶/▼)

### Step 4: Dashboard Functionality

1. Type a message to the AI
2. Send it (press Enter)
3. Watch the dashboard update
4. Verify:
   - [ ] Memory pressure changes
   - [ ] Context drift updates
   - [ ] Confidence score appears
   - [ ] Dashboard updates ~500ms after AI responds

**If dashboard doesn't update:**
- [ ] Check console for errors
- [ ] Verify CSS is loaded (Styles tab in DevTools)
- [ ] Try hard refresh

## Build Process Verification

### Development Build

```bash
# Start watch mode
npm run dev
```

**Expected output:**
```
VITE v5.0.10  ready in 234 ms
➜  Local:   http://localhost:5173/
➜  press h to show help
```

**Watch for file changes:**
```bash
# While npm run dev is running, edit a file
# You should see:
# ✓ [plugin:crxjs:build] Content script rebuilt
# ✓ [plugin:crxjs:build] Service worker rebuilt
```

### Production Build

```bash
# Build once
npm run build

# Verify output
ls -lh dist/ | grep -E "\.(js|json|html|css)$"
```

**Expected file sizes:**
```
manifest.json    ~1-2 KB
content.js       ~20-50 KB (minified)
popup.html       ~1 KB
brain-dashboard.css  ~5-10 KB
```

## Network & API Verification

### Content Security Policy

1. Open ChatGPT
2. In DevTools, go to **Network** tab
3. Look for CSP violations (red `content.js` entry)
4. If present:
   - [ ] May block extension
   - [ ] Check manifest CSP rules
   - [ ] See SECURITY.md for CSP bypass strategies

### Network Traffic

**The extension should NOT make external API calls** (for privacy)

1. DevTools → Network tab
2. Filter for XHR/Fetch requests
3. Verify:
   - [ ] No requests to external APIs
   - [ ] Only local page communication
   - [ ] No data leakage

## Debug Mode

### Enable Detailed Logging

1. Edit `src/brain-tracker.ts`
2. Add at top:
   ```typescript
   const DEBUG_MODE = true;
   ```
3. Rebuild: `npm run build`
4. Reload extension
5. Check console for detailed messages

### Inspect DOM Changes

1. DevTools → **Elements** tab
2. Search for: `#ai-guard-brain-dashboard`
3. Should find the dashboard div
4. Inspect its child elements for metrics

### Check Memory Usage

1. DevTools → **Memory** tab
2. Take a heap snapshot
3. Search for "AIGuard" objects
4. Verify reasonable memory usage (<10 MB)

## Performance Verification

### Dashboard Update Frequency

```bash
# Expected: Dashboard updates every 500ms
# Monitor in DevTools → Performance tab
# Record 5 seconds → Check timeline
```

**Should see:**
- Consistent 500ms update intervals
- No performance jank
- CPU usage < 5% at rest

### Bundle Size Check

```bash
# After build, check:
npm run build  # Generates stats.html

# Open stats.html in browser
# Review bundle breakdown
```

**Typical sizes:**
- Total bundle: 50-80 KB (minified)
- Preact: ~3 KB
- Custom code: ~30-40 KB

## Common Issues & Fixes

### Issue: "Extension not loading"

**Checklist:**
```bash
# 1. Verify dist exists
ls dist/ | wc -l  # Should be > 0

# 2. Verify manifest
cat dist/manifest.json | head -5

# 3. Rebuild if needed
npm run build
```

### Issue: "Dashboard not showing"

**Checklist:**
```bash
# 1. Hard refresh page
# Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)

# 2. Check console
# F12 → Console tab → Look for errors

# 3. Reload extension
# chrome://extensions → Find AI Guard → Click refresh

# 4. Verify URL
# Must be on https://chat.openai.com (not other domain)
```

### Issue: "Console shows errors"

**Action plan:**
```bash
# 1. Check TypeScript
npm run type-check

# 2. Check syntax
npm run lint

# 3. Auto-fix issues
npm run lint:fix

# 4. Rebuild and reload
npm run build
# Then reload extension from chrome://extensions
```

## Final Verification Checklist

- [ ] Node.js v18+ installed
- [ ] npm v9+ installed
- [ ] Repository cloned
- [ ] `npm install` completed without errors
- [ ] `npm run build` completes successfully
- [ ] `dist/` folder contains manifest.json
- [ ] Extension loaded in `chrome://extensions/`
- [ ] Extension shows as "Enabled"
- [ ] No errors in Service Worker console
- [ ] Can navigate to ChatGPT without 403/404
- [ ] Brain icon (🧠) visible on ChatGPT
- [ ] Dashboard expands when clicked
- [ ] Dashboard updates when sending messages
- [ ] No console errors in ChatGPT tab
- [ ] All metrics display (Memory, Context, Reasoning, Attention, Emotion)

## Next Steps

If everything passes:
1. Read [IMPLEMENTATION.md](IMPLEMENTATION.md) to understand architecture
2. Start making modifications in `src/`
3. Use `npm run dev` for active development
4. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines

If verification fails:
1. Check [SETUP.md](SETUP.md#troubleshooting) for solutions
2. Review error messages in console
3. Try complete rebuild: `rm -rf dist node_modules && npm install && npm run build`

