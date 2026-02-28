# Research Log

---

## AI Prompts & Search Queries

### Feb 15

| Platform | Usage | Query/Prompt |
|----------|-------|--------------|
| ChatGPT | Learning | understand these problem statement and explain to a CSE student |
| ChatGPT | Learning | explain about decision companion system with example |
| ChatGPT | Learning | understand these problem statement and explain to a experienced software engineer and a researcher |
### Feb 16


| platform | usage | query/prompt |
|----------|-------|--------------|
| chatgpt | learning | do i need to create any kind of documnt before executng plan like srs |
| chatgpt | learning | means srs or approach doc or any other |
| chatgpt | learning | existing dsc that is already built and using |
| chatgpt | learning | from that problem statement and requirments we need to select a specific domain or generalize method |
| chatgpt | learning | which is best for our current expectatons |
`


### feb 17

| platform | usage | query/prompt |
|----------|-------|--------------|
| chatgpt | learning | give summary about documnt needed to build dsc (uploaded dss.pdf) |
| chatgpt | learning | existing projects built |

### feb 18

| platform | usage | query/prompt |
|----------|-------|--------------|
| chatgpt | learning | is backend needed for project |
| chatgpt | learning | is decision tree or normal maths logic algos best |
| chatgpt | learning | list algorithm and pros and cons |
| google | learning | decision companion systm |
| google | learning | articles about dss |
| google | learning | research papers decision support systm |
| youtube | learning | decision companion systm |
| stack overflow | learning | decision companion systm built for technical round in job interviews |


### Feb 19

| platform | usage | query/prompt |
|----------|-------|--------------|
| vs code | feature building | build a basic decision companion system with nextjs requirements: pleasing ui, accept multiple options, accept criteria with weights, process and evaluate options provide ranked recommendation |
| vs code | debugging | fix the errors in ui, i think it might be an importing issue |
| vs code | feature building | optimize the code |
| vs code | feature building | design a clean architecture separating: ui, decision engine, data handling keep it modular and scalable |
| vs code | documentation | provide a conventional commit msg |


### Feb 20

| Platform | Usage | Query/Prompt |
|----------|-------|--------------|
| ChatGPT | Learning | what are the limitations of MCDM algorithms and when should they not be used |
| ChatGPT | Learning | how do real companies implement decision support systems  case studies |

### Feb 21

| Platform | Usage | Query/Prompt |
|----------|-------|--------------|

| ChatGPT | Learning | trade offs between simple and accurate scoring models |
| ChatGPT | Learning | how to explain algo results to non tech users |
| ChatGPT | Learning | how to handle same scores or missing values in the algo |
| ChatGPT | Learning | give me ideas to organize my research log better |
```markdown
| VS Code | Feature Building | how to create a professional research log with my existing research log, currently it is messy and difficult to insert updates |
| VS Code | Feature Building | can you convert these to Excel |
| VS Code | Feature Building | in type and platform must be selectable and also automatically add these prompts to that log |
| VS Code | Feature Building | add above typed prompts to Excel and MD file |
```

### Feb 22

| Platform | Usage | Query/Prompt |
|----------|-------|--------------|
```markdown
| vs code | learning | what we done in this project - is it generalized or domain specific |
| vs code | learning | what is mcdm algorithms, is there any other algorithm like these |
| vs code | learning | i mean in dsc there is mcdm algorithm, is there any algorithm like mcdm |
| vs code | learning | is there any algorithm better than mcdm |
| vs code | learning | give the calcuation example of wsm |
| vs code | learning | give the comparison and benfits of wsm with ahp |
| vs code | learning | should we keep it domain-specific or generalized? |
| vs code | feature building | implement laptop selection with use-case presets software dev, gaming, business, student, creative, custom |
| vs code | debugging | why do presets still require weight adjustment step? fix flow to skip weights for presets |
| vs code | feature building | don't use emojis, use premium icons and svg images (lucide icons) |
```

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

### Feb 27

| Platform | Usage | Query/Prompt |
|----------|-------|--------------|
| Google | Learning | Price performance ratio calculation methods |
| Google | Learning | how to check rank correlation between two arrays in js |
| Google | Learning | kendall tau implemention js |
| Google | Learning | wsm vs topsis when they disagree what to do |
| google | Learning | what is good wigth for gaming laptop in kg |
| google | Learning | batterly life for ultrabook  |
| vscode | Building | in my results step wsm is saying lenovo is winner but topsis is saying macbook is winner. how to handle this in ui without confusing user? i need to show a warning that algorithms disagree but still give a clear action to take, maybe tell them to compare both side by side because score diffrence is very tight |
| vscode | Building | im getting typescript error in ResultsStep.tsx ppty winnerareement does not exist on type TopsisResult | null'. |
| vscode | Building | i need a logic function to check budget. if user selected 50k budget and the winning laptop is 48k, i want to trigger a budget maxed warning |
| vscode | Building | implement these  |
| vscode | Building | possible graphs can be used in the resul section of dsc |
| vscode | Building | which is the best approach in a dsc is it wsm and topsis show different  or show only topsis| 
| vscode | Building | can we use wsm and topsis to show different results and let user choose which one to follow | 
| 

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
---

---


