# Design Diagrams

This document contains all architectural and design diagrams for the Decision Companion System.

## 1. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DECISION COMPANION SYSTEM                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────── PRESENTATION LAYER ──────────────────────────────┐ │
│  │                                                                             │ │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │ │
│  │   │   Header    │  │    Step     │  │   Content   │  │   Footer    │      │ │
│  │   │  Component  │  │  Indicator  │  │    Area     │  │  Component  │      │ │
│  │   └─────────────┘  └─────────────┘  └──────┬──────┘  └─────────────┘      │ │
│  │                                            │                               │ │
│  │                    ┌───────────────────────┼───────────────────────┐       │ │
│  │                    │                       │                       │       │ │
│  │           ┌────────▼────────┐    ┌────────▼────────┐    ┌────────▼──────┐│ │
│  │           │  Options Step   │    │  Scoring Step   │    │ Results Step  ││ │
│  │           │   Component     │    │   Component     │    │  Component    ││ │
│  │           └─────────────────┘    └─────────────────┘    └───────────────┘│ │
│  │                                                                           │ │
│  │           ┌─────────────────┐    ┌─────────────────────────────────────┐ │ │
│  │           │ Criteria Step   │    │      Charts (Recharts)             │ │ │
│  │           │   Component     │    │  ┌─────────┐  ┌──────────────────┐ │ │ │
│  │           └─────────────────┘    │  │ BarChart│  │   RadarChart     │ │ │ │
│  │                                  │  └─────────┘  └──────────────────┘ │ │ │
│  │                                  └─────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                          │                                     │
│                                          │ State Updates                       │
│                                          ▼                                     │
│  ┌──────────────────────────── STATE MANAGEMENT ──────────────────────────────┐│
│  │                                                                             ││
│  │   ┌─────────────────────────────────────────────────────────────────────┐  ││
│  │   │                        React Context                                │  ││
│  │   │  ┌──────────────────────────────────────────────────────────────┐  │  ││
│  │   │  │                     useReducer                               │  │  ││
│  │   │  │                                                              │  │  ││
│  │   │  │   Actions:                        State:                     │  │  ││
│  │   │  │   • ADD_OPTION                    • problem: DecisionProblem │  │  ││
│  │   │  │   • UPDATE_CRITERION              • result: DecisionResult   │  │  ││
│  │   │  │   • UPDATE_SCORE                  • selectedMethod           │  │  ││
│  │   │  │   • SET_METHOD                    • currentStep              │  │  ││
│  │   │  │   • SET_RESULT                    • isAnalyzing              │  │  ││
│  │   │  │                                                              │  │  ││
│  │   │  └──────────────────────────────────────────────────────────────┘  │  ││
│  │   └─────────────────────────────────────────────────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                          │                                      │
│                                          │ Triggers Analysis                    │
│                                          ▼                                      │
│  ┌──────────────────────────── BUSINESS LOGIC ────────────────────────────────┐│
│  │                                                                             ││
│  │   ┌─────────────────────────────────────────────────────────────────────┐  ││
│  │   │                      DECISION ENGINE                                │  ││
│  │   │                                                                     │  ││
│  │   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │  ││
│  │   │   │ Validation  │  │Normalization│  │  Algorithm  │               │  ││
│  │   │   │   Module    │  │   Module    │  │   Runner    │               │  ││
│  │   │   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘               │  ││
│  │   │          │                │                │                       │  ││
│  │   │          ▼                ▼                ▼                       │  ││
│  │   │   ┌──────────────────────────────────────────────────────────┐    │  ││
│  │   │   │              ALGORITHM IMPLEMENTATIONS                   │    │  ││
│  │   │   │                                                          │    │  ││
│  │   │   │   ┌───────────┐   ┌───────────┐   ┌───────────┐        │    │  ││
│  │   │   │   │    WSM    │   │    WPM    │   │  TOPSIS   │        │    │  ││
│  │   │   │   │ Weighted  │   │ Weighted  │   │ Technique │        │    │  ││
│  │   │   │   │   Sum     │   │  Product  │   │for Order  │        │    │  ││
│  │   │   │   │  Model    │   │   Model   │   │Preference │        │    │  ││
│  │   │   │   └───────────┘   └───────────┘   └───────────┘        │    │  ││
│  │   │   └──────────────────────────────────────────────────────────┘    │  ││
│  │   │                                │                                   │  ││
│  │   │                                ▼                                   │  ││
│  │   │   ┌──────────────────────────────────────────────────────────┐    │  ││
│  │   │   │              POST-PROCESSING                             │    │  ││
│  │   │   │                                                          │    │  ││
│  │   │   │   ┌─────────────┐   ┌──────────────┐   ┌────────────┐  │    │  ││
│  │   │   │   │  Ranking    │   │ Explanation  │   │Sensitivity │  │    │  ││
│  │   │   │   │  Generator  │   │  Generator   │   │  Analysis  │  │    │  ││
│  │   │   │   └─────────────┘   └──────────────┘   └────────────┘  │    │  ││
│  │   │   └──────────────────────────────────────────────────────────┘    │  ││
│  │   └─────────────────────────────────────────────────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────┘

                    USER INPUT FLOW
                    ================
                    
    ┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐
    │  User   │         │  User   │         │  User   │         │  User   │
    │ enters  │────────▶│ defines │────────▶│ scores  │────────▶│ views   │
    │ options │         │criteria │         │ matrix  │         │ results │
    └────┬────┘         └────┬────┘         └────┬────┘         └────┬────┘
         │                   │                   │                   │
         ▼                   ▼                   ▼                   ▼
    ┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐
    │ Option  │         │Criterion│         │  Score  │         │ Display │
    │  Array  │         │  Array  │         │ Matrix  │         │ Results │
    └────┬────┘         └────┬────┘         └────┬────┘         └─────────┘
         │                   │                   │                   ▲
         │                   │                   │                   │
         └───────────────────┴───────────────────┘                   │
                             │                                       │
                             ▼                                       │
                    ┌─────────────────┐                              │
                    │  Decision       │                              │
                    │   Problem       │                              │
                    │   (Combined)    │                              │
                    └────────┬────────┘                              │
                             │                                       │
                             ▼                                       │
                    ┌─────────────────┐                              │
                    │   Validation    │                              │
                    │    Check        │                              │
                    └────────┬────────┘                              │
                             │                                       │
                    Valid?   │                                       │
                     ┌───────┴───────┐                               │
                     │               │                               │
                    Yes             No                               │
                     │               │                               │
                     ▼               ▼                               │
            ┌────────────────┐  ┌─────────────┐                      │
            │  Normalization │  │   Show      │                      │
            │    Process     │  │   Errors    │                      │
            └───────┬────────┘  └─────────────┘                      │
                    │                                                │
                    ▼                                                │
            ┌────────────────┐                                       │
            │   Algorithm    │                                       │
            │   Execution    │                                       │
            │  (WSM/WPM/     │                                       │
            │   TOPSIS)      │                                       │
            └───────┬────────┘                                       │
                    │                                                │
                    ▼                                                │
            ┌────────────────┐                                       │
            │    Ranking     │                                       │
            │   Generation   │                                       │
            └───────┬────────┘                                       │
                    │                                                │
         ┌──────────┼──────────┐                                     │
         │          │          │                                     │
         ▼          ▼          ▼                                     │
    ┌─────────┐ ┌─────────┐ ┌─────────┐                             │
    │Recommend│ │Explain- │ │Sensitiv-│                             │
    │  ation  │ │  ation  │ │   ity   │                             │
    └────┬────┘ └────┬────┘ └────┬────┘                             │
         │          │          │                                     │
         └──────────┼──────────┘                                     │
                    │                                                │
                    ▼                                                │
            ┌────────────────┐                                       │
            │   Decision     │───────────────────────────────────────┘
            │    Result      │
            │   (Complete)   │
            └────────────────┘
```

---

## 3. Component Hierarchy Diagram

```
                            ┌─────────────────┐
                            │    page.tsx     │
                            │   (Home Page)   │
                            └────────┬────────┘
                                     │
                            ┌────────▼────────┐
                            │   AppProvider   │
                            │  (Context Root) │
                            └────────┬────────┘
                                     │
                            ┌────────▼────────┐
                            │ DecisionCompanion│
                            │  (Main Layout)  │
                            └────────┬────────┘
                                     │
            ┌────────────────────────┼────────────────────────┐
            │                        │                        │
    ┌───────▼───────┐       ┌───────▼───────┐       ┌───────▼───────┐
    │    Header     │       │ StepIndicator │       │    Footer     │
    │               │       │               │       │               │
    └───────────────┘       └───────────────┘       └───────────────┘
                                     │
                                     │ (renders based on currentStep)
                                     │
            ┌────────────────────────┼────────────────────────┐
            │                        │                        │
   Step 0   │               Step 1   │              Step 2    │
    ┌───────▼───────┐       ┌───────▼───────┐       ┌───────▼───────┐
    │  OptionsStep  │       │ CriteriaStep  │       │  ScoringStep  │
    │               │       │               │       │               │
    │ • Option List │       │• Criteria List│       │• Score Matrix │
    │ • Add Form    │       │• Weight Slider│       │• Progress Bar │
    │ • Edit/Delete │       │• Type Toggle  │       │• Validation   │
    └───────────────┘       └───────────────┘       └───────────────┘
                                                    
   Step 3
    ┌─────────────────────────────────────────────────────────────┐
    │                         ResultsStep                         │
    │                                                             │
    │   ┌─────────────────┐  ┌─────────────────┐                 │
    │   │  Winner Banner  │  │ Method Selector │                 │
    │   └─────────────────┘  └─────────────────┘                 │
    │                                                             │
    │   ┌─────────────────┐  ┌─────────────────┐                 │
    │   │    BarChart     │  │   RadarChart    │                 │
    │   │  (Recharts)     │  │   (Recharts)    │                 │
    │   └─────────────────┘  └─────────────────┘                 │
    │                                                             │
    │   ┌─────────────────┐  ┌─────────────────┐                 │
    │   │  Rankings List  │  │  Key Reasons    │                 │
    │   └─────────────────┘  └─────────────────┘                 │
    │                                                             │
    │   ┌─────────────────┐  ┌─────────────────┐                 │
    │   │  Explanation    │  │   Sensitivity   │                 │
    │   │  (Collapsible)  │  │  (Collapsible)  │                 │
    │   └─────────────────┘  └─────────────────┘                 │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘
```

---

## 4. Decision Logic Flowchart

```
                    ┌─────────────────────────┐
                    │      START ANALYSIS     │
                    └───────────┬─────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │   Validate Input Data   │
                    │   • Options exist?      │
                    │   • Criteria exist?     │
                    │   • Scores complete?    │
                    └───────────┬─────────────┘
                                │
                       ┌────────┴────────┐
                       │   Valid?        │
                       └────────┬────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │ No              │                 │ Yes
              ▼                 │                 ▼
     ┌─────────────────┐        │     ┌─────────────────────────┐
     │  Return Errors  │        │     │   Normalize Weights     │
     │  to User        │        │     │   Σ(weights) → 1.0      │
     └─────────────────┘        │     └───────────┬─────────────┘
                                │                 │
                                │                 ▼
                                │     ┌─────────────────────────┐
                                │     │   Select Algorithm      │
                                │     └───────────┬─────────────┘
                                │                 │
                ┌───────────────┼─────────────────┼───────────────┐
                │               │                 │               │
                ▼               ▼                 ▼               │
        ┌───────────┐   ┌───────────┐   ┌───────────────┐        │
        │    WSM    │   │    WPM    │   │    TOPSIS     │        │
        └─────┬─────┘   └─────┬─────┘   └───────┬───────┘        │
              │               │                 │                 │
              ▼               ▼                 ▼                 │
        ┌───────────┐   ┌───────────┐   ┌───────────────┐        │
        │ Min-Max   │   │ Min-Max   │   │   Vector      │        │
        │Normalize  │   │Normalize  │   │ Normalize     │        │
        └─────┬─────┘   └─────┬─────┘   └───────┬───────┘        │
              │               │                 │                 │
              ▼               ▼                 ▼                 │
        ┌───────────┐   ┌───────────┐   ┌───────────────┐        │
        │ For each  │   │ For each  │   │ Calculate     │        │
        │ option:   │   │ option:   │   │ Ideal &       │        │
        │ Σ(w×n)    │   │ Π(n^w)    │   │ Anti-Ideal    │        │
        └─────┬─────┘   └─────┬─────┘   └───────┬───────┘        │
              │               │                 │                 │
              │               │                 ▼                 │
              │               │         ┌───────────────┐        │
              │               │         │ Calculate     │        │
              │               │         │ Distances     │        │
              │               │         └───────┬───────┘        │
              │               │                 │                 │
              │               │                 ▼                 │
              │               │         ┌───────────────┐        │
              │               │         │ Compute       │        │
              │               │         │ Closeness     │        │
              │               │         └───────┬───────┘        │
              │               │                 │                 │
              └───────────────┴─────────────────┴─────────────────┘
                                        │
                                        ▼
                            ┌─────────────────────────┐
                            │   Sort by Score         │
                            │   Assign Ranks          │
                            └───────────┬─────────────┘
                                        │
                                        ▼
                            ┌─────────────────────────┐
                            │   Identify Strengths    │
                            │   & Weaknesses          │
                            └───────────┬─────────────┘
                                        │
                                        ▼
                            ┌─────────────────────────┐
                            │   Generate              │
                            │   Recommendation        │
                            │   • Winner              │
                            │   • Confidence level    │
                            │   • Key reasons         │
                            └───────────┬─────────────┘
                                        │
                                        ▼
                            ┌─────────────────────────┐
                            │   Generate              │
                            │   Explanation           │
                            │   • Steps               │
                            │   • Formulas            │
                            │   • Assumptions         │
                            └───────────┬─────────────┘
                                        │
                                        ▼
                            ┌─────────────────────────┐
                            │   Run Sensitivity       │
                            │   Analysis              │
                            │   • Test weight changes │
                            │   • Identify critical   │
                            │     criteria            │
                            └───────────┬─────────────┘
                                        │
                                        ▼
                            ┌─────────────────────────┐
                            │   Return Complete       │
                            │   DecisionResult        │
                            └───────────┬─────────────┘
                                        │
                                        ▼
                            ┌─────────────────────────┐
                            │       END               │
                            └─────────────────────────┘
```

---

## 5. State Transition Diagram

```
                         ┌─────────────────────────────────────┐
                         │           USER INTERACTIONS          │
                         └──────────────────┬──────────────────┘
                                            │
     ┌──────────────────────────────────────┼──────────────────────────────────────┐
     │                                      │                                       │
     ▼                                      ▼                                       ▼
┌─────────┐                          ┌─────────────┐                         ┌─────────────┐
│ STEP 0  │                          │   STEP 1    │                         │   STEP 2    │
│ OPTIONS │                          │  CRITERIA   │                         │   SCORING   │
├─────────┤                          ├─────────────┤                         ├─────────────┤
│         │   ADD 2+ OPTIONS         │             │   ADD 1+ CRITERIA       │             │
│   •     │────────────────────────▶ │      •      │ ───────────────────────▶│      •      │
│         │                          │             │                         │             │
└─────────┘                          └─────────────┘                         └─────────────┘
     ▲                                      ▲                                       │
     │                                      │                                       │
     │            BACK                      │                BACK                   │
     │◀─────────────────────────────────────┤◀──────────────────────────────────────┤
     │                                      │                                       │
     │                                      │                                       │
     │                                      │                   COMPLETE ALL SCORES │
     │                                      │                                       ▼
     │                                      │                                ┌─────────────┐
     │                                      │                                │   STEP 3    │
     │                                      │                                │   RESULTS   │
     │                                      │                                ├─────────────┤
     │                                      │                                │             │
     │              RESET                   │               BACK             │      •      │
     │◀─────────────────────────────────────┴────────────────────────────────│             │
     │                                                                       └─────────────┘
     │                                                                              │
     │                                                                              │
     │                              CHANGE METHOD                                   │
     │                  ┌───────────────────────────────────────────────────────────┤
     │                  │                                                           │
     │                  ▼                                                           │
     │          ┌───────────────┐                                                   │
     │          │  RE-ANALYZE   │───────────────────────────────────────────────────┘
     │          │  with new     │
     │          │  algorithm    │
     │          └───────────────┘
     │
     │
     │          START NEW DECISION
     └──────────────────────────────────────────────────────────────────────────────


LEGEND:
─────────────────
• = Valid state
─▶ = Transition
```

---

## 6. Class/Type Diagram

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                              TYPE DEFINITIONS                                   │
└────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐       ┌─────────────────────────┐
│     DecisionProblem     │       │     DecisionResult      │
├─────────────────────────┤       ├─────────────────────────┤
│ + id: string            │       │ + problemId: string     │
│ + title: string         │       │ + method: DecisionMethod│
│ + description?: string  │       │ + results: OptionResult[]│
│ + options: Option[]     │◀──────│ + recommendation        │
│ + criteria: Criterion[] │       │ + explanation           │
│ + createdAt: Date       │       │ + sensitivity           │
│ + updatedAt: Date       │       │ + timestamp: Date       │
└──────────┬──────────────┘       └─────────────────────────┘
           │                                   │
           │ contains                          │ contains
           │                                   │
           ▼                                   ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│        Option           │       │      OptionResult       │
├─────────────────────────┤       ├─────────────────────────┤
│ + id: string            │       │ + optionId: string      │
│ + name: string          │       │ + optionName: string    │
│ + description?: string  │       │ + finalScore: number    │
│ + scores: Record<       │       │ + normalizedScore: number│
│     string, number>     │       │ + rank: number          │
└─────────────────────────┘       │ + criteriaScores:       │
                                  │     CriterionScore[]    │
                                  │ + strengths: string[]   │
┌─────────────────────────┐       │ + weaknesses: string[]  │
│       Criterion         │       └─────────────────────────┘
├─────────────────────────┤                    │
│ + id: string            │                    │ contains
│ + name: string          │                    │
│ + weight: number        │                    ▼
│ + type: 'benefit' |     │       ┌─────────────────────────┐
│         'cost'          │       │    CriterionScore       │
│ + description?: string  │       ├─────────────────────────┤
│ + minValue?: number     │       │ + criterionId: string   │
│ + maxValue?: number     │       │ + criterionName: string │
└─────────────────────────┘       │ + rawScore: number      │
                                  │ + normalizedScore: number│
                                  │ + weightedScore: number │
┌─────────────────────────┐       │ + weight: number        │
│     Recommendation      │       │ + contribution: number  │
├─────────────────────────┤       └─────────────────────────┘
│ + optionId: string      │
│ + optionName: string    │       ┌─────────────────────────┐
│ + confidence: 'high' |  │       │      Explanation        │
│   'medium' | 'low'      │       ├─────────────────────────┤
│ + summary: string       │       │ + methodDescription     │
│ + keyReasons: string[]  │       │ + stepByStep:           │
│ + tradeoffs: string[]   │       │     ExplanationStep[]   │
└─────────────────────────┘       │ + assumptions: string[] │
                                  │ + limitations: string[] │
                                  └─────────────────────────┘


┌─────────────────────────┐
│    DecisionEngine       │
├─────────────────────────┤
│ - problem: DecisionProblem│
│ - config: MethodConfig  │
├─────────────────────────┤
│ + validate()            │
│ + analyze()             │
│ - runWSM()              │
│ - runWPM()              │
│ - runTOPSIS()           │
│ - normalizeWeights()    │
│ - normalizeScoresMinMax()│
│ - normalizeScoresVector()│
│ - identifyStrengthsWeaknesses()│
│ - generateRecommendation()│
│ - runSensitivityAnalysis()│
│ - explainWSM()          │
│ - explainWPM()          │
│ - explainTOPSIS()       │
└─────────────────────────┘
```

---

## Diagram Formats

These diagrams are created in ASCII art for maximum compatibility. They can be easily:
1. Viewed in any text editor
2. Copied into documentation
3. Converted to formal diagrams using tools like:
   - Draw.io (diagrams.net)
   - Lucidchart
   - Mermaid.js
   - PlantUML
   - Excalidraw

---

*All diagrams represent the Decision Companion System v1.0 architecture.*
