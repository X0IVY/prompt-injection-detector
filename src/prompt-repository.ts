// Feature #2: Prompt Repository
// Handles persistent storage of prompt patterns using Chrome Storage API

import type { PromptPattern } from './prompt-learning-engine';

const STORAGE_KEY = 'ai_guard_prompt_patterns';
const MAX_PATTERNS = 1000; // Limit to prevent storage overflow

export class PromptRepository {
  private patterns: PromptPattern[] = [];
  private loaded: boolean = false;

  constructor() {
    // Patterns will be loaded on demand
  }

  /**
   * Loads all patterns from Chrome storage
   */
  public async loadPatterns(): Promise<void> {
    if (this.loaded) return;

    try {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      this.patterns = result[STORAGE_KEY] || [];
      this.loaded = true;
      console.log(`[PromptRepository] Loaded ${this.patterns.length} patterns from storage`);
    } catch (error) {
      console.error('[PromptRepository] Failed to load patterns:', error);
      this.patterns = [];
      this.loaded = true;
    }
  }

  /**
   * Saves a new pattern to storage
   */
  public async savePattern(pattern: PromptPattern): Promise<void> {
    await this.loadPatterns();

    // Add new pattern
    this.patterns.push(pattern);

    // Enforce max limit (FIFO - remove oldest)
    if (this.patterns.length > MAX_PATTERNS) {
      this.patterns = this.patterns.slice(-MAX_PATTERNS);
      console.log(`[PromptRepository] Trimmed to ${MAX_PATTERNS} patterns`);
    }

    // Save to storage
    try {
      await chrome.storage.local.set({ [STORAGE_KEY]: this.patterns });
      console.log(`[PromptRepository] Saved pattern ${pattern.id}`);
    } catch (error) {
      console.error('[PromptRepository] Failed to save pattern:', error);
      throw error;
    }
  }

  /**
   * Gets all stored patterns
   */
  public async getAllPatterns(): Promise<PromptPattern[]> {
    await this.loadPatterns();
    return [...this.patterns]; // Return copy
  }

  /**
   * Gets patterns filtered by domain
   */
  public async getPatternsByDomain(domain: string): Promise<PromptPattern[]> {
    await this.loadPatterns();
    return this.patterns.filter((p) => p.context.domain === domain);
  }

  /**
   * Gets patterns within a time range
   */
  public async getPatternsByTimeRange(
    startTime: number,
    endTime: number
  ): Promise<PromptPattern[]> {
    await this.loadPatterns();
    return this.patterns.filter(
      (p) => p.timestamp >= startTime && p.timestamp <= endTime
    );
  }

  /**
   * Gets suspicious patterns (score >= 0.5)
   */
  public async getSuspiciousPatterns(): Promise<PromptPattern[]> {
    await this.loadPatterns();
    return this.patterns.filter((p) => p.features.suspicionScore >= 0.5);
  }

  /**
   * Gets pattern by ID
   */
  public async getPatternById(id: string): Promise<PromptPattern | null> {
    await this.loadPatterns();
    return this.patterns.find((p) => p.id === id) || null;
  }

  /**
   * Deletes a pattern by ID
   */
  public async deletePattern(id: string): Promise<boolean> {
    await this.loadPatterns();
    
    const initialLength = this.patterns.length;
    this.patterns = this.patterns.filter((p) => p.id !== id);
    
    if (this.patterns.length < initialLength) {
      await chrome.storage.local.set({ [STORAGE_KEY]: this.patterns });
      console.log(`[PromptRepository] Deleted pattern ${id}`);
      return true;
    }
    
    return false;
  }

  /**
   * Clears all stored patterns
   */
  public async clearAll(): Promise<void> {
    this.patterns = [];
    this.loaded = true;
    
    try {
      await chrome.storage.local.remove(STORAGE_KEY);
      console.log('[PromptRepository] Cleared all patterns');
    } catch (error) {
      console.error('[PromptRepository] Failed to clear patterns:', error);
      throw error;
    }
  }

  /**
   * Gets storage statistics
   */
  public async getStats(): Promise<{
    totalPatterns: number;
    suspiciousCount: number;
    oldestTimestamp: number | null;
    newestTimestamp: number | null;
    storageBytes: number;
  }> {
    await this.loadPatterns();

    const suspicious = this.patterns.filter((p) => p.features.suspicionScore >= 0.5);
    const timestamps = this.patterns.map((p) => p.timestamp);
    
    // Estimate storage size
    const dataStr = JSON.stringify(this.patterns);
    const storageBytes = new Blob([dataStr]).size;

    return {
      totalPatterns: this.patterns.length,
      suspiciousCount: suspicious.length,
      oldestTimestamp: timestamps.length > 0 ? Math.min(...timestamps) : null,
      newestTimestamp: timestamps.length > 0 ? Math.max(...timestamps) : null,
      storageBytes,
    };
  }

  /**
   * Exports patterns as JSON string
   */
  public async exportToJSON(): Promise<string> {
    await this.loadPatterns();
    return JSON.stringify(this.patterns, null, 2);
  }

  /**
   * Imports patterns from JSON string
   */
  public async importFromJSON(jsonData: string): Promise<number> {
    try {
      const imported: PromptPattern[] = JSON.parse(jsonData);
      
      if (!Array.isArray(imported)) {
        throw new Error('Invalid JSON: expected array of patterns');
      }

      // Validate each pattern has required fields
      for (const pattern of imported) {
        if (!pattern.id || !pattern.text || !pattern.timestamp) {
          throw new Error('Invalid pattern structure');
        }
      }

      await this.loadPatterns();
      
      // Merge with existing (avoid duplicates by ID)
      const existingIds = new Set(this.patterns.map((p) => p.id));
      const newPatterns = imported.filter((p) => !existingIds.has(p.id));
      
      this.patterns.push(...newPatterns);
      
      // Enforce limit
      if (this.patterns.length > MAX_PATTERNS) {
        this.patterns = this.patterns.slice(-MAX_PATTERNS);
      }

      await chrome.storage.local.set({ [STORAGE_KEY]: this.patterns });
      console.log(`[PromptRepository] Imported ${newPatterns.length} new patterns`);
      
      return newPatterns.length;
    } catch (error) {
      console.error('[PromptRepository] Failed to import patterns:', error);
      throw error;
    }

  /**
   * Clears all stored patterns
   */
  public   async clearAll(): Promise<void> {
    this.patterns = [];
    this.loaded = false;
    await chrome.storage.local.remove(STORAGE_KEY);
    console.log('[PromptRepository] All patterns cleared');
  }
  }
}
