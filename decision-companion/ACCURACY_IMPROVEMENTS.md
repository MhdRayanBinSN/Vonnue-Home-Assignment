# Accuracy Improvements - Feb 27, 2026

## Overview

This document details the three major accuracy improvements implemented to enhance the mathematical precision and real-world applicability of the Decision Companion System.

---

## 1. Budget Pre-Filter (Critical Impact)

### Problem Identified
Previously, the Price criterion was just another weighted factor in the MCDM algorithms. This meant:
- A ₹2,00,000 MacBook could rank #1 even if the user's budget was ₹50,000
- The algorithm would mathematically "recommend" unaffordable options
- Users had to manually ignore out-of-budget recommendations

### Solution Implemented
**Hard budget filtering BEFORE algorithm execution**

#### Technical Implementation
```typescript
// In DecisionProblem interface (types.ts)
budgetLimit?: number; // Maximum budget filter (optional)

// In DecisionEngine.analyze() (decision-engine.ts)
private applyFilters(): {
  filteredOptions: typeof this.problem.options;
  filteredOutCount: number;
  filteredOutReasons: string[];
}
```

#### How It Works
1. User sets optional budget limit in PresetSelector step (e.g., ₹100,000)
2. Before running WSM/TOPSIS, the engine filters out all options where `price > budgetLimit`
3. Algorithms only see affordable options
4. Results show how many options were filtered and why

#### Impact on Accuracy
- **Eliminates unrealistic recommendations** - No more suggesting ₹2L laptops to students with ₹50K budget
- **Improves ranking quality** - Algorithms compare only viable alternatives
- **Matches real-world decision-making** - Budget is a hard constraint, not a soft preference

#### UI Changes
- Budget input field added to PresetSelector (Step 0)
- Filtered options count displayed in ResultsStep
- Clear messaging: "X options exceeded budget of ₹Y"

---

## 2. TDP as Independent Criterion (Mathematical Accuracy)

### Problem Identified
TDP (Thermal Design Power) was hidden inside GPU model names:
- "NVIDIA RTX 4060 — Low Power 40W" vs "NVIDIA RTX 4060 — High Power 115W"
- The TOPSIS Euclidean distance math saw two different GPU scores (8500 vs 13500)
- But it didn't understand WHY they differed
- TDP affects heat, noise, battery drain, and throttling — critical for real-world performance

### Solution Implemented
**TDP extracted as a standalone cost criterion**

#### Technical Implementation
```typescript
// New criterion in LAPTOP_CRITERIA (laptop-presets.ts)
{
  id: 'tdp',
  name: 'TDP (Power Draw)',
  weight: 5,
  type: 'cost', // Lower is better
  description: 'Thermal Design Power in Watts — affects heat, noise, and battery drain',
  minValue: 15,
  maxValue: 150,
}

// New input config
tdp: {
  type: 'select',
  options: [
    { label: '15W (Ultra Low Power - Fanless)', value: 15 },
    { label: '28W (Low Power - Thin & Light)', value: 28 },
    { label: '35W (Efficient - Ultrabooks)', value: 35 },
    { label: '45W (Standard - Mainstream)', value: 45 },
    { label: '65W (Performance - Gaming/Workstation)', value: 65 },
    { label: '80W (High Performance)', value: 80 },
    { label: '115W (Maximum Performance)', value: 115 },
    { label: '150W+ (Desktop Replacement)', value: 150 },
  ],
}
```

#### How It Works
1. TDP is now a separate numeric axis in the decision space
2. TOPSIS calculates distance from ideal TDP (lower is better for efficiency)
3. WSM applies TDP weight independently from GPU performance
4. Users can adjust TDP importance based on use case:
   - Business/Student: Higher TDP weight (prioritize battery life)
   - Gaming: Lower TDP weight (prioritize raw performance)

#### Impact on Accuracy
- **Separates performance from efficiency** - A high-TDP GPU is powerful but drains battery
- **Enables trade-off analysis** - "This laptop is 10% faster but uses 50% more power"
- **Improves TOPSIS geometry** - Distance calculations now account for power efficiency as a distinct dimension

#### Weight Adjustments
Updated preset weights to accommodate TDP:
- Software Dev: `tdp: 4%` (moderate importance)
- Gaming: `tdp: 5%` (willing to sacrifice efficiency for performance)
- Business: `tdp: 5%` (efficiency matters for all-day battery)
- Student: `tdp: 3%` (budget matters more than power efficiency)

---

## 3. Price-to-Performance Ratio (Value Analysis)

### Problem Identified
The system could recommend expensive laptops without considering value:
- A ₹2L laptop with 22000 CPU score vs ₹50K laptop with 10000 CPU score
- The expensive one is 2.2× faster but costs 4× more
- No metric showed "bang for buck"

### Solution Implemented
**Auto-calculated derived metric: Price-to-Performance**

#### Technical Implementation
```typescript
// New criterion (laptop-presets.ts)
{
  id: 'pricePerformance',
  name: 'Price-to-Performance',
  weight: 0, // Derived metric, not weighted by default
  type: 'benefit',
  description: 'Value score: (CPU + GPU) / Price — bang for buck (auto-calculated)',
  minValue: 0,
  maxValue: 1,
}

// Calculation function
export function calculatePricePerformance(cpu: number, gpu: number, price: number): number {
  if (price <= 0) return 0;
  return ((cpu + gpu) / price) * 1000; // Multiply by 1000 for readable scale
}

// Auto-calculation in DecisionEngine.analyze()
private calculateDerivedMetrics(): void {
  for (const option of this.problem.options) {
    const cpu = option.scores['cpu'] || 0;
    const gpu = option.scores['gpu'] || 0;
    const price = option.scores['price'] || 1;
    
    option.scores['pricePerformance'] = ((cpu + gpu) / price) * 1000;
  }
}
```

#### How It Works
1. Before running algorithms, engine calculates: `(CPU_score + GPU_score) / Price × 1000`
2. Higher score = better value (more performance per rupee)
3. Users can optionally weight this criterion (default: 0% for most presets)
4. Student preset gives it 5% weight (value-conscious buyers)

#### Example Calculations
| Laptop | CPU | GPU | Price | Formula | P2P Score |
|--------|-----|-----|-------|---------|-----------|
| MacBook Pro 14" | 22000 | 11000 | ₹199900 | (22000+11000)/199900×1000 | 165.08 |
| HP Pavilion 15 | 9500 | 1200 | ₹55000 | (9500+1200)/55000×1000 | 194.55 |
| ASUS ROG G14 | 20000 | 11000 | ₹159900 | (20000+11000)/159900×1000 | 193.87 |

**Insight:** The HP Pavilion has the best value despite lower absolute performance.

#### Impact on Accuracy
- **Reveals hidden value** - Budget laptops can score higher on value metrics
- **Balances absolute vs relative performance** - Not just "fastest" but "best for the money"
- **Helps budget-conscious users** - Student preset now factors in value automatically

#### Weight Adjustments
- Student preset: `pricePerformance: 5%` (value matters)
- All other presets: `pricePerformance: 0%` (optional, user can enable)

---

## Combined Impact

### Before Improvements
```
User: "I need a laptop under ₹80,000 for software development"
System: "I recommend MacBook Pro 14" (₹199,900) - Score: 87.3%"
User: "That's 2.5× my budget..."
```

### After Improvements
```
User: "I need a laptop under ₹80,000 for software development"
[Sets budget: ₹80,000]
System: "2 options exceeded budget and were filtered out."
System: "I recommend Acer Nitro V 15 (₹72,990) - Score: 78.5%"
System: "This option offers strong value (P2P: 246.57) with moderate TDP (65W)."
```

---

## Technical Architecture Changes

### Type System Updates
```typescript
// types.ts
export interface DecisionProblem {
  // ... existing fields
  budgetLimit?: number;
  minThresholds?: Record<string, number>;
}

export interface DecisionResult {
  // ... existing fields
  filteredOutCount?: number;
  filteredOutReasons?: string[];
}
```

### Algorithm Flow Changes
```
Old Flow:
1. Validate inputs
2. Normalize weights
3. Run WSM/TOPSIS
4. Rank results

New Flow:
1. Validate inputs
2. Auto-calculate derived metrics (P2P)
3. Apply budget/threshold filters
4. Normalize weights
5. Run WSM/TOPSIS on filtered options
6. Rank results
7. Report filtered count
```

### Preset Weight Rebalancing
All preset weights were adjusted to sum to 100% after adding TDP:
- Reduced CPU/GPU weights slightly to accommodate TDP
- Student preset now includes 5% for price-to-performance
- Total criteria increased from 12 to 14

---

## Testing Recommendations

### Test Case 1: Budget Filter
1. Add 6 sample laptops (prices: ₹55K, ₹73K, ₹140K, ₹150K, ₹160K, ₹200K)
2. Set budget: ₹100,000
3. Expected: 4 options filtered out, only 2 analyzed

### Test Case 2: TDP Impact
1. Compare two identical laptops except TDP (45W vs 115W)
2. Use Business preset (TDP weight: 5%)
3. Expected: Lower TDP laptop ranks higher despite same performance

### Test Case 3: Price-to-Performance
1. Use Student preset (P2P weight: 5%)
2. Compare ₹50K laptop (CPU: 10000) vs ₹200K laptop (CPU: 22000)
3. Expected: Budget laptop gets bonus points for value

---

## Future Enhancements (Not Implemented Yet)

### 4. Minimum Threshold Filters
Allow users to set deal-breakers:
- "Must have at least 16GB RAM"
- "Battery must be at least 10 hours"
- Filter out options that don't meet minimums

### 5. Real Pixel Density for Resolution
Replace arbitrary resolution tiers (2, 5, 7, 9) with actual PPI:
```typescript
ppi = sqrt(width² + height²) / diagonal_inches
```

### 6. Battery Efficiency Score
Combine battery capacity with TDP:
```typescript
batteryEfficiency = battery_wh / tdp_watts
```

### 7. Confidence Scoring
Show users how confident the system is:
- High: Winner beats runner-up by >20%
- Medium: Winner beats runner-up by 5-20%
- Low: Winner beats runner-up by <5%

---

## Commit Message

```
feat: implement budget filter, TDP criterion, and price-to-performance ratio

BREAKING CHANGES:
- Added budgetLimit and minThresholds to DecisionProblem interface
- Added filteredOutCount and filteredOutReasons to DecisionResult
- Increased criteria count from 12 to 14 (added TDP and pricePerformance)
- Rebalanced all preset weights to accommodate new criteria

IMPROVEMENTS:
1. Budget Pre-Filter
   - Hard filter removes options above budget BEFORE analysis
   - Eliminates unrealistic recommendations
   - Shows filtered count in results

2. TDP as Independent Criterion
   - Extracted from GPU model names
   - Enables power efficiency vs performance trade-offs
   - Improves TOPSIS geometric accuracy

3. Price-to-Performance Ratio
   - Auto-calculated: (CPU + GPU) / Price × 1000
   - Shows "bang for buck" value
   - Weighted 5% in Student preset

ACCURACY IMPACT:
- Budget filter prevents recommending ₹2L laptops to ₹50K budget users
- TDP separation enables efficiency-conscious decisions
- P2P ratio reveals hidden value in budget options

Files changed:
- src/lib/types.ts (added budgetLimit, filteredOutCount)
- src/lib/laptop-presets.ts (added TDP, P2P criteria)
- src/lib/decision-engine.ts (added filtering logic)
- src/components/PresetSelector.tsx (added budget input)
- src/components/ResultsStep.tsx (show filtered info)
```

---

## Documentation Updates Needed

### README.md
Add section explaining:
- Budget filtering feature
- TDP as power efficiency metric
- Price-to-performance value analysis

### BUILD_PROCESS.md
Add Feb 27 entry:
- Why budget filtering was critical
- TDP extraction rationale
- P2P calculation methodology

### RESEARCH_LOG.md
Add queries:
- "How to implement budget constraints in MCDM"
- "TDP impact on laptop performance"
- "Price-to-performance ratio calculation"

---

## Conclusion

These three improvements significantly enhance the system's accuracy and real-world applicability:

1. **Budget Filter** - Prevents mathematically correct but practically useless recommendations
2. **TDP Criterion** - Separates raw performance from power efficiency for better trade-off analysis
3. **Price-to-Performance** - Reveals value, helping budget-conscious users find the best bang for buck

The system now makes recommendations that are not just mathematically optimal, but also practically feasible and value-conscious.
