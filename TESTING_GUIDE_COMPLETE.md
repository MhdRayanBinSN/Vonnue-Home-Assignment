# Complete Testing Guide - Decision Companion System

## Overview

This guide provides everything you need to test the Decision Companion System using the RAD (Rapid Application Development) approach.

---

## Quick Start (5 Minutes)

### Before You Begin
1. Ensure the app is running: `npm run dev`
2. Open browser: `http://localhost:3000`
3. Open browser console (F12) to check for errors
4. Have TEST_EXECUTION_LOG.md ready to fill out

### Quick Smoke Test
```
✅ App loads without errors
✅ Click "Choose from Presets"
✅ Select "Gaming Laptop"
✅ Click "View Results"
✅ Results display with graphs
✅ No console errors
```

If all ✅, proceed to full testing. If any ❌, fix before continuing.

---

## Testing Approach

### RAD Testing Pyramid

```
        Documentation Testing (15 min)
              ↑
        Edge Case Validation (30 min)
              ↑
    Manual Exploratory Testing (45 min)
              ↑
         Quick Smoke Test (5 min)
```

**Total Time**: 1.5 - 2 hours

---

## Test Execution Steps

### Step 1: Quick Smoke Test (5 min)
**File**: TEST_EXECUTION_LOG.md (Quick Test Checklist section)

Run through the 4 quick checks:
1. Core Functionality (5 items)
2. Practical Advice (4 items)
3. Edge Cases (4 items)
4. UI/UX (4 items)

**Pass Criteria**: All 17 items must pass

---

### Step 2: Happy Path Testing (10 min)
**File**: TEST_EXECUTION_LOG.md (Test Suite 1)

Test the main user journey:
1. Load preset
2. Toggle algorithms
3. View practical advice
4. Export results

**Pass Criteria**: 4/4 tests pass

---

### Step 3: Custom Decision Testing (15 min)
**File**: TEST_EXECUTION_LOG.md (Test Suite 2)

Test creating decisions from scratch:
1. Add options
2. Define criteria
3. Score and analyze

**Pass Criteria**: 3/3 tests pass

---

### Step 4: Filter Testing (10 min)
**File**: TEST_EXECUTION_LOG.md (Test Suite 3)

Test budget and threshold filters:
1. Budget filter
2. Threshold filter
3. All options filtered (error case)

**Pass Criteria**: 3/3 tests pass

---

### Step 5: Preset Testing (5 min)
**File**: TEST_EXECUTION_LOG.md (Test Suite 4)

Test all 10 presets load and work:
- Gaming Laptop
- Budget Student
- Professional Workstation
- Content Creator
- Ultraportable
- Mid-Range Professional
- Budget Gaming
- Premium Business
- Developer Laptop
- All-Rounder

**Pass Criteria**: 10/10 presets work

---

### Step 6: Algorithm Edge Cases (10 min)
**File**: TEST_EXECUTION_LOG.md (Test Suite 5)

Test algorithm-specific edge cases:
1. Algorithm disagreement
2. Tight race
3. Single option

**Pass Criteria**: 3/3 tests pass

---

### Step 7: Data Edge Cases (10 min)
**File**: TEST_EXECUTION_LOG.md (Test Suite 6)

Test data validation edge cases:
1. Missing scores
2. Weights don't sum to 100%
3. Zero-weight criterion

**Pass Criteria**: 3/3 tests pass

---

### Step 8: Domain Edge Cases (10 min)
**File**: TEST_EXECUTION_LOG.md (Test Suite 7)

Test laptop-specific edge cases:
1. Budget maxed
2. Heavy laptop
3. Poor battery

**Pass Criteria**: 3/3 tests pass

---

### Step 9: Documentation Testing (15 min)
**File**: TEST_EXECUTION_LOG.md (Test Suite 8)

Verify documentation matches reality:
1. README instructions work
2. Feature list is accurate
3. Edge cases are documented correctly

**Pass Criteria**: 3/3 tests pass

---

## Test Data

### Preset Test Data
All presets are pre-configured in `laptop-presets.ts`. Use them as-is.

### Custom Test Data

#### Test Case: Car Selection
```
Options:
- Toyota Camry: Price=₹25,00,000, Safety=8, Fuel=35 mpg
- Honda Accord: Price=₹24,00,000, Safety=9, Fuel=32 mpg
- Tesla Model 3: Price=₹45,00,000, Safety=10, Fuel=120 MPGe

Criteria:
- Price (30%, Cost)
- Safety (40%, Benefit)
- Fuel Efficiency (30%, Benefit)

Expected Winner: Honda Accord (best balance)
```

#### Test Case: Job Selection
```
Options:
- Google: Salary=₹50L, WLB=7, Growth=9, Location=8
- Microsoft: Salary=₹45L, WLB=8, Growth=8, Location=9
- Startup: Salary=₹30L, WLB=5, Growth=10, Location=10

Criteria:
- Salary (35%, Benefit)
- Work-Life Balance (25%, Benefit)
- Career Growth (25%, Benefit)
- Location (15%, Benefit)

Expected Winner: Google (highest salary + good growth)
```

---

## Expected Results

### Gaming Laptop Preset
```
Winner: Should be high-performance option
WSM Score: ~75-85%
TOPSIS Score: ~0.70-0.80
Confidence: High or Medium
Practical Advice: May warn about battery/weight
Use Case Fit: Gaming=Excellent, Portability=Fair/Poor
```

### Budget Student Preset
```
Winner: Should be affordable option
WSM Score: ~65-75%
TOPSIS Score: ~0.60-0.70
Confidence: Medium or Low (tight race expected)
Practical Advice: May suggest alternatives
Use Case Fit: Value=Excellent, Gaming=Fair/Poor
```

### Algorithm Disagreement Test
```
Setup: Set one criterion to 80% weight
Expected: WSM and TOPSIS may disagree
Agreement Level: Low or Moderate
Kendall's Tau: <0.7
Practical Advice: Should mention disagreement
```

---

## Common Issues & Solutions

### Issue 1: App Won't Start
```
Error: "Cannot find module..."
Solution: Run `npm install` again
```

### Issue 2: Graphs Not Rendering
```
Error: Recharts errors in console
Solution: Check if data is valid, refresh page
```

### Issue 3: Export Not Working
```
Error: File doesn't download
Solution: Check browser download settings
```

### Issue 4: Filters Not Working
```
Error: Options not filtered
Solution: Check if budget/thresholds are set correctly
```

### Issue 5: Practical Advice Not Showing
```
Error: Section is empty
Solution: Check if practical-advisor.ts is imported correctly
```

---

## Browser Testing

### Primary Browser: Chrome
- Test all features
- Check console for errors
- Verify responsive design

### Secondary Browsers (if time permits):
- Firefox: Check compatibility
- Safari: Check on Mac/iOS
- Edge: Check on Windows

### Mobile Testing:
- Open on phone/tablet
- Check responsive layout
- Test touch interactions

---

## Performance Testing (Optional)

### Load Time
```
Expected: <2 seconds for initial load
Measure: Chrome DevTools → Network tab
```

### Analysis Time
```
Expected: <500ms for analysis
Measure: Console.time() in decision-engine.ts
```

### Graph Rendering
```
Expected: <1 second for all graphs
Measure: Visual inspection
```

---

## Accessibility Testing (Optional)

### Keyboard Navigation
- [ ] Can tab through all interactive elements
- [ ] Can activate buttons with Enter/Space
- [ ] Focus indicators are visible

### Screen Reader
- [ ] Headings are properly structured
- [ ] Images have alt text
- [ ] Form labels are associated

### Color Contrast
- [ ] Text is readable
- [ ] Buttons have sufficient contrast
- [ ] Error messages are visible

---

## Security Testing (Optional)

### Input Validation
- [ ] Cannot inject HTML/JavaScript
- [ ] Cannot submit invalid data
- [ ] Error messages don't expose internals

### Data Privacy
- [ ] No sensitive data in console
- [ ] No sensitive data in URLs
- [ ] Export doesn't include PII

---

## Regression Testing

After fixing bugs, re-run:
1. Quick Smoke Test (5 min)
2. Affected test suites
3. Related edge cases

**Example**: If you fix budget filter bug:
- Re-run Test Suite 3 (Budget & Filters)
- Re-run Test Suite 7 (Domain Edge Cases)
- Re-run Quick Smoke Test

---

## Test Reporting

### Daily Report Template
```
Date: _______________
Tests Run: _______
Tests Passed: _______
Tests Failed: _______
Bugs Found: _______
Bugs Fixed: _______
Status: ✅ On Track / ⚠️ Issues / ❌ Blocked
```

### Bug Report Template
```
Bug ID: BUG-001
Title: _______________
Severity: Critical / High / Medium / Low
Steps to Reproduce:
1. _______________
2. _______________
3. _______________

Expected: _______________
Actual: _______________
Screenshot: _______________
```

---

## Definition of Done

### Feature is "Done" when:
✅ Functionality works as expected
✅ Edge cases are handled
✅ No console errors
✅ Responsive on mobile
✅ Documentation is updated
✅ Tests pass

### System is "Ready for Demo" when:
✅ All 10 presets work
✅ Custom decisions work end-to-end
✅ All filters work
✅ Both algorithms work
✅ Practical advice displays
✅ No critical bugs
✅ Documentation is complete
✅ Pass rate >95%

---

## Testing Tools

### Required
- Browser (Chrome recommended)
- Browser DevTools (F12)
- TEST_EXECUTION_LOG.md

### Optional
- Postman (for API testing)
- Lighthouse (for performance)
- axe DevTools (for accessibility)
- Jest (for unit tests)
- Playwright (for E2E tests)

---

## Testing Schedule

### Day 1: Core Features (1 hour)
- Quick Smoke Test
- Happy Path Testing
- Custom Decision Testing
- Preset Testing

### Day 2: Edge Cases (1 hour)
- Algorithm Edge Cases
- Data Edge Cases
- Domain Edge Cases
- Filter Testing

### Day 3: Polish (30 min)
- Documentation Testing
- Bug Fixes
- Regression Testing

### Before Demo: Final Check (15 min)
- Quick Smoke Test
- Load 3 random presets
- Create 1 custom decision
- Check practical advice

---

## Success Metrics

### Minimum Acceptable
- Pass Rate: >90%
- Critical Bugs: 0
- High Priority Bugs: <3
- Load Time: <3 seconds

### Target
- Pass Rate: >95%
- Critical Bugs: 0
- High Priority Bugs: 0
- Load Time: <2 seconds

### Excellent
- Pass Rate: 100%
- All Bugs: 0
- Load Time: <1 second
- Mobile Responsive: Perfect

---

## Post-Testing Actions

### If Pass Rate >95%
✅ System is ready for demo
✅ Document any minor issues
✅ Prepare demo script
✅ Practice demo flow

### If Pass Rate 85-95%
⚠️ Fix high priority bugs
⚠️ Re-test affected areas
⚠️ Document known issues
⚠️ Prepare workarounds for demo

### If Pass Rate <85%
❌ Stop and fix critical bugs
❌ Re-run full test suite
❌ Consider delaying demo
❌ Get help if needed

---

## Resources

### Documentation
- TESTING_STRATEGY_RAD.md - Testing approach
- TEST_EXECUTION_LOG.md - Test results template
- EDGE_CASES_HANDLED.md - Edge case reference
- FINAL_IMPLEMENTATION_SUMMARY.md - Feature reference

### Code Files
- decision-engine.ts - Core logic
- practical-advisor.ts - Practical advice
- ResultsStep.tsx - Results UI
- laptop-presets.ts - Test data

---

## Tips for Efficient Testing

### DO:
✅ Test in order (smoke → happy path → edge cases)
✅ Document issues immediately
✅ Fix critical bugs before continuing
✅ Take screenshots of bugs
✅ Test on real devices

### DON'T:
❌ Skip smoke test
❌ Test randomly without plan
❌ Ignore console errors
❌ Test only on desktop
❌ Forget to document results

---

## Conclusion

Follow this guide to systematically test your Decision Companion System. The RAD approach prioritizes:

1. **Speed**: 1.5-2 hours total
2. **Practicality**: Focus on user journeys
3. **Completeness**: Cover all critical paths
4. **Documentation**: Record everything

After completing all tests, you'll have:
- ✅ Confidence the system works
- ✅ Documentation of test results
- ✅ List of known issues
- ✅ Readiness for demo

**Good luck with testing!** 🚀
