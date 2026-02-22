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

## Week 2 – Domain-Specific Implementation

### 8. Choosing the Development Approach

Before diving into the laptop selection implementation, I researched software development methodologies to find the best fit for this project:

| Approach | Considered | Verdict |
|----------|------------|---------|
| Waterfall | Too rigid for exploratory work | Rejected |
| Agile/Scrum | Overkill for solo project | Rejected |
| Rapid Prototyping | Good for validation | Considered |
| RAD (Rapid Application Development) | Fast, component-based | **Selected** |

**Why I chose RAD:**
- Time constraint (2-week deadline)
- Solo developer (no team coordination needed)
- Can leverage existing UI components and libraries
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

