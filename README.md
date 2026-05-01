# Chunav Mitra — India Election Guide

AI-powered civic education assistant for Indian elections. Built with Next.js 15, React 19, Google GenAI, and next-intl.

## Features

- **9-Step Electoral Journey** — from "What is an Election?" to "Government Formation"
- **Persona-Based Learning** — Student, First-Time Voter, General/Elderly Citizen
- **Gamified Quizzes** — earn points and badges for completing steps
- **EVM Simulator** — high-fidelity mock voting with VVPAT 7-second verification
- **AI Chatbot (Chunav Mitra)** — Google GenAI with political neutrality guardrails
- **Multilingual** — English, Hindi, Gujarati (scalable to all 22 official languages)
- **Accessibility** — WCAG 2.1 AA compliant, voice narration, large text, high contrast
- **Voter Verification** — EPIC number lookup via ECI API Setu

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| State | Zustand (persisted) |
| Forms | React Hook Form + Zod |
| i18n | next-intl |
| AI | Google GenAI SDK (Gemini 2.0 Flash) |
| Deployment | Vercel |

## Project Structure

```
frontend/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              # Locale provider
│   │   ├── page.tsx                # Persona selector
│   │   ├── journey/
│   │   │   ├── layout.tsx          # Progress bar + accessibility toolbar
│   │   │   └── [step]/page.tsx     # Dynamic step renderer
│   │   ├── simulator/page.tsx      # EVM simulator
│   │   └── verify/page.tsx         # Voter ID verification
│   └── api/
│       ├── chat/route.ts           # Google GenAI chatbot
│       └── verify-voter/route.ts   # ECI API proxy
├── components/
│   ├── journey/
│   │   ├── PersonaSelector.tsx
│   │   ├── TimelineSlider.tsx
│   │   ├── StepCard.tsx
│   │   ├── GamifiedQuiz.tsx
│   │   └── steps/                  # Step1–Step9 components
│   ├── simulator/
│   │   ├── EVMSimulator.tsx
│   │   ├── ControlUnit.tsx
│   │   ├── BallotingUnit.tsx
│   │   └── VVPATDisplay.tsx
│   ├── chatbot/
│   │   ├── ChunавMitraFAB.tsx
│   │   ├── ChatWindow.tsx
│   │   └── MessageBubble.tsx
│   ├── accessibility/
│   │   ├── AccessibilityToolbar.tsx
│   │   └── VoiceNarration.tsx
│   └── VoterVerifyForm.tsx
├── context/
│   └── journeyStore.ts             # Zustand global state
├── lib/
│   ├── utils.ts
│   ├── validators.ts               # Zod schemas
│   ├── eci-apis.ts                 # ECI API client
│   └── chatbot-config.ts           # Google GenAI config + guardrails
├── messages/
│   ├── en.json
│   ├── hi.json
│   └── gu.json
├── i18n.ts                         # next-intl config
├── middleware.ts                   # Locale detection
└── .env.local                      # API keys (never commit)
```

## Setup

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create `.env.local`:

```env
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
ECI_API_KEY=your_eci_api_key
ECI_API_BASE_URL=https://api.apisetu.gov.in
```

Get keys:
- Google GenAI: https://aistudio.google.com/app/apikey
- ECI API Setu: https://www.apisetu.gov.in

### Development

```bash
npm run dev
```

Open http://localhost:3000

### Build

```bash
npm run build
npm start
```

### Testing

```bash
npm test              # Vitest unit tests
npm run test:e2e      # Playwright E2E tests
```

## Architecture Highlights

### Multilingual Routing

- Middleware detects `Accept-Language` header
- Auto-redirects to `/en`, `/hi`, or `/gu`
- Translation files lazy-loaded per step

### State Management

- Zustand store persisted to localStorage
- Tracks: persona, currentStep, stepXp, totalXp, level, badges, accessibilityPrefs
- No prop drilling — global access via `useJourneyStore()`

### Accessibility

- Semantic HTML (`<main>`, `<nav>`, `<section>`)
- ARIA live regions for dynamic content
- 44×44px minimum touch targets
- Voice narration via Web Speech API (language-aware)
- CSS data attributes for large text and high contrast modes

### Chatbot Neutrality

Two-layer guardrail:
1. **Client-side regex pre-filter** — biased queries return hardcoded neutral response without hitting the model
2. **Server-side system prompt** — instructs Gemini to remain strictly neutral and cite ECI sources

### EVM Simulator

State machine: `idle → ballot-released → vote-cast → vvpat → complete`

- 7-second VVPAT countdown with Web Audio API beep
- Animated slip drop into sealed box
- Security facts overlay post-vote

## Deployment

### Google Cloud Run (Recommended)

The easiest way to deploy this application is using Google Cloud Run's continuous deployment from a GitHub repository:

1. Connect your GitHub repository to Google Cloud Run.
2. Select **Dockerfile** as the build type.
3. Add your `GEMINI_API_KEY` and `ECI_API_KEY` in the "Variables & Secrets" section.
4. Cloud Run will automatically build and deploy your application on every push to the main branch.

### Manual Docker Deployment

You can also manually build and deploy the optimized standalone Next.js image:

```bash
docker build -t chunav-mitra .
docker run -p 3000:3000 -e GOOGLE_GENAI_API_KEY=your_key chunav-mitra
```

## Roadmap

- [ ] Add remaining 19 official languages
- [ ] Integrate real ECI ERONET API (currently mock)
- [ ] PWA support for offline access
- [ ] SMS-based voter registration reminders
- [ ] Admin dashboard for SVEEP officers

## License

MIT

## Credits

Built for the Election Commission of India's SVEEP initiative.
