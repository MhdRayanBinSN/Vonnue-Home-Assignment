# Testing Strategy - RAD Approach

## RAD Testing Philosophy

In RAD (Rapid Application Development), we focus on:
- ✅ **Fast feedback loops** - Test as you build
- ✅ **User-centric testing** - Does it work for real users?
- ✅ **Practical validation** - Does it solve the problem?
- ❌ **NOT exhaustive unit tests** - Too slow for RAD
- ❌ **NOT 100% code coverage** - Diminishing returns

---

## Testing Layers

### Layer 1: Manual Exploratory Testing (PRIMARY)
**Time**: 30-45 minutes
**Goal**: Validate all features work end-to-end

### Layer 2: Edge Case Validation (SECONDARY)
**Time**: 20-30 minutes
**Goal**: Verify edge cases are handled gracefully

### Layer 3: Documentation Testing (TERTIARY)
**Time**: 15-20 minutes
**Goal**: Ensure documentation matches reality

---

## Layer 1: Manual Exploratory Testing

### Test Suite 1: Happy Path (10 minutes)

#### Test 1.1: Load Preset & View Results
```
Steps:
1. Open application
2. Click "Choose from Presets"
3. Select "Gaming Laptop"
4. Click "View Results"

Expected:
✅ Results load in <1 second
✅ Winner is displayed with score
✅ WSM and TOPSIS tabs both work
✅ Graphs render correctly
✅ No console errors

Pass/Fail: _______
Notes: _______
```

#### Test 1.2: Toggle Between Algorithms
```
Steps:
1. From results page
2. Click "TOPSIS" tab
3. Click "WSM" tab
4. Repeat 3 times

Expected:
✅ Tabs switch instantly
✅ Data updates correctly
✅ Graphs re-render
✅ No flickering or errors

Pass/Fail: _______
Notes: _______
```

#### Test 1.3: View Practical Advice
```
Steps:
1. From results page
2. Scroll to "Should You Buy This?"
3. Click to expand
4. Read suggestions

Expected:
✅ Section expands smoothly
✅ Use case fit shows 4 ratings
✅ Suggestions are practical (not technical)
✅ Emojis display correctly

Pass/Fail: _______
Notes: _______
```

#### Test 1.4: Export Results
```
Steps:
1. From results page
2. Click "Export" button
3. Open downloaded JSON file

Expected:
✅ File downloads
✅ JSON is valid
✅ Contains problem, rankings, recommendation

Pass/Fail: _______
Notes: _______
```

---

### Test Suite 2: Create Custom Decision (15 minutes)

#### Test 2.1: Start from Scratch
```
Steps:
1. Click "Start from Scratch"
2. Enter title: "Choose a Car"
3. Add 3 options:
   - Toyota Camry
   - Honda Accord
   - Tesla Model 3
4. Click "Next"

Expected:
✅ Options saved
✅ Can proceed to criteria step
✅ No validation errors

Pass/Fail: _______
Notes: _______
```

#### Test 2.2: Define Criteria
```
Steps:
1. Add 3 criteria:
   - Price (30%, Cost)
   - Safety (40%, Benefit)
   - Fuel Efficiency (30%, Benefit)
2. Click "Next"

Expected:
✅ Criteria saved
✅ Weights sum to 100%
✅ Can proceed to scoring

Pass/Fail: _______
Notes: _______
```

#### Test 2.3: Score Options
```
Steps:
1. Score each option on each criterion
   - Toyota: Price=25000, Safety=8, Fuel=35
   - Honda: Price=24000, Safety=9, Fuel=32
   - Tesla: Price=45000, Safety=10, Fuel=120
2. Click "Analyze"

Expected:
✅ All scores accepted
✅ Analysis runs
✅ Results display
✅ Winner makes sense

Pass/Fail: _______
Notes: _______
```

---

### Test Suite 3: Budget & Filters (10 minutes)

#### Test 3.1: Set Budget Filter
```
Steps:
1. Load "Budget Student" preset
2. Set budget to ₹50,000
3. View results

Expected:
✅ Options >₹50k filtered out
✅ Filter message displayed
✅ Remaining options analyzed
✅ Practical advice mentions budget

Pass/Fail: _______
Notes: _______
```

#### Test 3.2: Set Minimum Thresholds
```
Steps:
1. Load "Mid-Range Professional" preset
2. Set minimum RAM: 16GB
3. Set minimum Battery: 8 hours
4. View results

Expected:
✅ Options not meeting thresholds filtered
✅ Filter reasons displayed
✅ Analysis runs on remaining options

Pass/Fail: _______
Notes: _______
```

#### Test 3.3: Filter Out All Options
```
Steps:
1. Load any preset
2. Set budget to ₹10,000 (unrealistically low)
3. Try to view results

Expected:
✅ Error message displayed
✅ Explains why (all filtered)
✅ Suggests relaxing constraints
✅ Can go back and adjust

Pass/Fail: _______
Notes: _______
```

---

### Test Suite 4: All Presets (5 minutes)

#### Test 4.1: Load Each Preset
```
Steps:
For each preset (10 total):
1. Load preset
2. View results
3. Check winner makes sense

Presets to test:
□ Gaming Laptop
□ Budget Student
□ Professional Workstation
□ Content Creator
□ Ultraportable
□ Mid-Range Professional
□ Budget Gaming
□ Premium Business
□ Developer Laptop
□ All-Rounder

Expected:
✅ All presets load
✅ All produce results
✅ Winners are reasonable
✅ No errors

Pass/Fail: _______
Notes: _______
```

---

## Layer 2: Edge Case Validation

### Test Suite 5: Algorithm Edge Cases (10 minutes)

#### Test 5.1: Algorithm Disagreement
```
Steps:
1. Load "Mid-Range Professional"
2. Adjust weights: Price=80%, all others=5%
3. View results
4. Check if WSM and TOPSIS agree

Expected:
✅ Algorithms may disagree
✅ Agreement section shows status
✅ Practical advice addresses disagreement
✅ No crashes

Pass/Fail: _______
Notes: _______
```

#### Test 5.2: Tight Race
```
Steps:
1. Load "Budget Student"
2. View results
3. Check score difference between top 2

Expected:
✅ If <5% difference, confidence is "Low"
✅ Practical advice suggests reviewing both
✅ Alternative section shows runner-up

Pass/Fail: _______
Notes: _______
```

#### Test 5.3: Single Option
```
Steps:
1. Start from scratch
2. Add only 1 option
3. Add criteria
4. Score and analyze

Expected:
✅ Analysis runs
✅ Confidence is "High" (no alternatives)
✅ No comparison graphs
✅ Practical advice adjusted

Pass/Fail: _______
Notes: _______
```

---

### Test Suite 6: Data Edge Cases (10 minutes)

#### Test 6.1: Missing Scores
```
Steps:
1. Start from scratch
2. Add 2 options, 2 criteria
3. Leave one score blank
4. Try to analyze

Expected:
✅ Validation error
✅ Specific field identified
✅ Cannot proceed until fixed

Pass/Fail: _______
Notes: _______
```

#### Test 6.2: Weights Don't Sum to 100%
```
Steps:
1. Start from scratch
2. Add criteria with weights: 30%, 30%, 30%
3. Proceed to scoring

Expected:
✅ Warning displayed
✅ "Will be normalized automatically"
✅ Analysis still works
✅ Results are correct

Pass/Fail: _______
Notes: _______
```

#### Test 6.3: Zero-Weight Criterion
```
Steps:
1. Start from scratch
2. Add criterion with 0% weight
3. Proceed to analysis

Expected:
✅ Warning displayed
✅ Suggests removing or adjusting
✅ Analysis still works

Pass/Fail: _______
Notes: _______
```

---

### Test Suite 7: Domain-Specific Edge Cases (10 minutes)

#### Test 7.1: Budget Maxed
```
Steps:
1. Load "Premium Business"
2. Set budget to ₹150,000
3. View results
4. Check if winner is close to budget

Expected:
✅ If winner >95% of budget, warning shown
✅ Practical advice mentions buffer
✅ Suggests considering runner-up

Pass/Fail: _______
Notes: _______
```

#### Test 7.2: Heavy Laptop
```
Steps:
1. Load "Gaming Laptop"
2. View results
3. Check winner's weight

Expected:
✅ If weight >2.2kg, warning shown
✅ Practical advice mentions portability
✅ Suggests lighter alternatives if available

Pass/Fail: _______
Notes: _______
```

#### Test 7.3: Poor Battery
```
Steps:
1. Load "Gaming Laptop"
2. View results
3. Check winner's battery

Expected:
✅ If battery <6h, warning shown
✅ Practical advice mentions power outlet
✅ Use case fit shows "Poor" for portability

Pass/Fail: _______
Notes: _______
```

---

## Layer 3: Documentation Testing

### Test Suite 8: Documentation Accuracy (15 minutes)

#### Test 8.1: README Instructions
```
Steps:
1. Open README.md
2. Follow setup instructions
3. Verify all commands work

Expected:
✅ npm install works
✅ npm run dev works
✅ Application opens at localhost:3000
✅ No missing dependencies

Pass/Fail: _______
Notes: _______
```

#### Test 8.2: Feature List Accuracy
```
Steps:
1. Open FINAL_IMPLEMENTATION_SUMMARY.md
2. Check each listed feature
3. Verify it exists in the app

Features to verify:
□ WSM algorithm
□ TOPSIS algorithm
□ Budget pre-filter
□ Minimum thresholds
□ Confidence indicators
□ Algorithm agreement
□ Practical advice
□ 8 graph types

Expected:
✅ All features exist
✅ All work as described

Pass/Fail: _______
Notes: _______
```

#### Test 8.3: Edge Cases Documentation
```
Steps:
1. Open EDGE_CASES_HANDLED.md
2. Pick 5 random edge cases
3. Try to trigger each one

Expected:
✅ Edge cases can be triggered
✅ Handled as documented
✅ No crashes

Pass/Fail: _______
Notes: _______
```

---

## Quick Test Checklist (5 minutes)

Use this for rapid validation before demos:

### Core Functionality
- [ ] Load preset → Results display
- [ ] WSM tab works
- [ ] TOPSIS tab works
- [ ] Graphs render
- [ ] Export works

### Practical Advice
- [ ] "Should You Buy This?" section exists
- [ ] Use case fit shows 4 ratings
- [ ] Suggestions are user-friendly
- [ ] No technical jargon

### Edge Cases
- [ ] Budget filter works
- [ ] Threshold filter works
- [ ] Algorithm disagreement handled
- [ ] Tight race detected

### UI/UX
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Loading states work
- [ ] Error messages are clear

---

## Test Results Template

### Test Session Information
```
Date: _______________
Tester: _______________
Environment: _______________
Browser: _______________
```

### Summary
```
Total Tests: _______
Passed: _______
Failed: _______
Skipped: _______
Pass Rate: _______%
```

### Critical Issues Found
```
1. _______________________________
2. _______________________________
3. _______________________________
```

### Minor Issues Found
```
1. _______________________________
2. _______________________________
3. _______________________________
```

### Recommendations
```
1. _______________________________
2. _______________________________
3. _______________________________
```

---

## Automated Testing (Optional - Post-RAD)

If you have time after RAD phase, add automated tests:

### Unit Tests (Jest + React Testing Library)
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

**Priority Tests:**
1. WSM algorithm correctness
2. TOPSIS algorithm correctness
3. Kendall's Tau calculation
4. Filter logic (budget, thresholds)
5. Practical advisor suggestions

### Integration Tests (Playwright)
```bash
npm install --save-dev @playwright/test
```

**Priority Tests:**
1. End-to-end preset flow
2. Custom decision creation
3. Budget filtering
4. Export functionality

---

## Testing Schedule (RAD Timeline)

### Day 1: Core Features (30 min)
- Test Suite 1: Happy Path
- Test Suite 2: Create Custom Decision

### Day 2: Edge Cases (30 min)
- Test Suite 5: Algorithm Edge Cases
- Test Suite 6: Data Edge Cases

### Day 3: Polish (30 min)
- Test Suite 3: Budget & Filters
- Test Suite 4: All Presets
- Test Suite 7: Domain-Specific

### Day 4: Documentation (20 min)
- Test Suite 8: Documentation Accuracy
- Quick Test Checklist

### Before Demo: Quick Check (5 min)
- Quick Test Checklist only

---

## Bug Tracking (Simple)

Use a simple markdown file for RAD:

### BUGS.md
```markdown
# Known Issues

## Critical (Blocks Demo)
- [ ] Issue 1: Description
- [ ] Issue 2: Description

## High (Should Fix)
- [ ] Issue 3: Description
- [ ] Issue 4: Description

## Medium (Nice to Have)
- [ ] Issue 5: Description
- [ ] Issue 6: Description

## Low (Future)
- [ ] Issue 7: Description
- [ ] Issue 8: Description

## Fixed
- [x] Issue 9: Description (Fixed on 2026-02-27)
```

---

## Testing Best Practices for RAD

### DO:
✅ Test manually first (fastest feedback)
✅ Focus on user journeys (not code coverage)
✅ Test edge cases that users will hit
✅ Document issues immediately
✅ Fix critical bugs before moving on
✅ Test on real devices (mobile, desktop)

### DON'T:
❌ Write tests before features (too slow)
❌ Aim for 100% coverage (diminishing returns)
❌ Test implementation details (brittle)
❌ Ignore user feedback (most valuable)
❌ Over-engineer test infrastructure
❌ Test things that can't break

---

## Demo Preparation Checklist

### 1 Day Before Demo:
- [ ] Run full test suite (Layer 1 + 2)
- [ ] Fix all critical bugs
- [ ] Test on demo machine
- [ ] Prepare backup plan (screenshots/video)

### 1 Hour Before Demo:
- [ ] Run Quick Test Checklist
- [ ] Clear browser cache
- [ ] Close unnecessary tabs
- [ ] Test internet connection (if needed)

### During Demo:
- [ ] Have backup preset ready
- [ ] Know which features to highlight
- [ ] Have edge case examples prepared
- [ ] Be ready to explain design decisions

---

## Success Criteria

Your system is ready for demo/submission when:

✅ All 10 presets load and produce results
✅ Custom decisions can be created end-to-end
✅ Budget and threshold filters work
✅ Both algorithms (WSM + TOPSIS) work
✅ Practical advice displays correctly
✅ No console errors in happy path
✅ Edge cases are handled gracefully
✅ Documentation matches implementation
✅ Export functionality works
✅ Responsive on mobile and desktop

---

## Time Investment

### Minimum (RAD Approach): 1.5 hours
- Layer 1: Manual Exploratory (45 min)
- Layer 2: Edge Cases (30 min)
- Quick Checklist (15 min)

### Recommended: 2.5 hours
- Layer 1: Manual Exploratory (45 min)
- Layer 2: Edge Cases (45 min)
- Layer 3: Documentation (30 min)
- Quick Checklist (15 min)
- Bug fixes (15 min)

### Comprehensive: 4 hours
- All layers (2.5 hours)
- Automated tests (1 hour)
- Performance testing (30 min)

---

## Conclusion

For RAD approach:
1. **Prioritize manual testing** - Fastest feedback
2. **Focus on user journeys** - Not code coverage
3. **Test edge cases users will hit** - Not theoretical ones
4. **Document as you go** - Don't wait until end
5. **Fix critical bugs immediately** - Don't accumulate debt

Your system is complex enough that manual testing is actually MORE efficient than writing automated tests during RAD phase. Save automation for post-launch maintenance.

**Recommended**: Spend 2.5 hours on manual testing, document results, fix critical bugs, and you're ready for demo!
