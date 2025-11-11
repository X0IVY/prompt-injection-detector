# changelog

tracking changes here so i don't forget what i did lol

## [unreleased]

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
