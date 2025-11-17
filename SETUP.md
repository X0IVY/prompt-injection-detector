# AI Guard - Local Development Setup

Complete guide to get AI Guard running on your machine for development and testing.

## Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher, comes with Node.js)
- **Chrome/Chromium-based browser** (Edge, Brave, Opera also supported)
- **Git**

Verify installations:
```bash
node --version    # Should be v18+
npm --version     # Should be v9+
```

## Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/X0IVY/ai-guard.git
cd ai-guard

# Install dependencies
npm install
```

**What this does:**
- Clones the repo to your machine
- Installs Preact, TypeScript, Vite, and all dev tools
- Sets up the build pipeline

## Step 2: Development Build

### Option A: Watch Mode (Recommended for Development)

```bash
npm run dev
```

This starts Vite in watch mode:
- Watches for file changes
- Hot-reloads TypeScript and styles
- Outputs to `dist/` folder in real-time
- Keeps a dev server running locally

**Output:**
```
VITE v5.0.10  ready in XXX ms

➜  Local:   http://localhost:5173/
```

The `dist/` folder will be auto-updated as you make changes.

### Option B: One-Time Build

```bash
npm run build
```

This creates an optimized production build:
- Runs TypeScript type checking
- Bundles and minifies code
- Creates `dist/` folder ready for the extension

## Step 3: Load Extension into Chrome

### Method 1: Chrome DevTools (Easiest)

1. Open Chrome and go to **`chrome://extensions/`**
2. Enable **"Developer mode"** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select the **`dist/`** folder from your ai-guard directory
5. The extension will appear in your extensions list

### Method 2: Copy & Reload

If you modify code and want to refresh:

1. After running `npm run build`, go to `chrome://extensions/`
2. Click the **refresh icon** on the AI Guard extension
3. Visit ChatGPT/Claude - you'll see updates immediately

### For Live Development

1. Keep `npm run dev` running in one terminal
2. Load the extension from the auto-updating `dist/` folder
3. Edit code in your editor
4. Refresh the extension in Chrome when you make changes
5. The extension will use the updated code

## Step 4: Test the Extension

### Quick Test

1. Navigate to [ChatGPT](https://chat.openai.com), [Claude](https://claude.ai), or [Gemini](https://gemini.google.com)
2. Open Chrome DevTools: `F12` or `Cmd+Option+I` (Mac)
3. Go to the **Console** tab
4. You should see AI Guard initialization messages:
   ```
   [AI Guard] Initialized on ChatGPT
   [AI Guard] Monitoring conversation...
   ```
5. Look for the **🧠 brain icon** in the top-right corner of the chat interface
6. Click it to expand the dashboard

### Verify Dashboard

The dashboard should show:
- **Memory Metrics**: memory pressure, forgotten items, active memory
- **Context Analysis**: context drift, active topics, lost references
- **Reasoning Quality**: confidence score, hallucination flags, self-corrections
- **Attention**: focus score, distractions, focus areas
- **Emotional State**: tone, tone shifts, stress indicators

### Console Debugging

Check the extension's console for debugging:

1. Right-click the AI Guard icon → **"Inspect"**
2. Or go to `chrome://extensions/` → AI Guard → **"Service worker"**
3. Look for debug messages and errors

## Step 5: Development Workflow

### Making Changes

**TypeScript Files** (`src/`)
```bash
# Edit any .ts or .tsx file
# npm run dev watches for changes automatically
# Refresh extension in chrome://extensions to load updated code
```

**Styles** (`styles/`)
```bash
# Edit .css files
# Changes appear after extension reload
```

**Manifest** (`manifest.json`)
```bash
# After editing manifest.json, rebuild:
npm run build
# Then reload extension from chrome://extensions
```

### Commands Reference

```bash
# Start development server (watch mode)
npm run dev

# Build for production
npm run build

# Preview build output locally
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format
npm run format:check
```

## Troubleshooting

### Extension Not Loading

**Problem:** `dist/` folder missing
```bash
# Solution: Run build first
npm run build
```

**Problem:** "Cannot find manifest.json"
```bash
# Solution: Check that dist/ contains manifest.json
ls dist/manifest.json
```

### Changes Not Showing Up

**Problem:** Extension cached old code
```bash
# Solution: Hard refresh the extension
1. Go to chrome://extensions
2. Click the refresh button on AI Guard
3. Go back to ChatGPT and refresh page (Cmd+Shift+R or Ctrl+Shift+R)
```

**Problem:** TypeScript errors
```bash
# Check for errors:
npm run type-check

# Errors? Fix them in src/ files, then rebuild
npm run build
```

### Dashboard Not Appearing

**Problem:** Brain icon not visible on ChatGPT
```bash
# Check:
1. Extension is enabled in chrome://extensions
2. You're on https://chat.openai.com (not other domain)
3. Open DevTools console (F12) and look for errors
4. Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
```

**Problem:** Console shows "Content script failed to load"
```bash
# Solution:
1. Run: npm run build
2. Reload extension from chrome://extensions
3. Refresh ChatGPT page
```

### Build Errors

**Problem:** `npm install` fails
```bash
# Try clearing cache and reinstalling:
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problem:** TypeScript compilation errors
```bash
# Check syntax:
npm run type-check

# Fix ESLint issues:
npm run lint:fix
```

## File Structure Reference

```
ai-guard/
├── src/
│   ├── brain-tracker.ts          # Core tracking logic
│   ├── brain-dashboard.tsx       # Dashboard UI component
│   ├── content.ts                # Content script entry point
│   ├── patterns.json             # Detection patterns
│   └── popup/
│       └── index.html            # Popup HTML
├── styles/
│   ├── brain-dashboard.css       # Dashboard styles
│   └── content.css               # Content script styles
├── dist/                          # Build output (auto-generated)
│   ├── manifest.json
│   ├── content.js
│   ├── popup.html
│   └── ...
├── manifest.json                 # Extension manifest
├── package.json                  # Dependencies
├── vite.config.ts                # Build config
├── tsconfig.json                 # TypeScript config
└── IMPLEMENTATION.md             # Technical details
```

## Next Steps

- **Read** [IMPLEMENTATION.md](IMPLEMENTATION.md) for technical architecture
- **Review** [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
- **Check** [SECURITY.md](SECURITY.md) for security considerations
- **See** [PRIVACY.md](PRIVACY.md) for data handling

## Performance Optimization

The extension includes a bundle visualizer to check size:

```bash
npm run build
# Opens stats.html showing bundle breakdown
```

Look for opportunities to:
- Split large modules
- Remove unused dependencies
- Lazy-load heavy components

## Need Help?

1. Check existing issues: [GitHub Issues](https://github.com/X0IVY/ai-guard/issues)
2. Review [IMPLEMENTATION.md](IMPLEMENTATION.md) for architecture details
3. Check Chrome extension documentation: [Chrome DevDocs](https://developer.chrome.com/docs/extensions/)

