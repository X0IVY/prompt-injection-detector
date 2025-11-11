# changelog

tracking changes here so i don't forget what i did lol

## [unreleased]

## [v2.0.0] - THE BIG PIVOT - 2025-11-11

okay so i realized the whole "detect injection in user input" thing was fundamentally broken. here's what happened:

### why i pivoted

**the problem with v1.0**:
- attackers can just rephrase their injection and bypass detection
- tons of false positives from legitimate weird queries
- always playing catch-up with new attack patterns
- doesn't actually protect you, just annoys you

basically i built something that looked cool but didn't actually work in practice.

### the new approach (v2.0)

**now monitoring AI RESPONSES instead of user inputs**

this is way smarter because:
- catches attacks that actually succeeded (not just attempts)
- can't be bypassed by rephrasing
- way fewer false positives
- works on zero-day attacks

### what's changing

#### BREAKING CHANGES
- complete rewrite of detection engine
- now monitors AI response containers instead of input fields  
- patterns file changing from "injection attempts" to "suspicious behaviors"
- new alert system focuses on AI behavioral anomalies

#### new detection capabilities
- behavioral anomaly detection (tone shifts, style changes)
- hidden instruction following detection
- data exfiltration monitoring
- prompt leakage detection
- role confusion detection
- suspicious output pattern matching

#### architectural changes
- response monitoring instead of input scanning
- conversation context tracking
- multi-turn attack detection
- behavioral baseline learning

### implementation status

🚧 **currently refactoring** 🚧

- [x] updated README with new direction
- [x] documented why this approach is better
- [ ] refactored content script for response monitoring
- [ ] new pattern database for response analysis
- [ ] behavioral anomaly detection
- [ ] context-aware alerting
- [ ] multi-turn attack tracking

### notes to self

- this is the right direction even if it means rewriting everything
- v1.0.0 stays as "last stable input-scanning version"
- v2.0.0 will be way more useful in practice
- need to update all docs and examples
- maybe rename the extension to "AI Guard" or something

### migration guide

if you were using v1.0.0:
- it's still there, just checkout the v1.0.0 tag
- v2.0.0 is completely different - not a drop-in replacement
- the new approach is way better though, trust me

---



### added
- security documentation (SECURITY.md, PRIVACY.md)
- dependabot for auto dependency updates  
- codeql security scanning
- github security advisories enabled

### todo
- [ ] actual tests (need to set up vitest)
- [ ] severity scoring in the UI
- [ ] better pattern matching (maybe ML?)
- [ ] release signing

## [v1.0.0] - initial release - 2025-11-11

first "real" version that actually works and isn't just me testing stuff

### added
- content script that detects prompt injection patterns
- real-time scanning of text inputs
- warning banners when sketchy patterns detected
- pattern database with common attacks (role-playing, DAN, jailbreaks, etc)
- works on chatgpt, claude, gemini

### changed
- optimized performance (was super slow before)
- pre-compiled regex patterns instead of compiling on every check
- added debouncing so it doesn't spam checks every keystroke
- better dom mutation observer

### fixed
- memory leaks from banner timeouts
- regex patterns that were matching literally everything
- removed some test code i accidentally left in lol

## earlier commits

before this i was just experimenting and breaking things. highlights:

- nov 7: figured out vite + preact + crx plugin
- nov 7: spent way too long trying to get tailwind working (gave up, just using vanilla css)
- nov 7: eslint and prettier setup
- nov 7: rewrote the detection logic like 3 times until it worked
- nov 7: initial patterns.json with attacks i found online

## notes to self

- remember to test on actual chatgpt before releasing
- check if the extension works in incognito
- maybe add a settings page?
- people will probably want to customize severity levels
- need better docs for contributing

---

format inspired by [keep a changelog](https://keepachangelog.com/)
