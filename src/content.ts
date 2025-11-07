// Prompt Injection Detector Content Script
interface Pattern {
  id: string;
  name: string;
  regex: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

let patterns: Pattern[] = [];

// Load patterns from file
async function loadPatterns(): Promise<void> {
  try {
    const response = await fetch(chrome.runtime.getURL('src/patterns.json'));
    patterns = await response.json();
    console.log('Loaded patterns:', patterns);
  } catch (error) {
    console.error('Failed to load patterns:', error);
  }
}

// Check text for injection patterns
function detectInjection(text: string): { detected: boolean; matches: Array<{ pattern: Pattern; match: string }> } {
  const matches: Array<{ pattern: Pattern; match: string }> = [];
  
  for (const pattern of patterns) {
    const regex = new RegExp(pattern.regex, 'gi');
    const match = regex.exec(text);
    if (match) {
      matches.push({ pattern, match: match[0] });
    }
  }
  
  return { detected: matches.length > 0, matches };
}

// Create warning banner
function createWarningBanner(matches: Array<{ pattern: Pattern; match: string }>): HTMLElement {
  const banner = document.createElement('div');
  banner.className = 'injection-detector-banner';
  banner.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff4444;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
  `;
  
  const title = document.createElement('div');
  title.style.cssText = 'font-weight: bold; margin-bottom: 8px; font-size: 16px;';
  title.textContent = '⚠️ Prompt Injection Detected!';
  banner.appendChild(title);
  
  const details = document.createElement('div');
  details.style.cssText = 'font-size: 13px; line-height: 1.4;';
  
  for (const { pattern, match } of matches) {
    const item = document.createElement('div');
    item.style.cssText = 'margin: 5px 0; padding: 5px; background: rgba(0,0,0,0.2); border-radius: 4px;';
    item.innerHTML = `<strong>${pattern.name}</strong> (${pattern.severity})<br/>Match: "${match}"`;
    details.appendChild(item);
  }
  
  banner.appendChild(details);
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 5px;
    right: 10px;
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  `;
  closeBtn.onclick = () => banner.remove();
  banner.appendChild(closeBtn);
  
  return banner;
}

// Monitor text inputs and textareas
function monitorInputs(): void {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        const inputs = document.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]');
        inputs.forEach((input) => {
          if (!(input as any)._injectionDetectorAttached) {
            (input as any)._injectionDetectorAttached = true;
            input.addEventListener('input', (e) => {
              const target = e.target as HTMLInputElement | HTMLTextAreaElement;
              const text = target.value || (target as HTMLElement).textContent || '';
              
              const result = detectInjection(text);
              if (result.detected) {
                // Remove existing banners
                document.querySelectorAll('.injection-detector-banner').forEach(b => b.remove());
                // Show new banner
                const banner = createWarningBanner(result.matches);
                document.body.appendChild(banner);
                
                // Auto-remove after 10 seconds
                setTimeout(() => banner.remove(), 10000);
              }
            });
          }
        });
      }
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Initial scan
  const inputs = document.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]');
  inputs.forEach((input) => {
    (input as any)._injectionDetectorAttached = true;
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      const text = target.value || (target as HTMLElement).textContent || '';
      
      const result = detectInjection(text);
      if (result.detected) {
        document.querySelectorAll('.injection-detector-banner').forEach(b => b.remove());
        const banner = createWarningBanner(result.matches);
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 10000);
      }
    });
  });
}

// Initialize
loadPatterns().then(() => {
  console.log('Prompt Injection Detector initialized');
  monitorInputs();
});
