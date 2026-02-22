# Decision Companion System

A web application that helps people make structured decisions when comparing multiple options. Uses proven decision-making algorithms (WSM, WPM, TOPSIS) to score and rank alternatives based on weighted criteria.

## What This Does

You have a decision to make. Maybe you're choosing between job offers, comparing laptops to buy, or deciding where to move. This tool helps you:

1. Define your options (the things you're choosing between)
2. Define your criteria (what matters to you)
3. Weight your criteria (how much each factor matters)
4. Score each option (how well does each option meet each criterion)
5. See results (ranked options with explanations)

The system uses three different algorithms to analyze your input and shows you which option comes out on top - and whether that ranking is stable or if it changes depending on the method.

## Why I Built It This Way

### The Problem I Was Solving

The assignment asked for a "Decision Companion System" - not a Decision Support System (DSS), though I learned they're basically the same thing. The goal was to help users make multi-criteria decisions.

### My Approach

After reading about DSS theory, I focused on the MCDM (Multi-Criteria Decision Making) part because that's the core of decision support. The three algorithms I implemented:

**Weighted Sum Model (WSM)** - The simplest approach. Multiply each score by its weight and add them up. Easy to understand, but only works when criteria use comparable scales.

**Weighted Product Model (WPM)** - Similar idea but uses multiplication instead of addition. Scale-independent, so you don't have to worry about normalizing different units.

**TOPSIS** - More sophisticated. Finds the option closest to an ideal solution and farthest from the worst solution. Handles trade-offs better than the simpler methods.

### Design Decisions

| Decision | Why |
|----------|-----|
| Next.js + React | Modern, good for interactive UI |
| TypeScript | Catches errors early, algorithms have complex data structures |
| Tailwind CSS v4 | Fast styling, no separate CSS files |
| Context + useReducer | Simple state management, no overkill Redux |
| Step wizard UI | Guides users through the process |
| Multiple algorithms | Shows agreement/disagreement, builds trust |

## Project Structure

```
decision-companion/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page with step wizard
│   │   ├── layout.tsx        # App layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── OptionsStep.tsx   # Step 1: Define options
│   │   ├── CriteriaStep.tsx  # Step 2: Define criteria
│   │   ├── ScoringStep.tsx   # Step 3: Score each option
│   │   ├── ResultsStep.tsx   # Step 4: View results
│   │   └── StepIndicator.tsx # Shows progress
│   └── lib/
│       ├── decision-engine.ts # Algorithm implementations
│       ├── context.tsx        # State management
│       └── types.ts           # TypeScript types
├── docs/
│   └── DIAGRAMS.md           # Architecture diagrams
└── package.json
```

## Running Locally

**Requirements:** Node.js 18+

```bash
cd decision-companion
npm install
npm run dev
```

Open http://localhost:3000

## How the Algorithms Work

### Normalization

Before running algorithms, raw scores need to be normalized to a 0-1 scale. For benefit criteria (higher is better), I use:

```
normalized = (value - min) / (max - min)
```

For cost criteria (lower is better), I invert it:

```
normalized = (max - value) / (max - min)
```

### WSM

Simplest method:

```
score = sum of (weight × normalized_score) for each criterion
```

### WPM

Uses products instead of sums:

```
score = product of (normalized_score ^ weight) for each criterion
```

### TOPSIS

More complex but more robust:

1. Vector normalization (different from min-max)
2. Apply weights to normalized matrix
3. Find ideal best (highest for each criterion)
4. Find ideal worst (lowest for each criterion)
5. Calculate distance from best and worst
6. Score = distance_from_worst / (distance_from_best + distance_from_worst)

Higher score = better option.

## What I Learned

- DSS theory emphasizes that systems should support human decisions, not make them
- Different MCDM algorithms can give different rankings on the same data
- Sensitivity analysis helps users understand if their decision is robust
- Cost criteria (where lower is better) need special handling in normalization

## Known Limitations

- No user authentication or saved decisions
- Criteria weights must sum to 1 (manual adjustment needed)
- No support for dependent criteria
- Sensitivity analysis is basic (full implementation would need more time)

## References

- Decision Support Systems academic PDF (studied for theoretical foundation)
- MCDM literature on WSM, WPM, TOPSIS methods
- Next.js 14 documentation
- Tailwind CSS v4 documentation
- Recharts library for visualizations

---

Built as a take-home assignment for Vonnue.
