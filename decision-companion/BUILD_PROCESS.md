# Build Process

## Day 1: Problem Understanding & Prototype (2026-02-15)

### Goal
Understand the core problem ("AI Decision Companion") and build a functional web application to validate the user flow and basic logic.

### 1. Problem Analysis
- **Core Requirement**: Build a system that helps users make decisions by evaluating options against weighted criteria.
- **Key Constraint**: Logic must be explainable (deterministic math), not just a "black box" AI suggestion. AI should be a *companion* (suggesting criteria, explaining results), not the decision-maker.

### 2. Architecture & Tech Stack
- **Architecture**:
    - **Core Logic**: A standalone `DecisionEngine` class (TypeScript) to handle the weighted sum algorithm. This ensures the math is testable and independent of the UI.
    - **Frontend**: Next.js (App Router) for the web interface.
    - **AI Integration**: A mock service (initially) to simulate AI suggestions for criteria, ensuring the app works even without an API key.
- **Stack Choices**:
    - **Next.js 15+**: For modern routing and server components.
    - **Tailwind CSS v4**: For rapid styling and a modern look.

### 3. Implementation Highlights
- **Core Logic**: Implemented `DecisionEngine.ts` with a Weighted Sum Model (Score = Σ (Option Rating * Criterion Weight)).
- **Basic UI Flow**:
    - **Landing Page**: Introduction and "Start Decision" entry point.
    - **Wizard Steps**:
        1.  **Define Criteria**: Users add factors (e.g., "Price", "Quality") and assign weights (1-10).
        2.  **Add Options**: Users list the choices (e.g., "Product A", "Product B").
        3.  **Rate Options**: Users score each option against each criterion.
        4.  **Results**: A ranked list showing the winner and a breakdown of scores.

### 4. Refinements & Challenges
- **Project Structure**: Initially faced npm naming issues; resolved by creating a scoped `decision-companion` directory.
- **UI Polish**:
    - Transformed a basic "white box" UI into a premium **Glassmorphism** design (Dark mode, mesh gradients, transparent cards).
    - Fixed Tailwind v4 build errors by updating CSS syntax.
    - Refactored base components (`Card`, `Input`) to support transparency and theming.
- **Demo Mode**: Added a "Try Demo Case" feature ("Startup Tech Stack" scenario) to instantly showcase the app's value without manual data entry.

