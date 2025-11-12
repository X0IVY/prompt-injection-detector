# AI Guard - Brain Monitor Dashboard

visualize what's happening inside your AI's "brain" in real-time.

## what it does

see inside the AI's cognitive state with real-time tracking of:

### 🧠 memory state

- **memory pressure**: how close AI is to forgetting things
- **forgotten items**: track when AI loses track of previous info
- **active memory**: see what's currently in short-term memory

### 🎯 context awareness

- **context drift**: measures how far off-topic AI has gone
- **active topics**: what AI thinks you're talking about
- **lost references**: when AI forgets what "it" or "that" refers to

### 🤔 reasoning patterns

- **confidence level**: how certain AI is about its answers
- **uncertainty markers**: counts "maybe", "I think", etc.
- **hallucination detection**: flags suspicious claims and vague citations
- **self-corrections**: tracks when AI corrects itself

### 👁️ attention tracking

- **focus score**: how well AI is paying attention to your question
- **distractions**: when AI goes off on tangents
- **focus areas**: keywords AI is concentrating on

### 💭 emotional state

- **tone**: current emotional tone (neutral/apologetic/defensive/uncertain)
- **tone shifts**: when AI suddenly changes its emotional state
- **stress indicators**: defensive language, excessive apologies

## features

- 🎨 **beautiful dashboard** - clean, collapsible interface in corner of page
- ⚡ **real-time updates** - metrics refresh every 500ms as you chat
- 🚨 **smart alerts** - color-coded warnings (yellow=caution, red=critical)
- 🌐 **works everywhere** - ChatGPT, Claude, and other AI chat platforms
- 🎯 **simple layout** - expandable sections, no clutter

## installation

```bash
git clone https://github.com/X0IVY/ai-guard.git
cd ai-guard
npm install
npm run build
```

then load the `dist/` folder as an unpacked extension in Chrome.

see [IMPLEMENTATION.md](IMPLEMENTATION.md) for detailed setup instructions.

## how it works

the extension analyzes AI responses in real-time using natural language processing to:

1. **track memory usage** - monitors conversation length vs context window
2. **detect context drift** - compares current topic to conversation history  
3. **measure confidence** - analyzes uncertainty markers and hedging language
4. **spot hallucinations** - looks for vague claims without proper sources
5. **gauge attention** - tracks topic consistency and focus
6. **read emotional state** - detects tone shifts and stress patterns

## dashboard controls

- click the **brain icon** (🧠) in the top-right to expand/collapse
- **green metrics** = normal operation
- **yellow metrics** = worth watching
- **red metrics** = critical state detected

## example use cases

### debugging conversations

when AI gives a weird response, check:
- **memory pressure** - is it forgetting earlier context?
- **context drift** - did the conversation go off track?
- **confidence** - is AI uncertain about its answer?

### quality checking

before trusting AI output, verify:
- **hallucination detection** - any suspicious claims flagged?
- **confidence level** - is AI hedging with "maybe" and "I think"?
- **self-corrections** - did AI contradict itself?

### research & analysis

track AI behavior over long conversations:
- **memory patterns** - when does AI start forgetting?
- **topic drift** - how well does AI stay on subject?
- **emotional state** - does AI get "defensive" under pressure?

## technical details

- **frontend**: Preact for lightweight reactive UI
- **styling**: custom CSS with smooth animations
- **architecture**: modular TypeScript classes
- **tracking**: `BrainTracker` class with 5 cognitive dimensions
- **visualization**: `BrainDashboard` component with real-time updates

## files

- `src/brain-tracker.ts` - core tracking logic and state management
- `src/brain-dashboard.tsx` - Preact UI component
- `styles/brain-dashboard.css` - professional dark theme styling
- `IMPLEMENTATION.md` - comprehensive developer guide

## contributing

see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## security

for security issues, see [SECURITY.md](SECURITY.md).

## license

MIT - see [LICENSE](LICENSE) for details.

---

*peek inside the AI's brain* 🧠
