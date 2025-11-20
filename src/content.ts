// AI Guard - Integrated Content Script with Full Feature Suite
// Monitors AI chatbot behavior, detects anomalies, tracks patterns, and provides real-time insights

import { PerformanceMonitor } from './performance-monitor';
import { PromptLearningEngine } from './prompt-learning-engine';
import { PromptRepository } from './prompt-repository';

interface Pattern {
  id: string;
  name: string;
  regex: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class AIGuard {
  private patterns: Pattern[] = [];
  private compiledPatterns: Map<string, RegExp> = new Map();
  private perfMonitor: PerformanceMonitor;
  private learningEngine: PromptLearningEngine;
  private repository: PromptRepository;
  private uiContainer: HTMLElement | null = null;
  private isUIVisible: boolean = false;

  constructor() {
    this.perfMonitor = new PerformanceMonitor();
    this.learningEngine = new PromptLearningEngine();
    this.repository = new PromptRepository();
  }

  async initialize(): Promise<void> {
    console.log('[AI Guard] Initializing...');

    try {
      // Load patterns
      await this.loadPatterns();

      // Start performance monitoring
      this.perfMonitor.startMonitoring();

      // Create and inject UI
      this.createUI();

      // Monitor text inputs for injection detection
      this.monitorInputs();

      // Set up prompt learning
      this.setupPromptLearning();

      console.log('[AI Guard] ✓ Initialized successfully');
    } catch (error) {
      console.error('[AI Guard] Failed to initialize:', error);
    }
  }

  private async loadPatterns(): Promise<void> {
    try {
      const response = await fetch(chrome.runtime.getURL('src/patterns.json'));
      this.patterns = await response.json();

      this.patterns.forEach(pattern => {
        try {
          this.compiledPatterns.set(pattern.id, new RegExp(pattern.regex, 'gi'));
        } catch (e) {
          console.error(`[AI Guard] Failed to compile pattern \${pattern.id}:`, e);
        }
      });

      console.log(`[AI Guard] Loaded \${this.patterns.length} patterns`);
    } catch (error) {
      console.error('[AI Guard] Failed to load patterns:', error);
    }
  }

  private createUI(): void {
    // Create floating panel
    this.uiContainer = document.createElement('div');
    this.uiContainer.id = 'ai-guard-panel';
    this.uiContainer.className = 'ai-guard-panel';

    // Initial hidden state
    this.uiContainer.style.display = 'none';

    document.body.appendChild(this.uiContainer);

    // Create toggle button
    this.createToggleButton();

    // Render initial UI
    this.renderUI();
  }

  private createToggleButton(): void {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'ai-guard-toggle';
    toggleBtn.className = 'ai-guard-toggle';
    toggleBtn.innerHTML = '🛡️';
    toggleBtn.setAttribute('aria-label', 'Toggle AI Guard Panel');

    toggleBtn.onclick = () => this.toggleUI();

    document.body.appendChild(toggleBtn);
  }

  private toggleUI(): void {
    this.isUIVisible = !this.isUIVisible;
    if (this.uiContainer) {
      this.uiContainer.style.display = this.isUIVisible ? 'flex' : 'none';
      if (this.isUIVisible) {
        this.updateUI();
      }
    }
  }

  private async renderUI(): Promise<void> {
    await this.renderUI();
  }

  private async updateUI(): Promise<void> {
    if (!this.uiContainer) return;

    // Get metrics from monitors
    const perfMetrics = this.perfMonitor.getMetrics();
    const learningMetrics = await this.learningEngine.getMetrics();

    this.uiContainer.innerHTML = `
      <div class="ai-guard-header">
        <h2>🛡️ AI Guard</h2>
        <button class="close-btn" onclick="aiGuardInstance.toggleUI()">✕</button>
      </div>

      <div class="ai-guard-section">
        <div class="section-title">⚡ Performance Monitor</div>
        <div class="metric-row">
          <span class="metric-label">Connection</span>
          <span class="metric-value">${perfMetrics.connectionSpeed}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">CPU Load</span>
          <span class="metric-value">${perfMetrics.cpuLoad.toFixed(1)}%</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Memory</span>
          <span class="metric-value">${perfMetrics.memoryUsage.toFixed(1)}%</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Frame Rate</span>
          <span class="metric-value">${perfMetrics.frameRate} FPS</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">API Latency</span>
          <span class="metric-value">${perfMetrics.apiLatency.toFixed(0)}ms</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Throttled</span>
          <span class="metric-value">${perfMetrics.isThrottled ? 'Yes' : 'No'}</span>
        </div>
      </div>

      <div class="ai-guard-section">
        <div class="section-title">🧠 Learning Metrics</div>
        <div class="metric-row">
          <span class="metric-label">Total Prompts</span>
          <span class="metric-value">${learningMetrics.totalPrompts}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Safe Prompts</span>
          <span class="metric-value">${learningMetrics.safePrompts}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Suspicious</span>
          <span class="metric-value warning">${learningMetrics.suspiciousPrompts}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Avg Complexity</span>
          <span class="metric-value">${learningMetrics.avgComplexity.toFixed(2)}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Confidence</span>
          <span class="metric-value">${(learningMetrics.confidenceScore * 100).toFixed(0)}%</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Injection Attempts</span>
          <span class="metric-value warning">${learningMetrics.injectionAttempts}</span>
        </div>
      </div>

      <div class="ai-guard-section">
        <div class="section-title">🌐 Top Domains</div>
        <div class="domain-list">
          ${learningMetrics.topDomains.map(d => `
            <div class="domain-item">
              <span class="domain-name">${d.domain}</span>
              <span class="domain-count">${d.count}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="ai-guard-actions">
        <button class="action-btn" onclick="aiGuardInstance.exportData()">📥 Export Data</button>
        <button class="action-btn" onclick="aiGuardInstance.clearData()">🗑️ Clear Data</button>
      </div>
    `;
  }

  private monitorInputs(): void {
    const selector = 'textarea, input[type="text"], [contenteditable="true"]';

    const handleInput = async (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLElement;
      const text = 'value' in target ? target.value : target.textContent || '';

      if (text.length < 3) return;

      // Check for injection patterns
      const injectionResult = this.detectInjection(text);
      if (injectionResult.detected) {
        this.showInjectionWarning(injectionResult.matches);
      }

      // Learn from prompt
      await this.learningEngine.analyzePrompt(text, window.location.hostname);
    };

    // Attach to existing elements
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('input', handleInput);
    });

    // Monitor for new elements
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.matches(selector)) {
              element.addEventListener('input', handleInput);
            }
            element.querySelectorAll(selector).forEach(el => {
              el.addEventListener('input', handleInput);
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

  private detectInjection(text: string): { detected: boolean; matches: string[] } {
    const matches: string[] = [];

    this.compiledPatterns.forEach((regex, id) => {
      if (regex.test(text)) {
        const pattern = this.patterns.find(p => p.id === id);
        if (pattern) {
          matches.push(pattern.name);
        }
      }
    });

    return { detected: matches.length > 0, matches };
  }

  private showInjectionWarning(matches: string[]): void {
    console.warn('[AI Guard] ⚠️ Potential injection detected:', matches);

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'ai-guard-notification warning';
    notification.innerHTML = `
      <strong>⚠️ Warning</strong>
      <p>Potential prompt injection detected:</p>
      <ul>${matches.map(m => `<li>${m}</li>`).join('')}</ul>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => notification.remove(), 5000);
  }

  private setupPromptLearning(): void {
    // This method can be expanded for future prompt learning features
    console.log('[AI Guard] Prompt learning active');
  }

  async exportData(): Promise<void> {
    try {
      const data = await this.learningEngine.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-guard-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      console.log('[AI Guard] Data exported successfully');
    } catch (error) {
      console.error('[AI Guard] Failed to export data:', error);
    }
  }

  async clearData(): Promise<void> {
    if (confirm('Are you sure you want to clear all learning data?')) {
      try {
        await this.learningEngine.clearData();
        await this.repository.clearAll();
        this.updateUI();
        console.log('[AI Guard] Data cleared successfully');
      } catch (error) {
        console.error('[AI Guard] Failed to clear data:', error);
      }
    }
  }
}

// Initialize AI Guard
const aiGuardInstance = new AIGuard();
(window as any).aiGuardInstance = aiGuardInstance;
aiGuardInstance.initialize();

export default AIGuard;
