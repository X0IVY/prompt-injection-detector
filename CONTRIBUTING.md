# contributing to ai-guard

hey! thanks for wanting to contribute 😊

this is still pretty small but hoping to make it useful. whether you're reporting bugs, suggesting features, or submitting code, appreciate it.

## quick start

if you want to contribute code:

1. fork the repo
2. create a branch for your changes (`git checkout -b feature/your-feature-name`)
3. make your changes
4. test everything locally (load the extension in developer mode)
5. commit with a clear message
6. push to your fork
7. open a PR

## what to work on

check the [issues](https://github.com/X0IVY/ai-guard/issues) tab for things that need work. i try to tag things as `good first issue` if they're beginner-friendly.

some areas that could use help:

- **tracking accuracy**: improving how we measure memory/context/confidence
- **performance**: making the content script faster
- **UI/UX**: the dashboard could be prettier
- **testing**: we need way more test coverage
- **documentation**: always room for better docs
- **platform support**: add support for more AI chat platforms

## code style

trying to keep things consistent:

- TypeScript for all source code
- ESLint config is in the repo - please follow it
- use meaningful variable names
- add comments for complex logic
- keep functions small and focused

i'm not super strict about style as long as the code is readable and maintainable.

## testing

right now testing is pretty manual (i know, i know). if you're adding new features:

1. test on multiple AI chat sites (ChatGPT, Claude, etc)
2. check that tracking works correctly
3. make sure you're not breaking existing functionality
4. verify performance is still good

i'm working on adding automated tests soon. if you want to help with that, please do!

## submitting issues

### bugs

if you found a bug:

- describe what happened vs what you expected
- include steps to reproduce
- mention which browser and AI chat site
- screenshots help a lot

### feature requests

for new features:

- explain the use case
- describe how it should work
- mention if you're willing to implement it

i'm pretty open to new ideas as long as they fit the project's goals.

## pull request guidelines

when submitting a PR:

- **clear title**: describe what the PR does
- **description**: explain the changes and why
- **reference issues**: link to related issues if any
- **small PRs**: easier to review than huge changes
- **test your code**: make sure it actually works

don't worry about making everything perfect on the first try. happy to work with you to get PRs ready to merge.

## security issues

if you find a security vulnerability, please DON'T open a public issue. instead:

- use GitHub's private vulnerability reporting
- or email me (check SECURITY.md)

i take security seriously and will respond quickly.

## code of conduct

basic rules:

- be respectful and professional
- no harassment or discrimination
- focus on constructive feedback
- assume good intentions

basically: don't be a jerk. we're all here to build cool stuff.

## questions?

if you're unsure about something:

- open an issue with your question
- tag it as "question"
- i'll try to respond quickly

there are no stupid questions. if something's unclear, that's on me for not documenting it well enough.

## license

by contributing, you agree that your contributions will be licensed under the MIT License (same as the project).

thanks for contributing! even small PRs and bug reports help.
