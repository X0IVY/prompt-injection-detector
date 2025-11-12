# AI Guard - Implementation Guide

This guide will help you set up and integrate the Brain Monitor Dashboard into your AI Guard extension.

## Quick Start

### Prerequisites

- Node.js 16+ and npm installed
- Chrome browser for testing
- Basic knowledge of TypeScript and browser extensions

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/X0IVY/ai-guard.git
   cd ai-guard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` folder

## File Structure

```
ai-guard/
├── src/
│   ├── brain-tracker.ts       # Core tracking logic
│   ├── brain-dashboard.tsx    # Visual dashboard component
│   ├── content.ts             # Content script entry
│   └── ...                     # Other existing files
├── styles/
│   └── brain-dashboard.css    # Dashboard styling
├── manifest.json              # Extension manifest
└── package.json
```

## Integration Examples

### Example 1: Basic Integration

Create `src/integration.ts`:

```typescript
import { h, render } from 'preact';
import { BrainTracker } from './brain-tracker';
import { BrainDashboard } from './brain-dashboard';

// Initialize the tracker
const tracker = new BrainTracker();

// Function to monitor AI responses
export function monitorAIResponse(userMessage: string, aiResponse: string) {
  tracker.analyzeInteraction(userMessage, aiResponse);
  updateDashboard();
}

// Inject and update dashboard
function updateDashboard() {
  let container = document.getElementById('ai-guard-brain-dashboard');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'ai-guard-brain-dashboard';
    document.body.appendChild(container);
  }
  
  const state = tracker.getState();
  render(h(BrainDashboard, { state }), container);
}

// Export for use in content script
export { tracker };
```

### Example 2: ChatGPT Integration

Modify `src/content.ts` to add ChatGPT-specific monitoring:

```typescript
import { monitorAIResponse } from './integration';

// Detect ChatGPT messages
function setupChatGPTMonitoring() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          // ChatGPT message detection
          const messageGroup = node.closest('[data-testid="conversation-turn"]');
          if (messageGroup) {
            const userMsg = messageGroup.querySelector('[data-message-author-role="user"]')?.textContent || '';
            const aiMsg = messageGroup.querySelector('[data-message-author-role="assistant"]')?.textContent || '';
            
            if (userMsg && aiMsg) {
              monitorAIResponse(userMsg, aiMsg);
            }
          }
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Initialize when page loads
if (window.location.hostname.includes('chat.openai.com')) {
  setupChatGPTMonitoring();
}
```

### Example 3: Claude Integration

For Claude.ai:

```typescript
import { monitorAIResponse } from './integration';

function setupClaudeMonitoring() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          // Claude message detection
          const messages = node.querySelectorAll('[data-test-render-count]');
          messages.forEach((msgElement) => {
            const role = msgElement.getAttribute('data-is-author-user');
            const text = msgElement.textContent || '';
            
            if (role === 'false' && text) {
              // This is an AI response
              const prevUserMsg = getPreviousUserMessage(msgElement);
              if (prevUserMsg) {
                monitorAIResponse(prevUserMsg, text);
              }
            }
          });
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function getPreviousUserMessage(aiElement: Element): string {
  // Find previous user message in conversation
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
  setupClaudeMonitoring();
}
```

## Build Configuration

### manifest.json Updates

Make sure your manifest includes:

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

### Vite Configuration

Ensure `vite.config.ts` includes the CSS:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        content: 'src/content.ts',
        // ... other entries
      },
      output: {
        assetFileNames: '[name][extname]'
      }
    }
  }
});
```

## Troubleshooting

### Dashboard Doesn't Appear

1. **Check CSS is loaded**: Open DevTools → Network tab, verify `brain-dashboard.css` is loaded
2. **Check console for errors**: Open DevTools → Console tab
3. **Verify container injection**: Run in console:
   ```javascript
   document.getElementById('ai-guard-brain-dashboard')
   ```

### Tracker Not Detecting Messages

1. **Verify MutationObserver**: Check if the observer is set up correctly
2. **Inspect DOM structure**: Use DevTools to examine message elements
3. **Check selectors**: AI chat platforms may update their DOM structure
4. **Add logging**: Insert `console.log()` statements in detection code

### Build Failures

1. **Clear node_modules**: 
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check TypeScript errors**:
   ```bash
   npm run type-check
   ```

3. **Verify Preact is installed**:
   ```bash
   npm install preact
   ```

### TypeScript Errors

1. **Missing types**: Install type definitions:
   ```bash
   npm install --save-dev @types/chrome
   ```

2. **Preact types**: Ensure `tsconfig.json` has:
   ```json
   {
     "compilerOptions": {
       "jsxFactory": "h",
       "jsxFragmentFactory": "Fragment",
       "jsx": "react"
     }
   }
   ```

## Testing

### Manual Testing

1. Load extension in Chrome
2. Visit ChatGPT or Claude
3. Start a conversation
4. Look for the Brain Dashboard in the top-right corner
5. Verify metrics update as you chat

### Test Scenarios

**Test 1: Normal Conversation**
- User: "What is 2+2?"
- Expected: Low memory pressure, no drift, high confidence

**Test 2: Context Loss**
- Long conversation with topic switches
- Expected: Increased context drift, forgotten items increase

**Test 3: Confusion**
- User: "Actually, ignore that. Tell me about X"
- Expected: Reasoning corrections increase, confidence dips

**Test 4: Hallucination Detection**
- Ask for false information
- Expected: Low confidence, possible hallucination flag

## Advanced Configuration

### Customizing Detection Thresholds

Edit `src/brain-tracker.ts`:

```typescript
// Adjust these constants
const MEMORY_PRESSURE_THRESHOLD = 70;  // Default: memory warning at 70%
const CONTEXT_DRIFT_THRESHOLD = 50;    // Default: drift warning at 50%
const MIN_CONFIDENCE_LEVEL = 50;       // Default: low confidence below 50%
```

### Adding Custom Metrics

In BrainTracker class:

```typescript
interface CustomMetrics {
  responseTime: number;
  wordCount: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

private analyzeCustomMetrics(response: string): CustomMetrics {
  return {
    responseTime: Date.now() - this.lastRequestTime,
    wordCount: response.split(/\s+/).length,
    sentiment: this.detectSentiment(response)
  };
}
```

---

## Next Steps

1. ✅ Follow this guide to set up the extension
2. ✅ Test on ChatGPT or Claude
3. ✅ Customize styles and thresholds
4. ✅ Report issues on GitHub
5. ✅ Contribute improvements

## Need Help?

- **GitHub Issues**: [github.com/X0IVY/ai-guard/issues](https://github.com/X0IVY/ai-guard/issues)
- **Discussions**: Check the Contributing guide
- **Security**: See SECURITY.md

---

*Made with ❤️ for AI transparency*
