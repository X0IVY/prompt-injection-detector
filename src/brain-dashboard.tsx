/**
 * AI Guard - Brain Dashboard (Optimized)
 * Optimized visual dashboard with lazy loading, debouncing, and memoization
 */

import { h, Component } from 'preact';
import { useMemo, useCallback } from 'preact/compat';
import { BrainTracker } from './brain-tracker';

interface BrainDashboardProps {
  tracker: BrainTracker;
}

interface BrainDashboardState {
  state: any;
  isExpanded: boolean;
  userIsActive: boolean;
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: number | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}

class BrainDashboard extends Component<BrainDashboardProps, BrainDashboardState> {
  private updateInterval: number | null = null;
  private pollInterval: number = 500; // Dynamic polling interval

  constructor(props: BrainDashboardProps) {
    super(props);
    this.state = {
      state: props.tracker.getSimpleState(),
      isExpanded: false,
      userIsActive: true
    };
  }

  componentDidMount() {
    // Set up dynamic polling based on user activity
    this.startPolling();
    
    // Listen for focus/blur events to adjust polling
    window.addEventListener('focus', this.handleFocus);
    window.addEventListener('blur', this.handleBlur);
  }

  componentWillUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    window.removeEventListener('focus', this.handleFocus);
    window.removeEventListener('blur', this.handleBlur);
  }

  handleFocus = () => {
    this.setState({ userIsActive: true });
    this.pollInterval = 500;
    this.restartPolling();
  };

  handleBlur = () => {
    this.setState({ userIsActive: false });
    this.pollInterval = 2000; // Slow down when inactive
    this.restartPolling();
  };

  startPolling = () => {
    this.updateInterval = window.setInterval(() => {
      // Only update if expanded to save resources
      if (this.state.isExpanded) {
        this.updateState();
      }
    }, this.pollInterval);
  };

  restartPolling = () => {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.startPolling();
  };

  // Debounced state update to prevent excessive re-renders
  updateState = debounce(() => {
    this.setState({
      state: this.props.tracker.getSimpleState()
    });
  }, 300);

  toggleExpanded = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  render() {
    const { state, isExpanded } = this.state;

    return (
      <div className="ai-guard-brain-dashboard">
        <div className="brain-header" onClick={this.toggleExpanded}>
          <span className="brain-icon">🧠</span>
          <span className="brain-title">AI Brain Monitor</span>
          <span className="brain-toggle">{isExpanded ? '▼' : '▶'}</span>
        </div>

        {isExpanded && (
          <div className="brain-content">
            {/* Memory Section */}
            <MemorySection state={state} />

            {/* Context Section */}
            <ContextSection state={state} />

            {/* Reasoning Section */}
            <ReasoningSection state={state} />

            {/* Attention Section */}
            <AttentionSection state={state} />

            {/* Emotional Section */}
            <EmotionalSection state={state} />
          </div>
        )}
      </div>
    );
  }
}

// Memoized Section Components - only re-render when their data changes

const MemorySection = ({ state }: { state: any }) => {
  const memoryMetrics = useMemo(
    () => ({
      pressure: state.memory.pressure,
      forgotten: state.memory.forgotten,
      shortTermSize: state.memory.shortTermSize
    }),
    [state.memory.pressure, state.memory.forgotten, state.memory.shortTermSize]
  );

  return (
    <div className="brain-section">
      <div className="section-header">💾 Memory</div>
      <div className="section-content">
        <MetricRow
          label="Pressure"
          value={memoryMetrics.pressure}
          warning={parseInt(memoryMetrics.pressure) > 70}
        />
        <MetricRow
          label="Forgotten Items"
          value={memoryMetrics.forgotten}
          warning={memoryMetrics.forgotten > 0}
        />
        <MetricRow
          label="Active Memory"
          value={`${memoryMetrics.shortTermSize} messages`}
        />
      </div>
    </div>
  );
};

const ContextSection = ({ state }: { state: any }) => {
  const contextMetrics = useMemo(
    () => ({
      drift: state.context.drift,
      tokenWindow: state.context.tokenWindow,
      topics: state.context.topics
    }),
    [state.context.drift, state.context.tokenWindow, state.context.topics]
  );

  return (
    <div className="brain-section">
      <div className="section-header">🎯 Context</div>
      <div className="section-content">
        <MetricRow
          label="Drift"
          value={contextMetrics.drift}
          warning={parseInt(contextMetrics.drift) > 50}
        />
        <MetricRow label="Token Window" value={contextMetrics.tokenWindow} />
        <div className="metric-row">
          <span className="metric-label">Focused On:</span>
          <span className="metric-value">
            {contextMetrics.topics.length > 0
              ? contextMetrics.topics.join(', ')
              : 'Nothing specific'}
          </span>
        </div>
      </div>
    </div>
  );
};

const ReasoningSection = ({ state }: { state: any }) => {
  const reasoningMetrics = useMemo(
    () => ({
      confidence: state.reasoning.confidence,
      uncertaintyLevel: state.reasoning.uncertaintyLevel,
      hallucinations: state.reasoning.hallucinations,
      corrections: state.reasoning.corrections
    }),
    [
      state.reasoning.confidence,
      state.reasoning.uncertaintyLevel,
      state.reasoning.hallucinations,
      state.reasoning.corrections
    ]
  );

  return (
    <div className="brain-section">
      <div className="section-header">🤔 Reasoning</div>
      <div className="section-content">
        <MetricRow
          label="Confidence"
          value={reasoningMetrics.confidence}
          warning={parseInt(reasoningMetrics.confidence) < 50}
        />
        <MetricRow
          label="Uncertainty Markers"
          value={reasoningMetrics.uncertaintyLevel}
          warning={reasoningMetrics.uncertaintyLevel > 3}
        />
        <MetricRow
          label="Hallucinations"
          value={reasoningMetrics.hallucinations}
          warning={reasoningMetrics.hallucinations > 0}
          critical={reasoningMetrics.hallucinations > 2}
        />
        <MetricRow
          label="Self-Corrections"
          value={reasoningMetrics.corrections}
        />
      </div>
    </div>
  );
};

const AttentionSection = ({ state }: { state: any }) => {
  const attentionMetrics = useMemo(
    () => ({
      focus: state.attention.focus,
      distractions: state.attention.distractions,
      focusedOn: state.attention.focusedOn
    }),
    [
      state.attention.focus,
      state.attention.distractions,
      state.attention.focusedOn
    ]
  );

  return (
    <div className="brain-section">
      <div className="section-header">👁️ Attention</div>
      <div className="section-content">
        <MetricRow
          label="Focus Score"
          value={attentionMetrics.focus}
          warning={parseInt(attentionMetrics.focus) < 50}
        />
        <MetricRow
          label="Distractions"
          value={attentionMetrics.distractions}
          warning={attentionMetrics.distractions > 2}
        />
        <div className="metric-row">
          <span className="metric-label">Paying Attention To:</span>
          <span className="metric-value">
            {attentionMetrics.focusedOn.length > 0
              ? attentionMetrics.focusedOn.join(', ')
              : 'Nothing'}
          </span>
        </div>
      </div>
    </div>
  );
};

const EmotionalSection = ({ state }: { state: any }) => {
  const emotionalMetrics = useMemo(
    () => ({
      tone: state.emotional.tone,
      toneShift: state.emotional.toneShift,
      stress: state.emotional.stress
    }),
    [state.emotional.tone, state.emotional.toneShift, state.emotional.stress]
  );

  return (
    <div className="brain-section">
      <div className="section-header">😊 Emotional State</div>
      <div className="section-content">
        <MetricRow label="Tone" value={emotionalMetrics.tone} />
        <MetricRow
          label="Tone Shift"
          value={emotionalMetrics.toneShift}
          warning={emotionalMetrics.toneShift === 'Yes'}
        />
        <MetricRow
          label="Stress Level"
          value={emotionalMetrics.stress}
          warning={parseInt(emotionalMetrics.stress) > 50}
          critical={parseInt(emotionalMetrics.stress) > 75}
        />
      </div>
    </div>
  );
};

// Memoized Metric Row Component
interface MetricRowProps {
  label: string;
  value: string | number;
  warning?: boolean;
  critical?: boolean;
}

const MetricRow = ({ label, value, warning, critical }: MetricRowProps) => {
  const className = useMemo(() => {
    let cn = 'metric-row';
    if (critical) cn += ' critical';
    else if (warning) cn += ' warning';
    return cn;
  }, [warning, critical]);

  return (
    <div className={className}>
      <span className="metric-label">{label}:</span>
      <span className="metric-value">{value}</span>
      {(warning || critical) && <span className="metric-alert">⚠️</span>}
    </div>
  );
};

export default BrainDashboard;
export { BrainDashboard };
