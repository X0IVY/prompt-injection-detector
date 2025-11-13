# ai-guard

ever wonder what's going on inside your LLMS head when it gives you a weird answer?

this extension basically lets you peek into the AI's "brain" while you're chatting. tracks things like memory, context drift, confidence levels, hallucinations - all in real time.

## why i built this

was debugging some AI responses and got frustrated not knowing if it:
- forgot something from earlier
- went completely off-topic
- was just making shit up
- lost confidence halfway through

so i threw this together to actually see what's happening under the hood. turned out pretty useful for spotting when AI is about to give you garbage.

## what it tracks

### memory stuff
- **memory pressure** - basically how close it is to forgetting things
- **forgotten items** - catches when it loses track of what you said earlier
- **active memory** - shows what's currently in working memory

### context & drift
- **context drift** - how far off-topic the conversation has gone
- **active topics** - what it thinks you're actually talking about
- **lost references** - when it forgets what "it" or "that" means

### reasoning quality  
- **confidence** - how sure it is (counts all the "maybe" and "I think" hedging)
- **hallucinations** - flags suspicious claims and vague citations
- **self-corrections** - tracks when it backtracks or contradicts itself

### attention
- **focus score** - how well it's paying attention vs going on tangents
- **distractions** - catches when it derails
- **focus areas** - keywords it's concentrating on

### emotional state
- **tone** - neutral, apologetic, defensive, uncertain
- **tone shifts** - sudden changes (like when it gets defensive)
- **stress** - excessive apologizing, hedging language

## features

- clean dashboard in the corner (collapsible)
- updates every 500ms as you chat
- color-coded alerts (green=good, yellow=watch out, red=wtf)
- works on ChatGPT, Claude, etc
- doesn't get in your way

## setup

```bash
git clone https://github.com/X0IVY/ai-guard.git
cd ai-guard
npm install
npm run build
```

load the `dist/` folder as unpacked extension in chrome.

for detailed setup/integration check [IMPLEMENTATION.md](IMPLEMENTATION.md)

## how it works

runs NLP analysis on responses in real-time:

1. tracks conversation length vs context window
2. compares current topic to history (context drift detection)
3. analyzes hedging language and uncertainty markers
4. looks for claims without sources (hallucination flags)
5. tracks topic consistency and focus
6. detects tone shifts and stress patterns

## using it

click the brain icon (🧠) in top-right to expand/collapse.

**debugging weird responses:**
- check memory pressure (is it forgetting stuff?)
- check context drift (did conversation derail?)
- check confidence (lots of "maybe" and "I think"?)

**quality checking output:**
- any hallucination flags?
- high uncertainty markers?
- did it contradict itself?

**research/analysis:**
- when does memory pressure spike in long convos?
- how well does it maintain topic focus?
- does it get "defensive" under certain conditions?

## tech stack

- preact (lighter than react)
- typescript
- custom css with animations
- chrome extension manifest v3

## main files

- `src/brain-tracker.ts` - core tracking logic
- `src/brain-dashboard.tsx` - UI component  
- `styles/brain-dashboard.css` - styling
- `IMPLEMENTATION.md` - dev guide if you want to modify/integrate

## contributing

see [CONTRIBUTING.md](CONTRIBUTING.md)

## license

MIT
