// Feature #2: Learning Mode Panel (React UI Component)
// Displays prompt learning metrics and pattern analysis

import React, { useState, useEffect } from 'react';
import { PromptLearningEngine, type LearningMetrics } from './prompt-learning-engine';
import { PromptRepository } from './prompt-repository';
import '../styles/learning-mode-panel.css';
interface LearningModePanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export const LearningModePanel: React.FC<LearningModePanelProps> = ({
  isVisible,
  onClose,
}) => {
  const [metrics, setMetrics] = useState<LearningMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportStatus, setExportStatus] = useState<string>('');
  
  const engine = new PromptLearningEngine();
  const repository = new PromptRepository();

  useEffect(() => {
    if (isVisible) {
      loadMetrics();
    }
  }, [isVisible]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await engine.getMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('[LearningModePanel] Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const jsonData = await engine.exportData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-guard-patterns-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportStatus('✓ Data exported successfully!');
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      setExportStatus('✗ Export failed');
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to clear all learning data? This cannot be undone.')) {
      try {
        await engine.clearData();
        await loadMetrics();
        setExportStatus('✓ Data cleared');
        setTimeout(() => setExportStatus(''), 3000);
      } catch (error) {
        setExportStatus('✗ Clear failed');
        setTimeout(() => setExportStatus(''), 3000);
      }
    }
  };

  const getSuspicionColor = (percentage: number): string => {
    if (percentage === 0) return '#4CAF50'; // Green
    if (percentage < 20) return '#8BC34A'; // Light green
    if (percentage < 40) return '#FFC107'; // Yellow
    if (percentage < 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getConfidenceLabel = (score: number): string => {
    if (score < 0.2) return 'Very Low';
    if (score < 0.4) return 'Low';
    if (score < 0.6) return 'Medium';
    if (score < 0.8) return 'High';
    return 'Very High';
  };

  if (!isVisible) return null;

  return (
    <div className="learning-mode-panel-overlay">
      <div className="learning-mode-panel">
        <div className="panel-header">
          <h2>🧠 Learning Mode Analytics</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading analytics...</p>
          </div>
        ) : metrics ? (
          <div className="panel-content">
            {/* Overall Statistics */}
            <section className="metrics-section">
              <h3>Overview</h3>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-value">{metrics.totalPrompts}</div>
                  <div className="metric-label">Total Prompts Analyzed</div>
                </div>
                <div className="metric-card safe">
                  <div className="metric-value">{metrics.safePrompts}</div>
                  <div className="metric-label">Safe Prompts</div>
                </div>
                <div className="metric-card suspicious">
                  <div className="metric-value">{metrics.suspiciousPrompts}</div>
                  <div className="metric-label">Suspicious Prompts</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">
                    {metrics.totalPrompts > 0
                      ? Math.round(
                          (metrics.suspiciousPrompts / metrics.totalPrompts) * 100
                        )
                      : 0}%
                  </div>
                  <div className="metric-label">Suspicion Rate</div>
                </div>
              </div>
            </section>

            {/* Learning Confidence */}
            <section className="metrics-section">
              <h3>Learning Status</h3>
              <div className="confidence-bar-container">
                <div className="confidence-label">
                  Model Confidence: {getConfidenceLabel(metrics.confidenceScore)}
                </div>
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{ width: `${metrics.confidenceScore * 100}%` }}
                  />
                </div>
                <div className="confidence-text">
                  {Math.round(metrics.confidenceScore * 100)}% (based on {metrics.totalPrompts} samples)
                </div>
              </div>
            </section>

            {/* Top Domains */}
            <section className="metrics-section">
              <h3>Top Domains</h3>
              {metrics.topDomains.length > 0 ? (
                <div className="domains-list">
                  {metrics.topDomains.map((domain, idx) => (
                    <div key={idx} className="domain-item">
                      <span className="domain-name">{domain.domain}</span>
                      <span className="domain-count">{domain.count} prompts</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No domain data available</p>
              )}
            </section>

            {/* Complexity Analysis */}
            <section className="metrics-section">
              <h3>Complexity Analysis</h3>
              <div className="complexity-meter">
                <div className="complexity-value">
                  {metrics.avgComplexity.toFixed(2)}
                </div>
                <div className="complexity-description">
                  Average complexity score
                </div>
                <div className="complexity-hint">
                  Higher scores may indicate obfuscation attempts
                </div>
              </div>
            </section>

            {/* Actions */}
            <section className="actions-section">
              <button className="action-button export" onClick={handleExportData}>
                📥 Export Data
              </button>
              <button className="action-button clear" onClick={handleClearData}>
                🗑️ Clear Data
              </button>
              {exportStatus && (
                <div className="action-status">{exportStatus}</div>
              )}
            </section>

            {/* Info Footer */}
            <div className="panel-footer">
              <p>
                💡 <strong>Tip:</strong> The engine learns from each prompt you analyze.
                More data = better detection accuracy.
              </p>
            </div>
          </div>
        ) : (
          <div className="error-state">
            <p>Failed to load metrics. Please try again.</p>
            <button onClick={loadMetrics}>Retry</button>
          </div>
        )}
      </div>
    </div>
  );
};
