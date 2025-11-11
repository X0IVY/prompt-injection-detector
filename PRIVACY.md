# Privacy Policy

## Overview

The Prompt Injection Detector extension is designed with **privacy-first principles**. This document explains what data we collect (spoiler: almost nothing), how we process it, and your rights.

**TL;DR:** All processing happens locally in your browser. We don't collect, store, or transmit your data to any servers.

## Data Collection

### What We DO NOT Collect

❌ **We DO NOT collect or transmit:**
- Your chat conversations or prompts
- Usernames, passwords, or authentication tokens
- Personal identifying information (PII)
- Browsing history or URLs visited
- Any data to external servers or analytics services
- Telemetry, usage statistics, or crash reports
- IP addresses or device fingerprints

### What We DO Process (Locally Only)

✅ **Local processing only:**
- **Input text analysis**: Your prompts are scanned locally in your browser against pattern databases
- **Detection results**: Matched patterns are highlighted in the UI
- **Extension preferences**: Settings like enabled/disabled state are stored in browser local storage

All of this happens **entirely on your device**. No network requests are made.

## Data Storage

### Browser Local Storage

The extension uses Chrome's `chrome.storage.local` API to store:

- **User preferences**: Extension on/off state, UI settings
- **Pattern database**: Detection rules (bundled with extension, no external fetch)
- **Detection history** (optional, if enabled): Recent detections for your review

**Storage location:** Your browser's local storage (managed by Chrome)
**Retention:** Until you uninstall the extension or clear browser data
**Access:** Only this extension can access its storage (isolated per Chrome's security model)

### No Cloud Sync

We do **not** use Chrome Sync or any cloud storage. Your data stays on your device.

## Data Processing

### How Detection Works

1. You type a message in ChatGPT, Claude, or another AI interface
2. The extension reads the input field content (content script)
3. Pattern matching is performed **locally** using regex and keyword search
4. If a match is found, an overlay is displayed with the detection details
5. No data leaves your browser at any point

### Third-Party Services

**We use ZERO third-party services.** No:
- Analytics (Google Analytics, Mixpanel, etc.)
- Error tracking (Sentry, Rollbar, etc.)
- CDNs for code or resources
- External APIs or servers

## Permissions Explained

### Extension Permissions

The extension requests minimal permissions:

| Permission | Purpose | Privacy Impact |
|-----------|---------|----------------|
| `activeTab` | Read content from AI chat pages | Only active when you visit supported sites (ChatGPT, Claude, Gemini) |
| `storage` | Save user preferences locally | Data stored only on your device |

**No other permissions requested.** We don't need:
- `tabs` (can't see your tab history)
- `webRequest` (can't intercept network traffic)
- `cookies` (can't read your login sessions)
- `<all_urls>` (only works on specific AI sites)

### What We Can and Cannot Access

✅ **We CAN access:**
- Content on AI chat interface pages (only when the tab is active)
- Text you type in message input fields (for pattern detection)

❌ **We CANNOT access:**
- Your passwords or login credentials
- Other browser tabs or windows
- Your files or system information
- Network requests or responses
- Data from other extensions

## Data Sharing

**We do not share data with anyone, because we don't collect it.**

- No selling of data
- No sharing with advertisers
- No analytics partners
- No government or law enforcement data requests (nothing to provide)

## User Rights

### Your Control

- **Disable anytime**: Turn off the extension from Chrome's extension manager
- **Uninstall**: Remove the extension to delete all local storage
- **Clear data**: Use Chrome's "Clear browsing data" to remove extension storage
- **Review code**: This is open-source software - audit the code on GitHub

### GDPR & CCPA Compliance

Since we don't collect personal data:
- **Right to access**: No data to access
- **Right to deletion**: Uninstalling removes all local data
- **Right to portability**: No data to export
- **Right to object**: Not applicable (no processing of personal data)

**Data Controller:** There is no data controller because no personal data is collected or processed beyond your local browser.

## Children's Privacy

This extension does not knowingly collect data from anyone, including children under 13. Since all processing is local, there are no special considerations for minors.

## Security

### How We Protect Your Data

- **No transmission**: Data never leaves your device
- **Isolated storage**: Chrome's security model prevents other extensions/sites from accessing our storage
- **No remote code**: All JavaScript is bundled; no eval() or remote script loading
- **Content Security Policy**: Strict CSP prevents XSS attacks
- **Manifest V3**: Uses the latest, most secure Chrome extension standard

### What You Should Do

1. **Install from official sources**: GitHub releases or Chrome Web Store only
2. **Keep updated**: Install updates for security fixes
3. **Review permissions**: Check that requested permissions haven't changed
4. **Report issues**: See SECURITY.md for vulnerability reporting

## Updates to This Policy

We may update this privacy policy if:
- Extension features change
- New data processing is added (will be opt-in)
- Legal requirements change

**Notification method:** Updates will be posted on GitHub and in release notes. Major changes will prompt a notification in the extension.

## Transparency & Open Source

This extension is **open-source**. You can:
- Review all code on GitHub: [github.com/X0IVY/prompt-injection-detector](https://github.com/X0IVY/prompt-injection-detector)
- Audit data handling practices
- Build from source to verify no hidden data collection
- Contribute improvements via pull requests

## Future Features (Privacy-Preserving)

If we add new features, we commit to:
- **Opt-in only**: New data processing will require explicit user consent
- **Privacy by design**: Default to most private option
- **No breaking privacy promises**: Core principle of local-only processing will not change
- **Transparency**: Open-source code for all features

### Potential Future Features

- [ ] **Anonymous telemetry (opt-in)**: Aggregate pattern detection stats (no prompts, only pattern IDs)
- [ ] **Cloud pattern updates (opt-in)**: Fetch updated detection rules from a public, auditable source
- [ ] **Detection history export**: Let users export their local detection history

All of these would be **optional** and clearly labeled in settings.

## Contact & Questions

For privacy concerns:
- **GitHub Issues**: [Open an issue](https://github.com/X0IVY/prompt-injection-detector/issues)
- **Email**: Contact repository owner via GitHub profile
- **Security issues**: See SECURITY.md for responsible disclosure

## Legal

**Effective Date:** November 11, 2025  
**Last Updated:** November 11, 2025  
**Version:** 1.0

**Governing Law:** This policy is governed by the laws of the jurisdiction where the developer resides. Since no data is collected, there are minimal legal implications.

---

## Summary (Plain English)

**What this extension does with your data:**
- Reads your AI chat input to check for prompt injection patterns
- Stores your extension settings on your computer
- That's it. Nothing is sent anywhere.

**What this extension doesn't do:**
- Upload your conversations
- Track you
- Show you ads
- Sell your data
- Phone home to any server

**How to delete all data:**
Uninstall the extension. Done.

**Can I trust this?**
The code is open-source. Review it yourself or ask someone technical to check it.

---

**Questions?** Open an issue on GitHub or contact the maintainer.
