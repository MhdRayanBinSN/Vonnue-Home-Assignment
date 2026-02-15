# Decision Companion System

A powerful, transparent decision-making tool that helps you evaluate options against weighted criteria. Built with Next.js, Tailwind CSS, and a deterministic scoring engine.

## 🚀 Features

- **Weighted Decision Matrix**: Mathematically sound scoring (Weighted Sum Model).
- **Explainable Results**: Detailed breakdowns of why an option ranked #1.
- **AI-Assisted**: Suggestions for criteria based on your topic (Simulated).
- **Privacy-First**: All decision data stays local in your session.
- **Responsive UI**: Works on desktop and mobile.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## 📂 Project Structure

```bash
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Landing page
│   └── decision/new/     # Wizard page
├── core/                 # Business Logic (Pure TypeScript)
│   ├── DecisionEngine.ts # The scoring algorithm
│   └── types.ts          # Data models
├── components/           # UI Components
│   ├── ui/               # Reusable primitives (Button, Card, Input)
│   └── layout/           # Navbar, Footer
└── features/             # Feature-specific components
    └── decision/         # Wizard steps (Criteria, Options, Ratings)
```

## 🏃‍♂️ How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Running Tests

A manual test script works to verify the core logic:

```bash
npx tsx src/core/test-script.ts
```

## 📜 Documentation

- **[BUILD_PROCESS.md](./BUILD_PROCESS.md)**: A log of design decisions and the development journey.
- **[RESEARCH_LOG.md](./RESEARCH_LOG.md)**: Details on AI usage and research.
