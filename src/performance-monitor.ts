/**
 * AI Guard - Performance Monitor
 * Tracks browser/device resource usage to distinguish between LLM issues and technical problems
 */

// Performance metrics interface
interface PerformanceMetrics {
  connectionSpeed: 'excellent' | 'good' | 'poor' | 'critical';
  cpuLoad: number; // 0-100
  memoryUsage: number; // % of available
  frameRate: number; // dashboard rendering FPS
  apiLatency: number; // time between request/response
  isThrottled: boolean; // detecting if browser is throttling
}

interface PerformanceWarning {
  severity: 'info' | 'warning' | 'critical';
  message: string;
  recommendation: string;
  metric: keyof PerformanceMetrics;
}

interface PerformanceHistory {
  timestamp: number;
  metrics: PerformanceMetrics;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private history: PerformanceHistory[] = [];
  private maxHistorySize = 120; // Store 60 seconds at 500ms intervals
  private lastFrameTime: number = performance.now();
  private frameCount = 0;
  private lastApiCallTime: number | null = null;
  
  constructor() {
    this.metrics = this.initializeMetrics();
    this.startMonitoring();
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      connectionSpeed: 'excellent',
      cpuLoad: 0,
      memoryUsage: 0,
      frameRate: 60,
      apiLatency: 0,
      isThrottled: false
    };
  }

  // Start continuous monitoring
  private startMonitoring(): void {
    // Update metrics every 500ms
    setInterval(() => {
      this.updateMetrics();
      this.storeHistory();
    }, 500);

    // Monitor frame rate
    this.monitorFrameRate();
  }

  // Update all performance metrics
  private updateMetrics(): void {
    this.updateConnectionSpeed();
    this.updateMemoryUsage();
    this.updateCPULoad();
    this.detectThrottling();
  }

  // Monitor network connection speed
  private updateConnectionSpeed(): void {
    // @ts-expect-error - NetworkInformation API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      const downlink = connection.downlink; // Mbps
      const effectiveType = connection.effectiveType;
      
      if (effectiveType === '4g' && downlink > 5) {
        this.metrics.connectionSpeed = 'excellent';
      } else if (effectiveType === '4g' || (effectiveType === '3g' && downlink > 1)) {
        this.metrics.connectionSpeed = 'good';
      } else if (downlink < 1 && downlink > 0.5) {
        this.metrics.connectionSpeed = 'poor';
      } else {
        this.metrics.connectionSpeed = 'critical';
      }
    } else {
      // Fallback if API not available
      this.metrics.connectionSpeed = 'good';
    }
  }

  // Monitor memory usage
  private updateMemoryUsage(): void {
    // @ts-expect-error - Memory API
    if (performance.memory) {
      // @ts-expect-error
      const usedJSHeapSize = performance.memory.usedJSHeapSize;
      // @ts-expect-error
      const jsHeapSizeLimit = performance.memory.jsHeapSizeLimit;
      
      this.metrics.memoryUsage = (usedJSHeapSize / jsHeapSizeLimit) * 100;
    } else {
      // Estimate based on device memory
//      const deviceMemory = (navigator as any).deviceMemory || 4; // GB
      // Rough estimate: assume we're using reasonable amount
      this.metrics.memoryUsage = 50; // Default to moderate usage
    }
  }

  // Estimate CPU load
  private updateCPULoad(): void {
    // CPU load estimation using task duration
    const startTime = performance.now();
    
    // Perform a calibrated computation
    //let sum = 0;
    for (let i = 0; i < 100000; i++) {
//      sum += Math.sqrt(i);
    }
    
    const duration = performance.now() - startTime;
    
    // Normalize: <5ms = low load, >50ms = high load
    this.metrics.cpuLoad = Math.min(100, (duration / 50) * 100);
  }

  // Detect browser throttling
  private detectThrottling(): void {
    // Check if frame rate is below threshold and memory/CPU are fine
    const isLowFrameRate = this.metrics.frameRate < 30;
    const hasGoodResources = this.metrics.memoryUsage < 70 && this.metrics.cpuLoad < 70;
    
    this.metrics.isThrottled = isLowFrameRate && hasGoodResources;
  }

  // Monitor frame rate using requestAnimationFrame
  private monitorFrameRate(): void {
    const measureFrame = () => {
      const currentTime = performance.now();
      this.frameCount++;
      
      // Calculate FPS every second
      if (currentTime >= this.lastFrameTime + 1000) {
        this.metrics.frameRate = Math.round(
          (this.frameCount * 1000) / (currentTime - this.lastFrameTime)
        );
        this.frameCount = 0;
        this.lastFrameTime = currentTime;
      }
      
      requestAnimationFrame(measureFrame);
    };
    
    requestAnimationFrame(measureFrame);
  }

  // Track API call timing
  public startApiCall(): void {
    this.lastApiCallTime = performance.now();
  }

  public endApiCall(): void {
    if (this.lastApiCallTime) {
      this.metrics.apiLatency = performance.now() - this.lastApiCallTime;
      this.lastApiCallTime = null;
    }
  }

  // Store metrics in history
  private storeHistory(): void {
    this.history.push({
      timestamp: Date.now(),
      metrics: { ...this.metrics }
    });
    
    // Keep only last N entries
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  // Get current metrics
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Get performance history
  public getHistory(): PerformanceHistory[] {
    return [...this.history];
  }

  // Get active warnings
  public getWarnings(): PerformanceWarning[] {
    const warnings: PerformanceWarning[] = [];

    // Connection speed warnings
    if (this.metrics.connectionSpeed === 'poor') {
      warnings.push({
        severity: 'warning',
        message: 'Slow connection detected',
        recommendation: 'LLM response delays may be due to network, not model issues',
        metric: 'connectionSpeed'
      });
    } else if (this.metrics.connectionSpeed === 'critical') {
      warnings.push({
        severity: 'critical',
        message: 'Very slow connection',
        recommendation: 'Consider switching to a faster network for better performance',
        metric: 'connectionSpeed'
      });
    }

    // Memory warnings
    if (this.metrics.memoryUsage > 80) {
      warnings.push({
        severity: 'warning',
        message: 'High memory usage detected',
        recommendation: 'Dashboard may lag. Consider closing unused tabs.',
        metric: 'memoryUsage'
      });
    }

    // CPU warnings
    if (this.metrics.cpuLoad > 85) {
      warnings.push({
        severity: 'warning',
        message: 'High CPU load detected',
        recommendation: 'Close resource-intensive tabs for smoother experience',
        metric: 'cpuLoad'
      });
    }

    // Frame rate warnings
    if (this.metrics.frameRate < 30) {
      warnings.push({
        severity: 'info',
        message: 'Low frame rate detected',
        recommendation: 'UI performance may be degraded',
        metric: 'frameRate'
      });
    }

    // API latency warnings
    if (this.metrics.apiLatency > 5000) {
      warnings.push({
        severity: 'warning',
        message: 'High API latency',
        recommendation: 'Delays are network-related, not LLM processing issues',
        metric: 'apiLatency'
      });
    }

    // Throttling warnings
    if (this.metrics.isThrottled) {
      warnings.push({
        severity: 'info',
        message: 'Browser throttling detected',
        recommendation: 'Tab may be backgrounded or browser is conserving resources',
        metric: 'isThrottled'
      });
    }

    return warnings;
  }

  // Get overall performance status
  public getPerformanceStatus(): 'excellent' | 'good' | 'degraded' | 'poor' {
    const warnings = this.getWarnings();
    
    if (warnings.some(w => w.severity === 'critical')) {
      return 'poor';
    } else if (warnings.filter(w => w.severity === 'warning').length >= 2) {
      return 'degraded';
    } else if (warnings.length > 0) {
      return 'good';
    } else {
      return 'excellent';
    }
  }

  // Suggest update frequency based on performance
  public getSuggestedUpdateInterval(): number {
    const status = this.getPerformanceStatus();
    
    switch (status) {
      case 'excellent':
      case 'good':
        return 500; // 500ms - normal
      case 'degraded':
        return 1000; // 1s - slower
      case 'poor':
        return 2000; // 2s - much slower
      default:
        return 500;
    }
  }

  // Export performance report
  public exportReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      currentMetrics: this.metrics,
      performanceStatus: this.getPerformanceStatus(),
      warnings: this.getWarnings(),
      history: this.history,
      deviceInfo: {
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: (navigator as any).deviceMemory,
        userAgent: navigator.userAgent
      }
    };
    
    return JSON.stringify(report, null, 2);
  }
}

export default PerformanceMonitor;
export { PerformanceMetrics, PerformanceWarning, PerformanceHistory, PerformanceMonitor };
