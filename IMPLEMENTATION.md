# implementation guide

ok so you want to actually use this thing. here's how to get it running.

## what you need

- node.js 16+ and npm
- chrome browser
- basic idea of how typescript and browser extensions work

## getting started

### 1. clone and install

```bash
git clone https://github.com/X0IVY/ai-guard.git
cd ai-guard
npm install
```

### 2. build it

```bash
npm run build
```

this creates a `dist/` folder with all the extension files

### 3. load in chrome

1. open `chrome://extensions/`
2. turn on "Developer mode" (top right)
3. click "Load unpacked"
4. select the `dist/` folder

done. now go to ChatGPT or Claude and you should see the brain dashboard.

## how it works

the extension has a few key pieces:

```
ai-guard/
├── src/
│   ├── brain-tracker.ts      # does all the cognitive tracking
│   ├── brain-dashboard.tsx   # the UI you see
│   ├── content.ts            # watches the chat pages
│   └── ...
├── styles/
│   └── brain-dashboard.css
└── manifest.json
```

## integrating it yourself

if you want to use the tracker in your own project:

### basic usage

```typescript
import { h, render } from 'preact';
import { BrainTracker } from './brain-tracker';
import { BrainDashboard } from './brain-dashboard';

// create tracker
const tracker = new BrainTracker();

// feed it conversations
function monitorChat(userMessage: string, aiResponse: string) {
  tracker.analyzeInteraction(userMessage, aiResponse);
  updateDashboard();
}

// show the dashboard
function updateDashboard() {
  let container = document.getElementById('brain-dashboard');
  if (!container) {
    container = document.createElement('div');
    container.id = 'brain-dashboard';
    document.body.appendChild(container);
  }
  
  const state = tracker.getState();
  render(h(BrainDashboard, { state }), container);
}
```

### hooking into chatgpt

ChatGPT's DOM is a pain but here's what works:

```typescript
import { monitorChat } from './integration';

function setupChatGPT() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          // look for message containers
          const msgGroup = node.closest('[data-testid="conversation-turn"]');
          if (msgGroup) {
            const userMsg = msgGroup.querySelector('[data-message-author-role="user"]')?.textContent || '';
            const aiMsg = msgGroup.querySelector('[data-message-author-role="assistant"]')?.textContent || '';
            
            if (userMsg && aiMsg) {
              monitorChat(userMsg, aiMsg);
            }
          }
        }
      });
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

if (window.location.hostname.includes('chat.openai.com')) {
  setupChatGPT();
}
```

### hooking into claude

Claude is slightly different:

```typescript
function setupClaude() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          const messages = node.querySelectorAll('[data-test-render-count]');
          messages.forEach((msgElement) => {
            const isAI = msgElement.getAttribute('data-is-author-user') === 'false';
            const text = msgElement.textContent || '';
            
            if (isAI && text) {
              const prevUserMsg = getPreviousUserMessage(msgElement);
              if (prevUserMsg) {
                monitorChat(prevUserMsg, text);
              }
            }
          });
        }
      });
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

function getPreviousUserMessage(aiElement: Element): string {
  let current = aiElement.previousElementSibling;
  while (current) {
    if (current.getAttribute('data-is-author-user') === 'true') {
      return current.textContent || '';
    }
    current = current.previousElementSibling;
  }
  return '';
}

if (window.location.hostname.includes('claude.ai')) {
  setupClaude();
}
```

## manifest setup

make sure your `manifest.json` includes:

```json
{
  "content_scripts": [
    {
      "matches": [
        "https://chat.openai.com/*",
        "https://claude.ai/*"
      ],
      "js": ["content.js"],
      "css": ["brain-dashboard.css"]
    }
  ]
}
```

## troubleshooting

### dashboard not showing up?

1. check console for errors (F12)
2. make sure CSS loaded: check Network tab for `brain-dashboard.css`
3. verify container exists: run `document.getElementById('ai-guard-brain-dashboard')` in console

### tracker not detecting messages?

1. check if MutationObserver is running
2. inspect the DOM to see current message structure (AI sites change this frequently)
3. add some `console.log()` statements to see what's happening
4. the selectors might be outdated if the site updated

### build failing?

```bash
# nuke everything and start over
rm -rf node_modules package-lock.json
npm install
npm run build
```

if you get typescript errors:
```bash
npm install --save-dev @types/chrome
```

make sure your `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    "jsx": "react"
  }
}
```

## customizing thresholds

want to tune when warnings show up? edit `src/brain-tracker.ts`:

```typescript
// these control when colors change
const MEMORY_PRESSURE_THRESHOLD = 70;  // warning at 70%
const CONTEXT_DRIFT_THRESHOLD = 50;    // drift warning at 50%
const MIN_CONFIDENCE_LEVEL = 50;       // low confidence below 50%
```

play around with these based on what you're seeing.

## testing

### manual testing

1. load extension in chrome
2. go to ChatGPT or Claude
3. start chatting
4. watch the dashboard update
5. try these scenarios:
   - normal question (should be green)
   - long conversation with topic switches (watch drift increase)
   - confusing back-and-forth (confidence drops)
   - asking for false info (hallucination flags)

### things to test

- does it track memory correctly?
- does context drift increase when you change topics?
- does confidence drop when AI seems confused?
- does UI stay responsive?

## adding more platforms

want to track other AI chat sites? the pattern is:

1. figure out their DOM structure (use DevTools)
2. write a MutationObserver to catch new messages
3. extract user + AI text
4. call `tracker.analyzeInteraction(user, ai)`
5. add site to manifest.json matches

most AI chat sites work similarly - just different CSS selectors.

## need help?

- open an [issue](https://github.com/X0IVY/ai-guard/issues)
- check existing issues first
- include browser version, site you're testing, and any console errors

good luck! if something's unclear let me know and i'll update this doc.
