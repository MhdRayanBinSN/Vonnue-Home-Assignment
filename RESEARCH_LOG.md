# Research Log

---

## AI Prompts & Search Queries

### Feb 15

| Platform | Usage | Query/Prompt |
|----------|-------|--------------|
| ChatGPT | Learning | Understand these problem statement and explain to a CSE student |
| ChatGPT | Learning | Explain about decision companion system with example |

### Feb 16

| Platform | Usage | Query/Prompt |
|----------|-------|--------------|
| ChatGPT | Learning | Do I need to create any kind of document before executing plan like SRS |
| ChatGPT | Learning | Means SRS or approach doc or any other |
| ChatGPT | Learning | Existing DSC that is already built and using |
| ChatGPT | Learning | From that problem statement and requirements we need to select a specific domain or generalize method |
| ChatGPT | Learning | Which is best for our current expectations |

### Feb 17

| Platform | Usage | Query/Prompt |
|----------|-------|--------------|
| ChatGPT | Learning | Give summary about the document that needed to build a DSC *(uploaded DSS.pdf)* |
| ChatGPT | Learning | Existing projects that built |

### Feb 18

| Platform | Usage | Query/Prompt |
|----------|-------|--------------|
| ChatGPT | Learning | Is backend needed for this project |
| ChatGPT | Learning | Is decision tree or normal maths logic algos are best |
| ChatGPT | Learning | List the algorithm and pros and cons |
| Google | Learning | Decision companion system |
| Google | Learning | Articles about DSS |
| Google | Learning | Research papers decision support system |
| YouTube | Learning | Decision companion system |
| Stack Overflow | Learning | Decision companion system built for technical round in job interviews |

### Feb 19

| Platform | Usage | Query/Prompt |
|----------|-------|--------------|
| VS Code / Antigravity | Feature Building | Build a basic decision companion system with NextJs (requirements: Pleasing UI, Accept multiple options, Accept criteria with weights, Process and evaluate options, Provide ranked recommendation) |
| VS Code | Debugging | Fix the errors in UI, I think it might be an importing issue |
| VS Code | Feature Building | Optimize the code |
| VS Code | Feature Building | Design a clean architecture separating: UI, decision engine, data handling - keep it modular and scalable |
| VS Code | Documentation | Provide a conventional commit msg |

### Feb 20

| Platform | Usage | Query/Prompt |
|----------|-------|--------------|
| ChatGPT | Learning | What are the limitations of MCDM algorithms and when should they not be used |
| ChatGPT | Learning | How do real companies implement decision support systems - case studies |

### Feb 21

| Platform | Usage | Query/Prompt |
|----------|-------|--------------|
| ChatGPT | Learning | Trade-offs between simplicity and accuracy in weighted scoring models |
| ChatGPT | Learning | Best practices for making algorithm results explainable to non-technical users |
| ChatGPT | Learning | How to handle edge cases like equal scores or missing criteria values |
| ChatGPT | Learning | Give the ideas of my research log for better arrangement and readability |
| VS Code | Feature Building | How to create a professional research log with my existing research log, currently it is messy and difficult to insert updates |
| VS Code | Feature Building | Can you convert these to Excel |
| VS Code | Feature Building | In type and platform must be selectable and also automatically add these prompts to that log |
| VS Code | Feature Building | Add above typed prompts to Excel and MD file |

### Feb 22

| Platform | Usage | Query/Prompt |
|----------|-------|--------------|
| VS Code | Learning | What we done in this project - is it generalized or domain specific |
| VS Code | Learning | What is MCDM algorithms, is there any other algorithm like these |
| VS Code | Learning | I mean in DSC there is MCDM algorithm, is there any algorithm like MCDM |
| VS Code | Learning | Is there any algorithm better than MCDM |
| VS Code | Learning | give the calcuation example of wsm |
| VS Code | Learning | give the comparison and benfits of wsm with AHP |
| VS Code | Learning | Should we keep it domain-specific  or generalized? |
| VS Code | Feature Building | Implement laptop selection with use-case presets Software Dev, Gaming, Business, Student, Creative, Custom |
| VS Code | Debugging | Why do presets still require weight adjustment step? Fix flow to skip weights for presets |
| VS Code | Feature Building | Don't use emojis, use premium icons and SVG images (Lucide icons) |

### Feb 23 & 24

| Platform | Usage | Query/Prompt |
|----------|-------|--------------|
| VS Code | Feature Building | in some cases the user may dificult to fill so when we give a lptop information ai auto fill system can we implement |
| VS Code | Feature Building | Implement ai auto fill idea build these feature using gemini api with auto fill button in each laptop card |
| VS Code | Feature Building | i want to add a button in each laptop card that when clicked it will auto fill the laptop information |
| VS Code | Debugging | the auto fill button is not working |
| VS Code | Debugging | pls fix these |
| VS Code | Feature Building | if the laptop name doesn't exist or is invalid how does ai handle it, we need to add validation to prevent hallucinations |
| VS Code | Feature Building | implement input validation in the system prompt so ai returns a structured error for invalid inputs like random words or non laptop products |
| VS Code | Learning | how does the system convert cpu and gpu names into numeric scores and are those scores connected to the wsm weights |
| VS Code | Documentation | ok what we done now pls give a commit msg |
| VS Code | Documentation | push with these commit msg that i changed |
| VS Code | DevOps | when i select to open prodcution to deploy these err showing pls fix these |
| VS Code | DevOps | fix these netlify build err |
| VS Code | DevOps | in deployed site gemini_api_key issue showing |
| Google | Learning | gemini api key google ai studio free tier |
| Google | Feature Building | next.js api route scrape product page fetch html |
| Google | Feature Building | how to validate llm output json format |
| Google | DevOps | netlify deploy next.js app router 404 page not found |
| Google | DevOps | netlify environment variables next.js production |

### Feb 25 & 26

| Platform | Usage | Query/Prompt |
|----------|-------|--------------|
| VS Code | Learning | are 1-10 scores enough for hardware eval or we strictly need real benchmark metrics |
| VS Code | Feature Building | how to parse real passmark cpu and g3d mark gpu benchmark scores from txt files to the decision engine |
| VS Code | Learning | explain tdp and gpu benchmarking simple and how they affect weighted decision maths |
| VS Code | Learning | how to hide complex benchmark scores so ui is compatable for normal usrs |
| VS Code | Learning | what are risks of ai hallucination in data fetch how to build manual mathematical  method |
| VS Code | Learning |any trained nlp models on hugging face  |
| VS Code | Learning | since models can be outdated then how to get the real infos |
| VS Code | Coding Assistance | i am struggling to parse dom for fallback can u write generic ts util to extract ram and ssd from raw html |
| VS Code | Refactoring | review my decision-engine.ts parsing logic is messy how to refactor to be modular and scalable |
| VS Code | Feature Building | how to map massive dataset of cpus including budget tiers and gpus into grouped ui dropdowns |
| VS Code | Learning | standard dropdown is bad for 12 criteria what are high density ux alternative options |
| VS Code | Feature Building | can u rewrite layout using table so first criteria column stays sticky when scrolling |
| VS Code | Learning | how to normalize wildly mixed data types like price and benchmarks in mcdm algorithms |
| VS Code | Learning | explain topsis algorithm and how its maths differs from wsm |
| VS Code | Feature Building | lets implement topsis how to calculate euclidean distance to positive and negative ideal in ts |
| VS Code | Debugging | the react ui is not updating when i use toggle switch between wsm and topsis why state not rerendering |
| VS Code | Refactoring | decision-engine.ts is having both wsm and topsis propose plan to extract to strategy pattern |
| VS Code | Documentation | give a small commit msg for sticky comparison table and adding topsis |
| Google | Learning | cinebech cpu database |
| Google | Learning | gpu benchmark values |
| Google | Learning | gpu benchmark database |
| Google | Learning | huggingface model for gpu becnhmarks |
| Google | Learning | kaggle dataset for gpu becnh makrs |
| Google | Learning | Database for cpu and gpu benchmarks |
| Google | Learning | Topsis algorithm explanation |

---

## References

| Source | Link | How It Helped |
|--------|------|---------------|
| PMI Article | https://www.pmi.org/learning/library/decision-support-systems-project-management-3494 | Understanding DSS in project context |
| Indeed Career Guide | https://www.indeed.com/career-advice/career-development/decision-support-system-examples | Real-world DSS examples |
| GitHub Repository | https://github.com/igaribay/DSSwithPython | Code reference for DSS implementation |
| DSS.pdf | Local document | Comprehensive theory on decision support systems, MCDM algorithms |

---

## What I Accepted, Rejected, or Modified

| AI Suggestion | Action | Reason |
|---------------|--------|--------|
| Use MCDM algorithms (WSM, WPM, TOPSIS) | Accepted | Transparent, deterministic, explainable |
| Implement AHP algorithm | Rejected | Pairwise comparisons increase UI complexity |
| Use Next.js + TypeScript | Accepted | Modern stack, good for interactive UI |
| Not Needed backend/database for these project| Accepted | Not needed for assignment scope |
| Use Redux for state | Rejected | Overkill, used Context + useReducer instead |
| Add sensitivity analysis | Accepted | Shows if decision is robust to weight changes |
| Use domain-specific (Laptop Selection) | Accepted | More practical demo than generic system |
| Implement use-case presets | Accepted | Better UX, shows understanding of real user needs |
| Skip weight adjustment for presets | Accepted | Presets already have optimized weights |
|Show raw error message from API in the UI | Modified | Replaced with clean user-friendly error message instead |
| Auto-fill all 12 specs silently without feedback | Modified | Added loading state and progress bar to show which specs are being filled |
---




### Feb 27

| Platform | Usage | Query/Prompt |
|----------|-------|--------------|
| ChatGPT | Learning | How to implement budget constraints in MCDM algorithms |
| ChatGPT | Learning | Should budget be a weighted criterion or a hard filter |
| ChatGPT | Learning | TDP impact on laptop performance and battery life |
| ChatGPT | Learning | How to calculate price-to-performance ratio for hardware |
| ChatGPT | Learning | Derived metrics in decision support systems |
| VS Code | Feature Building | Implement budget pre-filter that removes options before running algorithms |
| VS Code | Feature Building | Add TDP as independent criterion separate from GPU scores |
| VS Code | Feature Building | Auto-calculate price-to-performance ratio in decision engine |
| VS Code | Refactoring | Rebalance all preset weights to accommodate new TDP and P2P criteria |
| VS Code | Feature Building | Add budget input field to PresetSelector component |
| VS Code | Feature Building | Display filtered options count in ResultsStep |
| VS Code | Documentation | Create comprehensive ACCURACY_IMPROVEMENTS.md document |
| Google | Learning | MCDM budget constraints best practices |
| Google | Learning | TDP vs GPU performance laptop benchmarks |
| Google | Learning | Price performance ratio calculation methods |

---

## Updated References (Feb 27)

| Source | Link | How It Helped |
|--------|------|---------------|
| MCDM Constraints Research | Academic papers | Budget filtering and threshold constraints in MCDM |
| TDP Technical Specs | Hardware documentation | Understanding thermal design power impact on performance |
| Value Analysis Methods | Engineering economics | Price-to-performance ratio calculation methodologies |

---

## Additional Accepted/Rejected Decisions (Feb 27)

| AI Suggestion | Action | Reason |
|---------------|--------|--------|
| Make budget a weighted criterion | Rejected | Budget should be a hard filter, not a soft preference |
| Keep TDP hidden in GPU names | Rejected | Extracted as independent criterion for better math accuracy |
| Manual price-to-performance calculation | Modified | Auto-calculated as derived metric to reduce user effort |
| Add minimum threshold filters | Deferred | Good idea but out of scope for current deadline |
| Calculate real PPI for resolution | Deferred | Would improve accuracy but requires more complex calculations |
