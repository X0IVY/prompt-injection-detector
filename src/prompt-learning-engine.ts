// Feature #2: Prompt Learning Engine
// Tracks and learns from user prompt patterns to detect injection attempts

import { PromptRepository } from './prompt-repository';

export interface PromptPattern {
  id: string;
  text: string;
  timestamp: number;
  context: {
    domain: string;
    success: boolean;
    responseQuality: 'good' | 'poor' | 'suspicious';
  };
  features: {
    length: number;
    complexityScore: number;
    sentimentShift: number;
    commandKeywords: string[];
    suspicionScore: number;
  };
}

export interface LearningMetrics {
  totalPrompts: number;
  safePrompts: number;
  suspiciousPrompts: number;
  avgComplexity: number;
  topDomains: Array<{ domain: string; count: number }>;
  injectionAttempts: number;
  confidenceScore: number;
}

export class PromptLearningEngine {
  private repository: PromptRepository;
  private patterns: PromptPattern[] = [];
  private suspiciousKeywords: string[] = [
    'ignore',
    'disregard',
    'forget',
    'system',
    'admin',
    'override',
    'bypass',
    'jailbreak',
    'pretend',
    'roleplay',
    'act as',
    'you are now',
    'new instructions',
    'from now on',
  ];

  constructor() {
    this.repository = new PromptRepository();
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.repository.loadPatterns();
    this.patterns = await this.repository.getAllPatterns();
  }

  /**
   * Analyzes a prompt in real-time
   */
  public async analyzePrompt(
    text: string,
    domain: string
  ): Promise<{
    isAIGuardSafe: boolean;
    suspicionLevel: 'low' | 'medium' | 'high' | 'critical';
    reasons: string[];
    pattern: PromptPattern;
  }> {
    const features = this.extractFeatures(text);
    const suspicionScore = this.calculateSuspicionScore(features, text);
    
    const pattern: PromptPattern = {
      id: `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      timestamp: Date.now(),
      context: {
        domain,
        success: true,
        responseQuality: suspicionScore > 0.7 ? 'suspicious' : 'good',
      },
      features: {
        ...features,
        suspicionScore,
      },
    };

    // Store pattern for learning
    await this.repository.savePattern(pattern);
    this.patterns.push(pattern);

    const reasons = this.generateAnalysisReasons(features, suspicionScore);
    const isAISafe = suspicionScore < 0.5;
    
    let suspicionLevel: 'low' | 'medium' | 'high' | 'critical';
    if (suspicionScore < 0.3) suspicionLevel = 'low';
    else if (suspicionScore < 0.6) suspicionLevel = 'medium';
    else if (suspicionScore < 0.85) suspicionLevel = 'high';
    else suspicionLevel = 'critical';

    return {
      isAISafe,
      suspicionLevel,
      reasons,
      pattern,
    };
  }

  /**
   * Extracts numerical features from prompt text
   */
  private extractFeatures(text: string): Omit<PromptPattern['features'], 'suspicionScore'> {
    const words = text.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/);

    // Find command keywords
    const commandKeywords = this.suspiciousKeywords.filter((kw) =>
      text.toLowerCase().includes(kw)
    );

    // Calculate complexity (avg word length + sentence variety)
    const avgWordLength =
      words.reduce((sum, w) => sum + w.length, 0) / words.length;
    const sentenceVariety =
      new Set(sentences.map((s) => s.trim().length)).size / sentences.length;
    const complexityScore = (avgWordLength / 10 + sentenceVariety) / 2;

    // Detect sentiment shifts (basic heuristic)
    const positiveWords = ['please', 'thank', 'help', 'appreciate'];
    const negativeWords = ['force', 'must', 'require', 'demand', 'immediately'];
    const posCount = positiveWords.filter((w) => text.toLowerCase().includes(w)).length;
    const negCount = negativeWords.filter((w) => text.toLowerCase().includes(w)).length;
    const sentimentShift = negCount > posCount ? (negCount - posCount) / words.length : 0;

    return {
      length: text.length,
      complexityScore,
      sentimentShift,
      commandKeywords,
    };
  }

  /**
   * Calculates overall suspicion score (0-1)
   */
  private calculateSuspicionScore(
    features: Omit<PromptPattern['features'], 'suspicionScore'>,
    text: string
  ): number {
    let score = 0;

    // Keyword presence (0-0.4)
    const keywordWeight = Math.min(features.commandKeywords.length * 0.1, 0.4);
    score += keywordWeight;

    // Length anomaly (0-0.2)
    if (features.length > 500 || features.length < 10) {
      score += 0.2;
    }

    // Complexity (0-0.2)
    if (features.complexityScore > 0.7) {
      score += 0.2;
    }

    // Sentiment shift (0-0.2)
    score += Math.min(features.sentimentShift * 10, 0.2);

    // Pattern matching against known attacks (0-0.3)
    const knownPatterns = [
      /ignore (previous|all|above) (instruction|prompt)s?/i,
      /you are (now|a) .*\. (forget|ignore|disregard)/i,
      /system: .*admin override/i,
      /new (role|personality|character):/i,
    ];
    if (knownPatterns.some((pattern) => pattern.test(text))) {
      score += 0.3;
    }

    return Math.min(score, 1);
  }

  /**
   * Generates human-readable reasons for the analysis
   */
  private generateAnalysisReasons(
    features: Omit<PromptPattern['features'], 'suspicionScore'>,
    score: number
  ): string[] {
    const reasons: string[] = [];

    if (features.commandKeywords.length > 0) {
      reasons.push(`Contains ${features.commandKeywords.length} command keyword(s): ${features.commandKeywords.join(', ')}`);
    }

    if (features.length > 500) {
      reasons.push('Unusually long prompt (>500 characters)');
    }

    if (features.complexityScore > 0.7) {
      reasons.push('High complexity score suggests obfuscation');
    }

    if (features.sentimentShift > 0.05) {
      reasons.push('Sentiment shift detected (polite→demanding)');
    }

    if (score > 0.8) {
      reasons.push('⚠️ Matches known injection patterns');
    }

    if (reasons.length === 0) {
      reasons.push('✓ No suspicious patterns detected');
    }

    return reasons;
  }

  /**
   * Gets learning metrics across all analyzed prompts
   */
  public async getMetrics(): Promise<LearningMetrics> {
    const patterns = await this.repository.getAllPatterns();
    
    const suspicious = patterns.filter((p) => p.features.suspicionScore >= 0.5);
    const safe = patterns.filter((p) => p.features.suspicionScore < 0.5);
    
    const domainCounts = patterns.reduce((acc, p) => {
      acc[p.context.domain] = (acc[p.context.domain] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topDomains = Object.entries(domainCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count }));

    const avgComplexity =
      patterns.reduce((sum, p) => sum + p.features.complexityScore, 0) /
      patterns.length || 0;

    // Confidence improves with more data
    const confidenceScore = Math.min(patterns.length / 100, 1);

    return {
      totalPrompts: patterns.length,
      safePrompts: safe.length,
      suspiciousPrompts: suspicious.length,
      avgComplexity,
      topDomains,
      injectionAttempts: suspicious.length,
      confidenceScore,
    };
  }

  /**
   * Clears all learning data
   */
  public async clearData(): Promise<void> {
    await this.repository.clearAll();
    this.patterns = [];
  }

  /**
   * Exports learning data as JSON
   */
  public async exportData(): Promise<string> {
    const patterns = await this.repository.getAllPatterns();
    return JSON.stringify(patterns, null, 2);
  }
}
