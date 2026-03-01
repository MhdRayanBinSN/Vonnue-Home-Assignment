# Decision Companion System

**Live Demo:** [https://descioncompanionsystem.netlify.app/](https://descioncompanionsystem.netlify.app/)

A mathematically rigorous yet user-friendly Multi-Criteria Decision Analysis (MCDM) tool. 
Built as a take-home assignment to demonstrate architectural thinking, practical problem structuring, and responsible AI integration.

---

## 1. Source Code & Repository Structure
The system is built on **Next.js (App Router), React, and TypeScript**, utilizing Tailwind CSS v4 for styling. 

- `src/components/`: The wizard UI layers (Options, Criteria, Scoring, Results).
- `src/lib/decision-engine.ts`: The mathematical core (Strategy Pattern implementing WSM & TOPSIS).
- `src/lib/context.tsx`: Client-side state management handling the complex multi-step user flow.
- `src/app/api/`: Secure backend routing for Gemini API (preventing key exposure).
- `Design Diagrams/`: Architecture, Component, Data Flow, and Logic diagrams.

---

## 2. Documentation & Project Reasoning

### Your Understanding of the Problem
When I first read "Decision Companion System," my instinct was to build a chatbot that acts as an advisor. However, the requirement that the logic must be **transparent, explainable, and not a black box** meant an LLM-only approach was invalid. 

The core problem isn't "prediction" (which would require Machine Learning), nor is it "similarity" (which would require Graph-based recommendations). It is **structured evaluation of multiple alternatives against user-defined weighted criteria.** For a user, it’s about answering: *"Which option mathematically aligns best with my priorities, and why?"*

To demonstrate this practically, I chose the domain of **Laptop Selection**. This required solving real algorithmic challenges like mixing *Cost* criteria (lower is better, e.g., Price) with *Benefit* criteria (higher is better, e.g., Performance benchmarks).

### Assumptions Made (AI Prompts & Approach Evolution)
During research, I utilized AI (ChatGPT & Gemini) heavily for learning MCDM theory and Next.js bug-fixing. Here is how I responsibly filtered those suggestions (detailed further in `RESEARCH_LOG.md`):

- **Accepted:** Using MCDM algorithms (WSM and TOPSIS). They are deterministic and mathematically provable, completely avoiding AI hallucination in the final decision.
- **Accepted:** Using domain-specific preset use-cases (e.g., "Developer", "Gamer"). This drastically lowers cognitive load compared to making users weigh 14 parameters from scratch.
- **Rejected:** The AI suggested using the Analytic Hierarchy Process (AHP). I rejected this because pairwise comparisons vastly increase UI complexity for the user. I prioritized UX transparency (Weighted Sum) combined with mathematical depth (Euclidean distance via TOPSIS).
- **Modified:** The AI suggested full automation of data entry using raw scraping. I modified this to use an on-demand AI "Autofill" button for specs. However, because AI hallucinates numbers, *I hardcoded the actual CPU/GPU benchmark scores into the math engine*. The AI only extracts the textual product name; the math relies strictly on my hardcoded validation tables.

### Why You Structured the Solution the Way You Did
1. **Decoupled Math Engine:** The scoring logic (`decision-engine.ts`) is completely isolated from the React UI. It uses a **Strategy Pattern** to dynamically switch between linear (WSM) and geometric (TOPSIS) algorithms.
2. **Client-Side State (Context API):** Since there was no requirement for persistent sessions, I avoided a heavy database (like PostgreSQL) to keep the app blazing fast and easy to deploy on Netlify.
3. **Step-by-Step Wizard Focus:** Decision science involves heavy data entry. Placing this in a vertical scrolling page overwhelms users. A paginated wizard keeps cognitive load low.
4. **"Practical" over "Technical" Explanations:** Instead of outputting raw Kendall's Tau correlation numbers, the results engine translates the math into human-readable warnings (e.g., *"This option uses 95% of your budget, leaving no room for accessories."*)

### Design Decisions and Trade-offs
- **WSM vs. TOPSIS:** 
  - *Decision:* I implemented both. WSM is linearly simple (easy to explain), while TOPSIS uses vector normalization and Euclidean distance to find the "Ideal" solution (handles widely varying scales like ₹1,50,000 prices vs. 5-hour batteries perfectly).
  - *Trade-off:* Showing both might confuse users.
  - *Solution:* TOPSIS is the primary engine, but the UI flags a "Tight Race / Algorithm Disagreement" warning if WSM and TOPSIS pick different winners, prompting manual review.
- **Hard Filter vs. Weighted Criterion (Budget):**
  - *Decision:* Initially, "Price" was just a weighted score. A ₹2L laptop could win even if the user's budget was ₹50K. 
  - *Solution:* I rebuilt Budget as a **Hard Pre-filter**. If an option exceeds the budget, it is eradicated from the math engine entirely and flagged in the UI as "Exceeds Budget".

### Edge Cases Considered (Detailed in Built Docs)
1. **AI Spec Hallucination:** If a user types "Potato" into the laptop autofill, the prompt engineering forces a structured JSON error instead of guessing specs.
2. **Zero-Weight Mathematics:** If a user zeros out weights, linear multiplication breaks. The engine dynamically auto-normalizes the remaining weights to artificially sum to 100%.
3. **Missing Scores:** Handled by a strict `validate()` gateway before the engine runs.
4. **Indecisive Ties:** If the Winner and Runner-up are within < 5% relative score difference, the confidence interval drops to "LOW", and the UI actively advises the user to treat them as equals.
5. **Power Efficiency (TDP):** Two identical GPUs perform completely differently at 40W vs 115W. The engine actively extracts TDP and calculates it as an independent cost/benefit vector.

### How to Run the Project
*You can view the live deployed version at: [https://descioncompanionsystem.netlify.app/](https://descioncompanionsystem.netlify.app/)*

To run locally:
1. Clone the repository and ensure you have Node.js 18+ installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory. You will need a standard Google Gemini API Key for the Autofill feature to function.
   ```env
   GEMINI_API_KEY=your_gen_ai_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

### What You Would Improve With More Time
1. **Shareable State (URL Encoding):** Instead of losing data on refresh, I would encode the entire `DecisionContext` into a compressed Base64 URL string (e.g., `/?state=eyJ...`) so users can share their decision dashboard with peers effortlessly.
2. **Live Benchmark API:** Replace the hardcoded Cinebench/PassMark arrays with a live API connection to a hardware database for real-time benchmark retrieval without relying on LLMs at all.
3. **Interactive Sensitivity Analysis:** Build real-time UI sliders on the final Results page where users can drag weights up and down watching the graphs shift, visually proving the robustness of the decision.
4. **PDF Engine Export:** Implement `jspdf` to generate a formal, printable report of the decision matrix.

---

## 3. Design Diagrams
Please review the `Design Diagrams/` folder for visual architectural flows, including Component mapping, Data Flow (frontend to API), and the highly detailed Decision Logic Activity Diagram (matching Mermaid / Draw.io specs).

## 4. Build Process
Read `BUILD_PROCESS.md` for a chronological breakdown of my cognitive process, the shift from generic rules to TOPSIS Euclidean math, and the specific mistakes I made during development and how I corrected them.

## 5. Research Log
Read `RESEARCH_LOG.md` for complete transparency into all ChatGPT/Gemini prompts used, Google Search queries, and the academic DSS resources studied to inform the system's architecture.
