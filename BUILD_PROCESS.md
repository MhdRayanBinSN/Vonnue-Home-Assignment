# BUILD_PROCESS.md

## Week 1 – Problem Framing and Direction Setting

### 1. Initial Interpretation of the Problem

When I first read "Decision Companion System," I interpreted it as a conversational assistant that helps users make decisions — essentially a chatbot powered by ChatGPT.

My initial instinct was:

> Build a UI → Send user prompt → Let LLM reason → Return recommendation.

However, after carefully re-reading the email, two constraints stood out:

- The system must not rely entirely on an AI model.
- The logic must be explainable and not a black box.

This immediately invalidated my initial chatbot-based approach.

I realized that a pure LLM-based system would:
- Hide reasoning inside the model
- Make outputs non-deterministic
- Fail the explainability requirement

So I decided to rethink the architecture from first principles.

---

### 2. Exploring Machine Learning-Based Approaches

My next thought was to use classical ML algorithms like:
- Decision Trees
- Classification models
- Possibly fuzzy logic systems

**Why I considered this:**
- Decision Trees are explainable.
- ML models are often used in recommendation systems.

After researching further, I identified limitations:
- ML requires labeled training data.
- My problem is not prediction  it is evaluation of user-defined criteria.
- ML introduces unnecessary complexity.
- Training-based systems do not align well with dynamic user inputs.

I concluded that this assignment is more about **decision structuring** than prediction.

Therefore, I rejected ML-based approaches for the initial version.

---

### 3. Considering Graph-Based Recommendation Systems

While reflecting on recommendation systems like Facebook's friend suggestions, I explored whether:
- Graph theory
- Tree structures
- Similarity networks

could be applied.

However, I identified a mismatch:
- Graph systems focus on similarity between nodes.
- My problem focuses on evaluating alternatives against weighted criteria.

The conceptual models are different:
- Graphs → relationship-driven
- Decision companion → criteria-driven

So I ruled this out as well.

---

### 4. Discovery of Multi-Criteria Decision Making (MCDM)

After exploring ML and graph-based approaches, I researched structured decision-making frameworks and discovered Multi-Criteria Decision Making (MCDM) techniques.

Some approaches I considered:
- Weighted Scoring Model
- Analytic Hierarchy Process (AHP)
- Fuzzy-based evaluation methods

This aligned much better with the assignment constraints.

**Key Realization:**
> The core problem is not prediction. It is structured comparison of multiple options against user-defined weighted criteria.

#### Why I Selected Weighted Scoring

I chose a **Weighted Scoring Model** for the initial implementation because it is:
- Deterministic
- Transparent
- Easy to explain
- User-adjustable
- Mathematically simple yet effective

**The scoring formula used:**

$$Score(O_i) = \sum (W_j \times N_{ij})$$

Where:
- $W_j$ = Weight assigned to criterion $j$
- $N_{ij}$ = Normalized value of option $i$ under criterion $j$

Normalization ensures all criteria are comparable, especially when mixing:
- **Cost criteria** (lower is better, e.g., price)
- **Benefit criteria** (higher is better, e.g., performance)

**For cost criteria:**
$$N = \frac{Max - Value}{Max - Min}$$

**For benefit criteria:**
$$N = \frac{Value - Min}{Max - Min}$$

This ensures:
- Scores are comparable
- The ranking is mathematically consistent
- Every result can be traced and explained

#### Why I Did Not Choose AHP (For Now)

Although AHP provides deeper mathematical rigor:
- It requires pairwise comparisons
- Increases UI complexity
- Adds cognitive load to users
- Slows development timeline

Given the assignment emphasis on clarity and explainability, I made a conscious trade-off:

> **Simplicity + Transparency > Overengineering**

This decision balances technical correctness with usability and time constraints.

---

### 5. First Prototype – Generalized Decision Engine

Before committing to a domain, I built a generalized version.

The system:
- Accepts dynamic criteria
- Allows users to assign priority weights
- Accepts multiple options
- Computes weighted score
- Produces ranked output

**Purpose of this prototype:**
- Understand normalization challenges
- Validate weight handling
- Test ranking stability
- Identify edge cases

This helped me see issues like:
- What if all weights are zero?
- What if two options tie?
- How to normalize cost vs benefit criteria?

This prototype clarified the core architecture.

#### Rough Architecture I Created

I sketched a basic architecture to visualize the data flow:



The flow is:
1. **User (Browser)** → Inputs options, criteria, weights
2. **Next.js Frontend** → Forms, sliders, UI components
3. **State Management** → Stores and validates data
4. **Decision Engine** → Normalization, scoring, ranking
5. **Explanation Generator** → Score breakdown, reasoning
6. **Ranked Output** → Final results with explanations

---

### 6. Generalized vs Domain-Specific Confusion

After building the generalized version, I faced an architectural decision:

> Should the system remain generic?
> Or should it focus on a specific domain?

I evaluated both approaches:

**Generalized System**

| Pros | Cons |
|------|------|
| Flexible | Harder to justify weight logic |
| Broad applicability | Weaker explanation quality |
| | Less domain intelligence |

**Domain-Specific System**

| Pros | Cons |
|------|------|
| Clear parameter interpretation | Limited to one domain |
| Stronger explanation | |
| More realistic evaluation | |
| Better demonstration of practical reasoning | |

I concluded:
> A focused domain allows better reasoning about parameter importance and trade-offs.

This aligns better with the assignment's emphasis on explainability and practical reasoning.

---

### 7. Other Crucial Applications I Noted

While researching, I documented other unique applications where decision companion systems are valuable:

| Domain | Use Case | Pre-built Criteria |
|--------|----------|-------------------|
| **Tech Stack Selection** | Choose frameworks, databases, cloud providers | Performance, Cost, Scalability, Learning Curve, Community Support |
| **Vendor/Tool Evaluation** | Compare SaaS tools, APIs, services | Pricing, Features, Integration, Support, Security |
| **Feature Prioritization** | Product roadmap decisions | User Impact, Dev Effort, Revenue Potential, Strategic Fit |


#### Why I Chose Laptop Recommendation

For the initial phase, I chose:

**Laptop Recommendation under budget and usage constraints.**

Why:
- I have a sound knowledge about the parameters infromations
- Easily testable logic
- Relatable to most users

This allowed me to:
- Implement cost vs benefit normalization
- Provide rule based explanations
- Show  ranking when weights change


---

## Feb 22 – Domain-Specific Implementation


### 8. Choosing the Development Approach

Before diving into the laptop selection implementation, I researched software development methodologies to find the best fit for this project:

| Approach | Considered | Verdict |
|----------|------------|---------|
| Waterfall | Too rigid for exploratory work | Rejected |
| Agile/Scrum | Overkill for solo project | Rejected |
| Rapid Prototyping | Good for validation | Considered |
| RAD (Rapid Application Development) | Fast, component-based | **Selected** |

**Why I chose RAD:**
- We can do updates in based on ideas and deploy version basis
- Time constraint (2-week deadline)
- Solo developer (no team coordination needed)
- Focus on quick, working deliverables
- Allows iterative refinement

---

### 9. Defining Laptop Selection Parameters

I identified the key criteria for laptop comparison and classified each by type:

| Criterion | Type | Unit/Scale | Default Weight | Description |
|-----------|------|------------|----------------|-------------|
| **Price** | Cost | ₹ | 25% | Total cost (lower is better) |
| **Performance** | Benefit | 1-10 | 25% | CPU/GPU power for intended use |
| **Battery Life** | Benefit | Hours | 15% | Typical usage duration |
| **Display Quality** | Benefit | 1-10 | 10% | Resolution, brightness, color accuracy |
| **Build Quality** | Benefit | 1-10 | 10% | Materials, durability, feel |
| **Portability** | Benefit | 1-10 | 10% | Weight and size for carrying |
| **Storage** | Benefit | GB | 5% | SSD capacity |

**Key insight:**
- Price is a **cost criterion** (lower is better) — requires inverted normalization
- All other criteria are **benefit criteria** (higher is better)

---

### 10. Approaches for Criteria Handling 

I considered three different approaches for how users interact with criteria:

#### Option A: Use-Case Presets
Pre-configure weight profiles based on user type (Developer, Gamer, Student, etc.)
- User selects a preset → Weights auto-fill
- Can still adjust manually if needed

#### Option B: Questionnaire-Based
Ask simple questions and derive weights automatically:
- "What's more important - Budget or Performance?"
- "Do you travel frequently?"
- System calculates weights from answers

#### Option C: Database-Driven
Pre-populate laptop data from a database/API:
- User selects laptops from a list
- Data is already filled in
- Just set weights and compare

**My Decision: Use-Case Presets**

| Approach | Why Rejected/Selected |
|----------|----------------------|
| Questionnaire-Based | May not capture complete decision context; derived weights could be inaccurate |
| Database-Driven | Requires accurate, up-to-date laptop specifications; I don't have a reliable data source |
| **Use-Case Presets** | **Selected** — Provides domain expertise, reduces user effort, still allows customization |

**Planned Presets:**
```
Software Development: Performance 30%, Price 20%, Battery 15%, Display 15%, Build 10%, Portability 10%
Gaming:               Performance 40%, Price 15%, Display 20%, Battery 5%, Build 10%, Portability 10%
Office/Business:      Price 25%, Battery 25%, Performance 15%, Display 10%, Build 10%, Portability 15%
Student:              Price 30%, Battery 20%, Performance 15%, Display 10%, Build 10%, Portability 15%
```

This approach demonstrates:
- Domain knowledge (understanding what matters for each use case)
- Good UX design (presets reduce cognitive load)
- Flexibility (users can still customize)

---

### 11. Issues Found During Testing (Feb 22)

While testing the prototype, I identified and fixed these issues:

| Issue | What Happened | How I Fixed It |
|-------|---------------|----------------|
| Tailwind v4 classes | Old class names like `bg-gradient-*` not working | Changed to new syntax `bg-linear-*` |
| JSX errors | Some component rendering issues | Fixed syntax and imports |
| Preset still asks for weights | Even after selecting preset, weight step was shown | Modified `context.tsx` to skip Step 2 for presets |
| Emojis look inconsistent | Different browsers render emojis differently | Replaced with Lucide React icons |


---

## Feb 23 & 24 - Iteration 2: AI-Powered Auto-Fill & Deployment

### 12. Thinking Process - Removing Data Entry Friction

After the core laptop scoring system was working, I reflected on the biggest usability bottleneck:

> Users are expected to manually fill 12 technical specifications per laptop - price, CPU tier, GPU tier, RAM, SSD, display size, refresh rate, resolution, battery, weight, and build quality.

For a non-technical user, this is overwhelming. The system was technically correct but difficult to use in practice.

**My thinking:**
- The WSM algorithm needs numeric inputs - this is non-negotiable.
- But the *entry* of those numbers does not have to be manual.
- LLMs already know laptop specs from training data - why not use that?

This led me to design an AI auto-fill feature using the Gemini API.

---

### 13. Designing the AI Integration

**My approach:**
- Keep the algorithm pure (no AI in the scoring logic)
- Use AI only as a *data entry assistant*
- Output must be structured JSON matching the scoring system's exact schema

**Key design decision:**
> AI fills the raw scores. The WSM algorithm still computes the ranking. This keeps the decision logic deterministic and explainable - AI is just a convenience layer, not the decision-maker.

---

### 14. Alternative Approaches I Considered

| Approach | Considered | Verdict |
|----------|------------|---------|
| Let AI rank the laptops directly | Yes | Rejected - violates explainability requirement |
| Pre-populate a database of laptop specs | Yes | Rejected - requires maintenance, gets outdated |
| Web scrape specs automatically on page load | Yes | Rejected - too slow, unreliable for all models |
| AI auto-fill on user request with a button | Yes | **Selected** - user stays in control, on-demand |

---

### 15. Edge Case Discovery - Invalid Input Handling

During testing, I identified a critical flaw:

> If a user types gibberish or a wrong name, the LLM will **hallucinate specs** - confidently returning fake data.

This is dangerous for a decision system - the ranking would be based on fabricated numbers.

**Fix applied:** Added validation rules to the Gemini system prompt so it returns a structured JSON error for non-laptop inputs instead of guessing.

**Second edge case discovered:**
> What if the laptop model is real but obscure, or too new for the AI to know?

**Fix applied:** When the model name lookup fails, a URL input appears - the user can paste a product link from Amazon or Flipkart, and the AI extracts specs directly from the page content.

---

### 16. Deployment Issues & Fixes

This was the first time deploying a Next.js App Router project with API routes to Netlify.

| Issue | Root Cause | Fix |
|-------|------------|-----|
| Page not found on Netlify | No `netlify.toml` configured | Added `netlify.toml` with base dir and `@netlify/plugin-nextjs` |
| Build failed on Netlify | Missing `@types/node` in dependencies | Installed `@types/node` as dev dependency |
| API key not working in production | `.env.local` is local-only, not deployed | Added `GEMINI_API_KEY` to Netlify environment variables |
| gemini-2.0-flash 404 error | Model deprecated for new API keys | Switched to `gemini-2.5-flash` |

**Key learning:**
> Local `.env.local` files are never pushed to Git or deployed. Every deployment platform needs environment variables set separately in their dashboard.

---

### 17. What Changed During Development and Why

| Decision | Original Plan | What Actually Happened | Reason |
|----------|---------------|----------------------|--------|
| Gemini model | `gemini-2.0-flash` | `gemini-2.5-flash` | 2.0-flash deprecated for new API keys |
| Error display | Show raw API error | Show clean user-friendly message | Raw errors expose internal details, bad UX |
| URL fallback | Not planned | Added after testing | Needed to handle unknown/obscure laptop models |
| Input validation | Not planned | Added to system prompt | Prevent AI hallucinations for invalid inputs |

---

## Feb 25 & 26 – Mathematical Logic & Architecture Refactoring

### 18. Moving Beyond Normal Scores: Using Real Benchmarks
**The Problem:** Until now, we were giving arbitrary 1-10 scores for complex hardware like CPUs and GPUs. But this is not accurate. A "Ryzen 9" cannot just be guessed as an 8 or a 9. 
**The Insight:** Real software and hardware engineers use real benchmarking data, like PassMark scores and Thermal Design Power (TDP) numbers. We need our math engine to use exact numbers to be highly accurate.

**Alternative Approaches I Considered:**
1. **Live Web Scraping:** Scraping real-time benchmark scores from sites like NanoReview. 
   *(Rejected: It is too slow and websites can block us).*
2. **AI Metric Guessing:** Asking the LLM to hallucinate scores based on the name of the CPU.
   *(Rejected: AI can hallucinate wrong numbers, ruining the whole mathematical calculation).*
3. **Pre-Mapped Benchmark Integration:** Taking real-world scores (like Cinebench R23 and 3DMark TimeSpy) and hardcoding them directly into our application state.
   *(Selected: This guarantees instant speed and perfectly accurate geometric data for our calculations).*

**How I Implemented This:** 
I realized we just needed raw numeric scale for the math to work. I researched the actual *Cinebench R23 multi-core scores* for CPUs and *3DMark TimeSpy scores* for GPUs based on real TDP (Thermal Design Power) limits. 

I took those massive lists of hundreds of CPUs and GPUs and mapped them directly into highly optimized TypeScript arrays (`performance-calculator.ts` and `laptop-presets.ts`). 

Now, when a user selects a CPU from the dropdown (e.g., "AMD Ryzen 9 / Intel i9"), the UI displays a clean label, but the algorithm under the hood receives the exact raw benchmark integer (like `22000`). This completely eliminates AI hallucination and gives our TOPSIS Euclidean distance math a massive, perfectly accurate scale to work with, all at zero network latency.

---

### 19. The Evolution of the Algorithm: Why We Moved from WSM to TOPSIS

**The Problem with WSM (What I Found):**
While WSM (Weighted Sum Model) worked fine for a simple prototype with 3 to 5 basic criteria, it completely failed when I scaled the system up to 12 diverse criteria. 
1. **The "Average" Problem:** WSM is strictly linear (adding up normalized scores). If a laptop gets an amazing 10/10 in CPU but a terrible 1/10 in Battery, WSM will just average it out. It doesn't heavily penalize a catastrophic failure in one specific category. 
2. **The "Scale" Difference:** Linear min-max normalization in WSM struggles when mixing massive integers (like a Rs. 1,50,000 price or a 25,000 benchmark score) alongside tiny categorical values (like a 3-tier build quality).

**The Intelligent Solution: Implementing TOPSIS**
I realized I needed a geometric algorithm instead of a linear one. I researched and implemented **TOPSIS** (Technique for Order of Preference by Similarity to Ideal Solution). 

**How My TOPSIS Math Works:**
Instead of just adding scores, TOPSIS measures the literal "distance" a laptop is from the concept of a "Perfect" and "Terrible" machine.

1. **Vector Normalization:** Instead of basic min-max, I divided each value by the square root of the sum of squares ($X_{ij} / \sqrt{\sum X_{ij}^2}$). This preserves the exact ratio of distances between numbers, regardless of if the number is Rs.100,000 or a 1-10 rating.
2. **Finding the Ideals:** The code dynamically scans all loaded laptops and creates a "Positive Ideal Solution" ($A^*$) by merging all the best specs into a fake super-laptop, and a "Negative Ideal Solution" ($A^-$) by merging all the worst specs.
3. **Euclidean Distance Formula:** I used Euclidean geometry ($\sqrt{\sum(x - y)^2}$) to measure exactly how far every single real laptop is from both the "Perfect" and "Worst" ideals.
4. **Calculated Closeness:** The final rank is based on the Closeness Coefficient: $C_i = D^- / (D^+ + D^-)$. This means a laptop only wins if it is mathematically closest to the best *and* furthest from the worst. It brilliantly solves the WSM "Average" problem. 

#### Refactoring Decision: The Strategy Pattern
Initially, I placed all the TOPSIS mathematics inside the `decision-engine.ts` file. This was a bad approach because it made the file too big and complex (violating the Single Responsibility Principle). 

To make the code modular and scalable, I built a **Strategy Pattern**:
- I extracted a generic `IAlgorithm` interface.
- I created separated classes: `WsmAlgorithm` and `TopsisAlgorithm`.
- I moved all math normalizations into a `utils.ts` layer.
- Now, the `decision-engine.ts` acts as a simple router that sends data to whichever math algorithm the user selected. 

This shows great architectural thinking because if we later need to add another complex algorithm, we just drop in a new class without touching any existing core logic.

### Mistakes and Corrections
- **Mistake in Logic:** I initially tried to let users type their own benchmark scores or guess the numbers. This was a huge logic flaw because humans cannot memorize or accurately compare arbitrary hardware integers.
- **Correction:** I removed manual entry for hardware specs and forced the system to map the CPU/GPU names strictly to the benchmark database text files. This secured the mathematical purity of the final results.



feb 27


Critical Problems
1. Hardcoded Benchmark Data Gets Outdated Our CPU/GPU scores are hardcoded in TypeScript arrays. When Intel releases a new 15th Gen CPU or NVIDIA drops an RTX 5070, our system has zero knowledge of it. Someone has to manually update the code and redeploy. A database-driven approach (like your MongoDB plan) would solve this.

2. No TDP as Independent Criterion We handle TDP indirectly by listing "RTX 4060 40W" and "RTX 4060 115W" as separate dropdown entries. But the TOPSIS math never sees TDP as its own numeric axis. Two laptops with the same GPU at different TDP limits will get different GPU scores, but the algorithm doesn't understand why — it just sees two numbers. Making TDP a standalone criterion would give the math engine deeper reasoning.

3. User Must Know Their Exact CPU/GPU Model A normal user buying a laptop often doesn't know if their machine has "Intel i7-13700H" vs "Intel i7-13620H." They just see "Intel i7" on the store page. Our dropdowns require exact model selection. This creates friction and possible wrong data entry.

4. No Budget Pre-Filter Right now, Price is just another weighted criterion inside TOPSIS. If a student sets budget as ₹50,000 but adds a MacBook Pro (₹2,00,000), the math will still consider the MacBook and might even rank it high if its specs dominate. There is no hard cutoff saying "remove options above my budget before running the algorithm."


 Moderate Constraints
5. WSM and TOPSIS Can Give Different Winners We show both WSM and TOPSIS results separately. But if they disagree on the #1 recommendation, the user will be confused. We don't currently have logic to handle or explain the disagreement.

6. Resolution Uses Arbitrary Tier Scores For Resolution, we mapped "Full HD" = 5, "4K" = 9 etc. These are not real measurable values — they are manually assigned tiers. This means the Euclidean distance math treats the gap between "HD" and "Full HD" as equal to the gap between "3K" and "4K", which is not accurate in pixel density terms.

7. Build Quality is Fully Subjective "All Plastic" = 3, "Premium CNC Aluminum" = 9. This is our most subjective criterion. Two users could rate the same laptop differently. There is no objective benchmark for build quality unlike CPU/GPU scores.

8. No Sensitivity Feedback for TOPSIS Our sensitivity analysis (checking if ranking changes when weights shift by 50%) only runs on WSM results. TOPSIS ranking could be more or less sensitive, but we don't test that.



---

## Feb 27 – Accuracy Improvements

### 19. Critical Accuracy Issues Identified

After reviewing the system with fresh eyes, I identified three critical accuracy problems:

**Problem 1: Budget is Not a Filter**
- Price was just another weighted criterion
- A ₹2L MacBook could rank #1 even if user's budget is ₹50K
- Mathematically correct but practically useless

**Problem 2: TDP Hidden in GPU Names**
- "RTX 4060 40W" vs "RTX 4060 115W" were separate dropdown entries
- TOPSIS saw two different GPU scores but didn't understand WHY
- Power efficiency vs performance trade-off was invisible to the math

**Problem 3: No Value Metric**
- System could recommend expensive laptops without considering "bang for buck"
- A ₹2L laptop with 2.2× performance but 4× price had no value penalty

### 20. Solution Design: Three-Pronged Approach

**Solution 1: Budget Pre-Filter (Hard Constraint)**
- Budget is NOT a weighted criterion
- It's a hard filter applied BEFORE algorithms run
- Options exceeding budget are removed from consideration entirely
- Results show: "2 options exceeded budget of ₹100,000"

**Solution 2: TDP as Independent Criterion**
- Extracted TDP from GPU model names
- New criterion: `tdp` (type: 'cost', range: 15W to 150W+)
- TOPSIS now calculates distance from ideal power efficiency
- Users can weight TDP importance (Business: 5%, Gaming: 5%, Student: 3%)

**Solution 3: Price-to-Performance Ratio (Derived Metric)**
- Auto-calculated: `(CPU_score + GPU_score) / Price × 1000`
- Higher score = better value
- Student preset weights it 5% (value-conscious buyers)
- Example: HP Pavilion (P2P: 194.55) beats MacBook Pro (P2P: 165.08) on value

### 21. Implementation Details

**Type System Changes:**
```typescript
// types.ts
export interface DecisionProblem {
  budgetLimit?: number;
  minThresholds?: Record<string, number>;
}

export interface DecisionResult {
  filteredOutCount?: number;
  filteredOutReasons?: string[];
}
```

**Algorithm Flow Changes:**
```
Old: Validate → Normalize → Run Algorithm → Rank
New: Validate → Calculate Derived Metrics → Filter → Normalize → Run Algorithm → Rank
```

**Preset Weight Rebalancing:**
- All presets adjusted to accommodate TDP (5% for most)
- Student preset now includes 5% for price-to-performance
- Total criteria increased from 12 to 14

### 22. Testing Results

**Test Case 1: Budget Filter**
- Added 6 sample laptops (₹55K to ₹200K)
- Set budget: ₹100,000
- Result: 4 options filtered out, only 2 analyzed ✓

**Test Case 2: TDP Impact**
- Compared identical laptops except TDP (45W vs 115W)
- Business preset (TDP weight: 5%)
- Result: Lower TDP laptop ranked higher ✓

**Test Case 3: Price-to-Performance**
- Student preset (P2P weight: 5%)
- ₹50K laptop (CPU: 10000) vs ₹200K laptop (CPU: 22000)
- Result: Budget laptop got value bonus ✓

### 23. Impact on Accuracy

**Before Improvements:**
```
User: "I need a laptop under ₹80,000 for software development"
System: "I recommend MacBook Pro 14" (₹199,900) - Score: 87.3%"
User: "That's 2.5× my budget..."
```

**After Improvements:**
```
User: "I need a laptop under ₹80,000 for software development"
[Sets budget: ₹80,000]
System: "2 options exceeded budget and were filtered out."
System: "I recommend Acer Nitro V 15 (₹72,990) - Score: 78.5%"
System: "This option offers strong value (P2P: 246.57) with moderate TDP (65W)."
```

### 24. Documentation Created

Created `ACCURACY_IMPROVEMENTS.md` with:
- Detailed problem analysis
- Technical implementation details
- Before/after comparisons
- Testing recommendations
- Future enhancement ideas

### What Changed and Why

| Change | Original | New | Reason |
|--------|----------|-----|--------|
| Budget handling | Weighted criterion | Hard pre-filter | Budget is a constraint, not a preference |
| TDP representation | Hidden in GPU names | Independent criterion | Enables power efficiency trade-off analysis |
| Value analysis | None | Auto-calculated P2P | Shows "bang for buck" for budget users |
| Criteria count | 12 | 14 | Added TDP and pricePerformance |
| Preset weights | Sum to 100% | Rebalanced to 100% | Accommodate new criteria |

### Mistakes and Corrections

**Mistake:** Initially considered making budget a high-weight criterion (e.g., 40%)
**Correction:** Realized budget should be a binary filter (affordable vs not affordable), not a sliding scale

**Mistake:** Thought about manually calculating P2P for each laptop
**Correction:** Auto-calculate as derived metric in the engine to reduce user effort and ensure consistency

**Mistake:** Worried that adding 2 more criteria would make UI too complex
**Correction:** TDP and P2P are auto-calculated/selected, so cognitive load doesn't increase significantly
