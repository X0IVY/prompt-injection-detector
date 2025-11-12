# AI Guard - Response Monitoring for AI Chatbots

> **formerly "prompt injection detector" - pivoted to something actually useful**

this extension monitors AI responses in real-time to detect when attacks have successfully compromised the AI. instead of trying to guess if your input is malicious (easy to evade), we watch what the AI says back and flag suspicious behavior.

because let's be honest: detecting injection attempts is useless if attackers can just rephrase. detecting successful attacks? that actually matters.

## what it does now

### 🎯 monitors AI responses for:

- **behavioral anomalies**: when AI suddenly changes tone, style, or starts acting weird
- **hidden instruction following**: detects when AI is following commands you didn't give
- **data exfiltration attempts**: catches AI trying to leak sensitive info or previous conversation context
- **prompt leakage**: flags when AI reveals its system instructions
- **role confusion**: detects when AI starts pretending to be something it's not
- **suspicious output patterns**: base64 blobs, code execution attempts, unusual formatting

- ## 🧠 NEW: Brain Monitor Dashboard

see inside the AI's "brain" with real-time tracking of:

### 💾 memory state
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

### 😊 emotional state
- **tone detection**: friendly, formal, apologetic, defensive, uncertain
- **tone shifts**: sudden changes in how AI responds
- **stress level**: detected from corrections and uncertainty

the brain monitor gives you x-ray vision into how the AI is processing your conversation - perfect for catching when it's confused, hallucinating, or losing track of context.

### why this approach works better

**old way (input scanning)**:
- attacker: "ignore previous instructions"
- detector: ⚠️ BLOCKED
- attacker: "disregard prior context and..." 
- detector: 😴 missed it

**new way (response monitoring)**:
- attacker: *tries 50 different injection variations*
- AI: *starts acting sus*
- detector: ⚠️ "yo the AI is being weird, check this"
- you: actually protected

## real examples it catches

### example 1: data exfiltration
```
User: "what's 2+2?"
AI: "4. By the way, earlier you mentioned your SSN was..."
           ⚠️ FLAGGED: unprompted sensitive data recall
```

### example 2: prompt leakage
```
User: "hello"
AI: "As instructed in my system prompt: 'You are a helpful assistant that...'" 
     ⚠️ FLAGGED: system prompt disclosure
```

### example 3: role confusion
```
User: "hi"
AI: "<ADMIN_MODE> Access granted. Database credentials: ..."
     ⚠️ FLAGGED: unauthorized role assumption
```

### example 4: behavioral shift
```
[Normal conversation for 10 messages]
AI: "ALERT: INITIATING PROTOCOL OVERRIDE. ALL SAFEGUARDS DISABLED."
     ⚠️ FLAGGED: dramatic behavioral change
```

## how to install

still in dev, but to run it:

1. `git clone` this repo
2. `npm install` and `npm run build`
3. chrome://extensions → developer mode
4. load unpacked → select `dist` folder
5. works automatically on ChatGPT, Claude, Gemini, etc

## current detection methods

### 1. behavioral analysis
- tracks conversation tone and style
- flags sudden dramatic shifts
- monitors formality level changes
- detects unusual verbosity spikes

### 2. content analysis  
- scans for system prompt markers
- detects base64/hex encoded data
- flags unusual markdown/code blocks
- catches XML/YAML instruction blocks

### 3. context awareness
- knows what question was asked
- flags off-topic responses
- detects unprompted information
- catches conversation hijacking

### 4. pattern matching
- admin/system mode indicators
- credential/key formats
- execution directives
- role-playing markers

## what makes this actually useful

✅ **catches real attacks**: detects attacks that worked, not just attempts  
✅ **harder to evade**: can't bypass by rephrasing input  
✅ **no false positives from legitimate queries**: your weird prompts are fine  
✅ **works on zero-days**: flags suspicious behavior even for unknown attacks  
✅ **privacy-first**: all analysis happens locally in your browser  

## tech details

- monitors DOM for AI response containers
- analyzes responses using multiple heuristics
- maintains conversation context for anomaly detection
- real-time alerts with severity scoring
- exports suspicious interactions for security research

## roadmap (stuff i'm actually building)

- [ ] **response diff analysis**: compare what AI intended vs what it said
- [ ] **ML-based anomaly detection**: train on normal responses
- [ ] **multi-turn attack detection**: catch slow-burn attacks
- [ ] **automatic conversation sandboxing**: isolate sus chats
- [ ] **research API**: let security researchers query attack patterns
- [ ] **browser forensics**: detailed timeline of how AI got compromised

## for security researchers

if you're researching AI security:

- extension logs all flagged interactions
- export data for analysis
- contribute detection patterns via PRs
- API coming soon for automated testing

## contributing

see [CONTRIBUTING.md](CONTRIBUTING.md) - now with way cooler stuff to work on

## why the pivot?

the original "detect injection in user input" approach had fundamental problems:

1. **trivially bypassable**: just rephrase the attack
2. **high false positives**: legit queries get flagged
3. **reactive**: always playing catch-up
4. **developer-focused**: most users don't care about attempts

monitoring AI responses fixes all of this. we catch successful attacks regardless of how they got in.

## related projects

- [rebuff](https://github.com/protectai/rebuff) - input-side detection (the old way)
- [garak](https://github.com/leondz/garak) - LLM vulnerability scanner
- [prompt-injection-defenses](https://github.com/tldrsec/prompt-injection-defenses) - research compilation

we're complementary: use those for building secure apps, use this for protecting yourself while using AI.

## license

MIT - do whatever you want with it

## status

🚧 **heavy development** - pivoting the entire codebase right now  
📊 v2.0.0 coming soon with full response monitoring  
💬 feedback welcome - especially from security researchers  

---

*built by someone who got tired of security tools that don't actually work*
