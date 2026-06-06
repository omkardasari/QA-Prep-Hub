# Automation QA Interview Trend Tracker

A full-screen, interactive dashboard for Automation QA interview preparation. Paste interview questions, classify them by current QA hiring trends, track readiness, add notes, star risky questions, and export progress.

## Features

- Trend-based segregation for Automation QA questions
- Interactive prep tracker with `New`, `Studying`, `Revise`, and `Ready` status
- Latest interview focus areas: Playwright, Selenium, API automation, CI/CD, flaky test debugging, AI-assisted QA, cloud/mobile, and risk-based testing
- Readiness score, weak-area detection, trend coverage, and suggested study order
- Target role, company/domain, interview date, and experience-level tracking
- LinkedIn post import by public URL when accessible, or by pasted post text
- Local browser persistence with `localStorage`
- JSON and CSV export for sharing progress
- Dependency-free static app

## Run Locally

Open `index.html` directly in your browser.

```bash
start index.html
```

Or serve it locally:

```bash
npm run serve
```

Then open `http://localhost:4173`.

## LinkedIn Import

Use the LinkedIn panel in the sidebar:

- Paste a public LinkedIn post URL and click `Fetch Link`
- If LinkedIn blocks the request or requires login, paste the post text into the text box and click `Extract Text`
- Extracted questions are added incrementally to the saved tracker
- Duplicate questions are ignored automatically

LinkedIn often limits unauthenticated page access. The pasted-text workflow is the most reliable option.

## GitHub Upload

```bash
git init
git add .
git commit -m "Create automation QA interview tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/automation-qa-interview-tracker.git
git push -u origin main
```

## Suggested Repository Name

`automation-qa-interview-tracker`

## License

MIT
