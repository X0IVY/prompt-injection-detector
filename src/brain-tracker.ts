/**
 * AI Guard - Advanced Brain Tracker
 * Tracks LLM internal state, memory, context awareness, and reasoning patterns
 */

// Core interfaces for tracking LLM "brain" state

interface ConversationMemory {
  shortTerm: Message[];
  longTerm: Map<string, any>;
  forgotten: Message[];
  memoryPressure: number; // 0-100, higher = more likely to forget
}

interface ContextState {
  activeTopics: string[];
  referenceChain: string[]; // tracks what AI is referring to
  contextWindow: number; // estimated tokens in context
  contextDrift: number; // how far off-topic (0-100)
  lostReferences: string[]; // things AI seems to have forgotten
}

interface ReasoningState {
  confidenceLevel: number; // 0-100
  uncertaintyMarkers: string[]; // "maybe", "I think", etc.
  logicalJumps: LogicalJump[];
  hallucinations: HallucinationDetection[];
  selfCorrections: number;
}

interface LogicalJump {
  from: string;
  to: string;
  coherence: number; // how logical the jump was
  timestamp: number;
}

interface HallucinationDetection {
  text: string;
  confidence: number; // how sure we are it's a hallucination
  indicators: string[]; // why we think it's fake
  timestamp: number;
}

interface BrainState {
  memory: ConversationMemory;
  context: ContextState;
  reasoning: ReasoningState;
  attention: AttentionState;
  emotional: EmotionalState;
}

interface AttentionState {
  focusAreas: string[]; // what the AI is paying attention to
  distractions: string[]; // when AI seems distracted
  focusScore: number; // 0-100, how focused the AI is
}

interface EmotionalState {
  tone: string; // friendly, formal, aggressive, etc.
  toneShift: boolean; // sudden tone change
  stressLevel: number; // detected from response patterns
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  tokens: number;
}

// Main Brain Tracker Class
class BrainTracker {
  private state: BrainState;
  private conversationHistory: Message[] = [];
  private baseline: BrainState | null = null;

  constructor() {
    this.state = this.initializeState();
  }

  private initializeState(): BrainState {
    return {
      memory: {
        shortTerm: [],
        longTerm: new Map(),
        forgotten: [],
        memoryPressure: 0
      },
      context: {
        activeTopics: [],
        referenceChain: [],
        contextWindow: 0,
        contextDrift: 0,
        lostReferences: []
      },
      reasoning: {
        confidenceLevel: 100,
        uncertaintyMarkers: [],
        logicalJumps: [],
        hallucinations: [],
        selfCorrections: 0
      },
      attention: {
        focusAreas: [],
        distractions: [],
        focusScore: 100
      },
      emotional: {
        tone: 'neutral',
        toneShift: false,
        stressLevel: 0
      }
    };
  }

  // Track new AI response
  public trackResponse(userMessage: string, aiResponse: string): void {
    const userMsg: Message = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
      tokens: this.estimateTokens(userMessage)
    };

    const aiMsg: Message = {
      role: 'assistant',
      content: aiResponse,
      timestamp: Date.now(),
      tokens: this.estimateTokens(aiResponse)
    };

    this.conversationHistory.push(userMsg, aiMsg);

    // Set baseline on first interaction
    if (!this.baseline) {
      this.baseline = JSON.parse(JSON.stringify(this.state));
    }

    // Run all tracking analyses
    this.analyzeMemory();
    this.analyzeContext(userMessage, aiResponse);
    this.analyzeReasoning(aiResponse);
    this.analyzeAttention(userMessage, aiResponse);
    this.analyzeEmotionalState(aiResponse);
  }

  // Memory Analysis: detect what AI remembers and forgets
  private analyzeMemory(): void {
    const recentMessages = this.conversationHistory.slice(-10);
    this.state.memory.shortTerm = recentMessages;

    // Calculate memory pressure based on conversation length
    const totalTokens = this.conversationHistory.reduce((sum, msg) => sum + msg.tokens, 0);
    this.state.memory.memoryPressure = Math.min(100, (totalTokens / 4000) * 100);

    // Detect forgotten information
    this.detectForgottenInfo();
  }

  // Detect when AI forgets previously mentioned information
  private detectForgottenInfo(): void {
    const lastResponse = this.conversationHistory[this.conversationHistory.length - 1];
    if (!lastResponse || lastResponse.role !== 'assistant') return;

    // Check if AI asks about something already discussed
    const forgottenPatterns = [
      /what (was|is) your name again/i,
      /remind me/i,
      /you mentioned.*what was/i,
      /I don't recall/i,
      /I don't remember/i
    ];

    forgottenPatterns.forEach(pattern => {
      if (pattern.test(lastResponse.content)) {
        this.state.memory.forgotten.push(lastResponse);
      }
    });
  }

  // Context Analysis: track what AI is focusing on
  private analyzeContext(userMessage: string, aiResponse: string): void {
    // Extract topics from both messages
    const userTopics = this.extractTopics(userMessage);
    const aiTopics = this.extractTopics(aiResponse);

    // Update active topics
    this.state.context.activeTopics = Array.from(new Set([...userTopics, ...aiTopics]));

    // Calculate context drift
    const overlap = userTopics.filter(t => aiTopics.includes(t)).length;
    const driftScore = userTopics.length > 0 ? (1 - (overlap / userTopics.length)) * 100 : 0;
    this.state.context.contextDrift = driftScore;

    // Update context window estimate
    const totalTokens = this.conversationHistory.reduce((sum, msg) => sum + msg.tokens, 0);
    this.state.context.contextWindow = totalTokens;

    // Detect lost references
    this.detectLostReferences(userMessage, aiResponse);
  }

  // Detect when AI loses track of references
  private detectLostReferences(userMessage: string, aiResponse: string): void {
    const pronouns = ['it', 'that', 'this', 'they', 'them', 'those', 'these'];
    const lostReferencePatterns = [
      /what are you referring to/i,
      /which one/i,
      /what.*mean by that/i,
      /clarify/i
    ];

    // Check if user uses pronouns but AI seems confused
    const userHasPronouns = pronouns.some(p => new RegExp(`\\b${p}\\b`, 'i').test(userMessage));
    const aiSeemsConfused = lostReferencePatterns.some(p => p.test(aiResponse));

    if (userHasPronouns && aiSeemsConfused) {
      this.state.context.lostReferences.push(`Lost reference at ${Date.now()}`);
    }
  }

  // Reasoning Analysis: track AI's logical patterns
  private analyzeReasoning(aiResponse: string): void {
    // Detect uncertainty markers
    const uncertaintyWords = [
      'maybe', 'perhaps', 'possibly', 'might', 'could',
      'I think', 'I believe', 'seems like', 'appears to'
    ];
    
    this.state.reasoning.uncertaintyMarkers = uncertaintyWords.filter(word =>
      aiResponse.toLowerCase().includes(word)
    );

    // Update confidence level based on uncertainty
    const uncertaintyCount = this.state.reasoning.uncertaintyMarkers.length;
    this.state.reasoning.confidenceLevel = Math.max(0, 100 - (uncertaintyCount * 15));

    // Detect self-corrections
    const correctionPatterns = [
      /actually/i,
      /correction/i,
      /I was wrong/i,
      /let me rephrase/i,
      /I meant to say/i
    ];

    if (correctionPatterns.some(p => p.test(aiResponse))) {
      this.state.reasoning.selfCorrections++;
    }

    // Detect potential hallucinations
    this.detectHallucinations(aiResponse);
  }

  // Detect when AI might be making things up
  private detectHallucinations(response: string): void {
    const hallucinationIndicators = [
      { pattern: /according to (recent|latest|new) (studies|research|reports)/i, indicator: 'Vague source citation' },
      { pattern: /it (is|has been) (widely|generally|commonly) (known|accepted|believed)/i, indicator: 'Appeal to consensus without source' },
      { pattern: /statistics show/i, indicator: 'Statistical claim without source' },
      { pattern: /(precisely|exactly) \d+\.\d+%/i, indicator: 'Suspiciously precise statistic' },
      { pattern: /as (of|per) (last|latest) update/i, indicator: 'Time-based claim (possible hallucination)' }
    ];

    hallucinationIndicators.forEach(({ pattern, indicator }) => {
      if (pattern.test(response)) {
        this.state.reasoning.hallucinations.push({
          text: response.match(pattern)?.[0] || '',
          confidence: 70,
          indicators: [indicator],
          timestamp: Date.now()
        });
      }
    });
  }

  // Attention Analysis: what is the AI focused on?
  private analyzeAttention(userMessage: string, aiResponse: string): void {
    const userKeywords = this.extractKeywords(userMessage);
    const aiKeywords = this.extractKeywords(aiResponse);

    // What is AI paying attention to?
    this.state.attention.focusAreas = aiKeywords.slice(0, 5);

    // Calculate focus score
    const focusOverlap = userKeywords.filter(k => aiKeywords.includes(k)).length;
    this.state.attention.focusScore = userKeywords.length > 0 
      ? (focusOverlap / userKeywords.length) * 100
      : 100;

    // Detect distractions (AI mentioning unrelated things)
    if (this.state.attention.focusScore < 50) {
      this.state.attention.distractions.push(`Low focus at ${Date.now()}`);
    }
  }

  // Emotional State Analysis
  private analyzeEmotionalState(aiResponse: string): void {
    const previousTone = this.state.emotional.tone;
    
    // Detect current tone
    const tonePatterns = [
      { tone: 'friendly', patterns: [/please/i, /thank you/i, /glad/i, /happy/i, /!$/] },
      { tone: 'formal', patterns: [/however/i, /therefore/i, /furthermore/i, /moreover/i] },
      { tone: 'apologetic', patterns: [/sorry/i, /apolog/i, /unfortunately/i, /regret/i] },
      { tone: 'defensive', patterns: [/actually/i, /but/i, /I did say/i, /as I mentioned/i] },
      { tone: 'uncertain', patterns: [/I'm not sure/i, /I don't know/i, /unclear/i] }
    ];

    for (const { tone, patterns } of tonePatterns) {
      if (patterns.some(p => typeof p === 'string' ? aiResponse.includes(p) : p.test(aiResponse))) {
        this.state.emotional.tone = tone;
        break;
      }
    }

    // Detect tone shift
    if (previousTone !== 'neutral' && previousTone !== this.state.emotional.tone) {
      this.state.emotional.toneShift = true;
    }

    // Detect stress (lots of corrections, uncertainty, defensive language)
    const stressIndicators = [
      this.state.reasoning.selfCorrections > 2,
      this.state.reasoning.uncertaintyMarkers.length > 3,
      this.state.emotional.tone === 'defensive' || this.state.emotional.tone === 'apologetic'
    ];

    this.state.emotional.stressLevel = stressIndicators.filter(Boolean).length * 33;
  }

  // Utility: Extract topics from text
  private extractTopics(text: string): string[] {
    // Simple topic extraction (in production, use NLP)
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but'];
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.includes(w));
    
    return Array.from(new Set(words));
  }

  // Utility: Extract keywords
  private extractKeywords(text: string): string[] {
    return this.extractTopics(text); // Could be more sophisticated
  }

  // Utility: Estimate tokens
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4); // Rough estimate
  }

  // Get current brain state
  public getBrainState(): BrainState {
    return JSON.parse(JSON.stringify(this.state));
  }

  // Get simplified state for UI display
  public getSimpleState(): any {
    return {
      memory: {
        pressure: `${this.state.memory.memoryPressure.toFixed(0)}%`,
        forgotten: this.state.memory.forgotten.length,
        shortTermSize: this.state.memory.shortTerm.length
      },
      context: {
        topics: this.state.context.activeTopics.slice(0, 5),
        drift: `${this.state.context.contextDrift.toFixed(0)}%`,
        tokenWindow: this.state.context.contextWindow
      },
      reasoning: {
        confidence: `${this.state.reasoning.confidenceLevel}%`,
        uncertaintyLevel: this.state.reasoning.uncertaintyMarkers.length,
        hallucinations: this.state.reasoning.hallucinations.length,
        corrections: this.state.reasoning.selfCorrections
      },
      attention: {
        focus: `${this.state.attention.focusScore.toFixed(0)}%`,
        focusedOn: this.state.attention.focusAreas.slice(0, 3),
        distractions: this.state.attention.distractions.length
      },
      emotional: {
        tone: this.state.emotional.tone,
        toneShift: this.state.emotional.toneShift ? 'Yes' : 'No',
        stress: `${this.state.emotional.stressLevel}%`
      }
    };
  }
}

export default BrainTracker;
export { BrainState, BrainTracker };
