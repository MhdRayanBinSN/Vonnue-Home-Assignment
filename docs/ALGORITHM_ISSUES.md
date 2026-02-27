# Algorithm Issues Analysis - Feb 27, 2026

## Current Algorithms: WSM & TOPSIS

### ✅ Strengths (What's Working)

1. **Mathematically Correct Implementation**
   - WSM: Proper min-max normalization with cost/benefit handling
   - TOPSIS: Correct vector normalization and Euclidean distance calculation
   - Kendall's Tau for rank agreement is properly implemented

2. **Edge Case Handling**
   - Zero weights → uniform distribution
   - Identical values → neutral score (0.5)
   - Division by zero protection

3. **Good Architecture**
   - Strategy pattern allows easy algorithm swapping
   - Pure functions in utils.ts
   - Clear separation of concerns

---

## ⚠️ Potential Issues & Limitations

### 1. **Compensatory Nature of WSM (Inherent Limitation)**

**Problem:** A laptop can have terrible battery (1 hour) but still rank #1 if it dominates other criteria.

**Example:**
```
Laptop A: CPU=10/10, GPU=10/10, Battery=1/10, Price=10/10
Laptop B: CPU=7/10, GPU=7/10, Battery=8/10, Price=7/10

WSM might rank A higher even though 1-hour battery is a deal-breaker.
```

**Impact:** Medium - This is inherent to WSM, not a bug

**Solution:** 
- ✅ Already implemented: Budget pre-filter
- 🔄 Could add: Minimum threshold filters (e.g., "battery must be ≥5 hours")
- 🔄 Could add: Veto criteria (automatic disqualification)

---

### 2. **TOPSIS Can Rank Mediocre Options High**

**Problem:** TOPSIS favors "balanced" options. A laptop that's average at everything can beat a specialist.

**Example:**
```
Gaming Laptop: CPU=9, GPU=10, Battery=3, Weight=4 (specialist)
All-rounder:   CPU=7, GPU=7,  Battery=7, Weight=7 (balanced)

TOPSIS might rank the all-rounder higher because it's "closer to ideal" overall.
```

**Impact:** Medium - User might want the gaming laptop for gaming, but TOPSIS picks the balanced one

**Solution:**
- ✅ Already implemented: Use-case presets adjust weights
- ✅ Already implemented: Show both WSM and TOPSIS results
- 🔄 Could add: "Specialist vs Generalist" preference toggle

---

### 3. **Outliers Affect Min-Max Normalization**

**Problem:** One extremely expensive laptop skews the price normalization.

**Example:**
```
Laptops: ₹50K, ₹60K, ₹70K, ₹500K (outlier)

After normalization:
₹50K  → 0.0 (best)
₹60K  → 0.022 (almost same as ₹50K)
₹70K  → 0.044 (almost same as ₹50K)
₹500K → 1.0 (worst)

The ₹10K difference between ₹50K and ₹60K becomes negligible.
```

**Impact:** High - Price differences get compressed

**Solution:**
- ✅ Already implemented: Budget filter removes outliers
- 🔄 Could add: Robust normalization (use median instead of min/max)
- 🔄 Could add: Outlier detection and warning

---

### 4. **Zero-Range Criterion Returns 0.5 (Neutral)**

**Problem:** If all laptops have the same RAM (16GB), the algorithm gives everyone 0.5 score.

**Current Code:**
```typescript
if (range === 0) {
    matrix[opt.id][criterion.id] = 0.5;
}
```

**Impact:** Low - This is reasonable, but could be improved

**Issue:** 0.5 still contributes to the weighted sum. If RAM weight is 10%, every laptop gets 0.05 points from RAM even though it doesn't differentiate them.

**Better Solution:**
```typescript
if (range === 0) {
    // Don't contribute to score at all
    matrix[opt.id][criterion.id] = 0;
    // OR redistribute weight to other criteria
}
```

**Recommendation:** Keep current behavior (0.5) - it's mathematically neutral and doesn't bias results.

---

### 5. **Criteria Independence Assumption**

**Problem:** WSM and TOPSIS assume criteria are independent. But some criteria are correlated:
- High TDP → Lower battery life
- High GPU → Higher price
- Larger display → Heavier weight

**Example:**
```
If TDP=150W and Battery=15hrs, something is wrong.
But the algorithm doesn't detect this contradiction.
```

**Impact:** Low - Users unlikely to input contradictory data

**Solution:**
- 🔄 Could add: Correlation detection and warnings
- 🔄 Could add: Constraint validation (e.g., "High TDP + Long battery is unrealistic")

---

### 6. **Weight Sensitivity Not Shown to User**

**Problem:** Users don't know which criteria are "critical" (small weight change = big rank change).

**Current:** Sensitivity analysis only runs on WSM, not TOPSIS

**Impact:** Medium - Users might not realize their decision is fragile

**Solution:**
- 🔄 Add TOPSIS sensitivity analysis
- 🔄 Show "critical criteria" badge in UI
- 🔄 Add weight slider with live rank preview

---

### 7. **No Handling of Missing Scores**

**Current Code:**
```typescript
const rawScore = option.scores[criterion.id] ?? 0;
```

**Problem:** Missing score defaults to 0, which is treated as "worst possible value"

**Example:**
```
If a laptop has no GPU score (integrated graphics), it gets 0.
But 0 might be worse than the worst discrete GPU in the comparison.
```

**Impact:** Medium - Could unfairly penalize options with missing data

**Solution:**
- 🔄 Treat missing as "unknown" and exclude from that criterion
- 🔄 Use average of other options
- 🔄 Warn user about missing data

---

### 8. **Rank Ties Not Handled**

**Problem:** If two laptops have identical scores, they get different ranks based on array order.

**Current:** First one in array gets better rank (arbitrary)

**Impact:** Low - Unlikely with real benchmark data

**Solution:**
- 🔄 Assign same rank to tied options (e.g., both get rank 2, next is rank 4)
- 🔄 Show "Tied" badge in UI

---

### 9. **No Confidence Intervals**

**Problem:** System doesn't show margin of error or confidence.

**Example:**
```
Laptop A: 87.3%
Laptop B: 87.1%

Is this a meaningful difference or just noise?
```

**Impact:** Medium - Users might over-trust small differences

**Solution:**
- 🔄 Calculate confidence intervals based on score margins
- 🔄 Show "Too close to call" when difference < 5%
- 🔄 Add Monte Carlo simulation for weight uncertainty

---

### 10. **TOPSIS Ideal Points Can Be Unrealistic**

**Problem:** TOPSIS creates an "ideal laptop" by taking the best value from each criterion.

**Example:**
```
Ideal: CPU=28000, GPU=20000, Price=₹20000, TDP=15W, Battery=24hrs

This laptop doesn't exist and never will.
```

**Impact:** Low - This is how TOPSIS works by design

**Note:** This is not a bug, but users might misunderstand what "distance from ideal" means.

**Solution:**
- 🔄 Add explanation: "Ideal is theoretical, not a real product"
- 🔄 Show ideal point values in UI for transparency

---

## 🎯 Priority Issues to Fix

### Critical (Should Fix Before Submission)
None - The algorithms are mathematically sound.

### High Priority (Nice to Have)
1. **Add minimum threshold filters** - Prevent deal-breaker scenarios
2. **Add TOPSIS sensitivity analysis** - Show robustness for both algorithms
3. **Handle outliers better** - Warn when one option skews normalization

### Medium Priority (Future Enhancement)
4. **Detect missing scores** - Warn user instead of defaulting to 0
5. **Show confidence intervals** - Indicate when differences are too small to matter
6. **Add rank tie handling** - Assign same rank to identical scores

### Low Priority (Academic Interest)
7. **Correlation detection** - Warn about contradictory criteria values
8. **Specialist vs Generalist toggle** - Let user prefer balanced or specialized options

---

## 🔬 Mathematical Correctness Verification

### WSM Formula: ✅ Correct
```
Score(i) = Σ(w_j × n_ij)
where n_ij = (x_ij - min_j) / (max_j - min_j)  [benefit]
         or  (max_j - x_ij) / (max_j - min_j)  [cost]
```

### TOPSIS Formula: ✅ Correct
```
1. r_ij = x_ij / √(Σ x_ij²)
2. v_ij = w_j × r_ij
3. A+ = {max(v_ij) for benefit, min(v_ij) for cost}
4. A- = {min(v_ij) for benefit, max(v_ij) for cost}
5. D+ = √Σ(v_ij - A+_j)²
6. D- = √Σ(v_ij - A-_j)²
7. CC = D- / (D+ + D-)
```

### Kendall's Tau: ✅ Correct
```
τ = (concordant - discordant) / (n(n-1)/2)
```

---

## 📊 Comparison with Academic Standards

| Aspect | Your Implementation | Academic Standard | Status |
|--------|-------------------|-------------------|--------|
| WSM Normalization | Min-Max | Min-Max or Sum | ✅ Correct |
| TOPSIS Normalization | Vector | Vector | ✅ Correct |
| Cost Criterion Handling | Inverted | Inverted | ✅ Correct |
| Weight Normalization | Sum to 1 | Sum to 1 | ✅ Correct |
| Ideal Point Calculation | Max/Min | Max/Min | ✅ Correct |
| Distance Metric | Euclidean | Euclidean | ✅ Correct |
| Rank Agreement | Kendall's Tau | Kendall's Tau or Spearman | ✅ Correct |

---

## 🎓 Conclusion

**Your algorithms are mathematically sound and correctly implemented.**

The "issues" listed above are mostly:
1. **Inherent limitations** of WSM/TOPSIS (not bugs)
2. **Edge cases** that are already handled reasonably
3. **Nice-to-have features** for advanced users

For a 2-week assignment, your implementation is excellent. The algorithms follow academic standards and handle edge cases properly.

---

## 💡 Recommendation for Submission

**Don't change the core algorithms.** They're correct.

**Do add (if time permits):**
1. Minimum threshold filters (extends budget filter concept)
2. Better outlier handling (warn user)
3. Confidence indicators (show when differences are small)

**Document in README:**
- WSM is compensatory (high score on one criterion can offset low score on another)
- TOPSIS favors balanced options
- Both algorithms assume criteria independence
- Budget filter and use-case presets mitigate these limitations

This shows you understand the algorithms' strengths AND limitations - exactly what Vonnue wants to see.
