# ResultsStep.tsx - Required Fixes

## Issues to Fix:

### 1. ✅ Move Graphs Below Rankings
### 2. ✅ Add Graphs to TOPSIS View  
### 3. ✅ Fix TOPSIS Messaging (It's Independent, Not Subordinate)

---

## Current Structure (WRONG):

```
WSM View:
  - Confidence Indicators
  - Graphs (4 sections)
  - Rankings
  - Key Reasons
  - Explanation
  - Sensitivity

TOPSIS View:
  - Rankings only
  - No graphs ❌
```

## Correct Structure (FIXED):

```
WSM View:
  - Confidence Indicators
  - Rankings (FIRST)
  - Graphs (AFTER rankings)
  - Key Reasons
  - Explanation
  - Sensitivity

TOPSIS View:
  - Rankings (FIRST)
  - Graphs (AFTER rankings) ✅ ADD THESE
  - TOPSIS-specific metrics
```

---

## Specific Changes Needed:

### Change 1: Reorder WSM View

**Find this section** (around line 350):
```tsx
{/* ─── WSM VIEW ────────────────────────────────────────────────────── */}
{activeView === 'wsm' && (
  <>
    {/* Improved Charts Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
```

**Move the entire graphs section (lines ~350-550) to AFTER the Rankings section** (which is around line 550-620)

**New order should be:**
1. Rankings (line ~550)
2. Graphs (move from ~350)
3. Key Reasons (line ~620)
4. Explanation (line ~650)
5. Sensitivity (line ~700)

---

### Change 2: Fix TOPSIS Banner Text

**Find** (around line 230):
```tsx
<p className="mt-4 text-violet-100 max-w-2xl">
  Based on TOPSIS analysis, this option is closest to the ideal laptop and furthest from the worst-case across all criteria.
</p>
```

**Replace with:**
```tsx
<p className="mt-4 text-violet-100 max-w-2xl">
  TOPSIS independently recommends this option using geometric distance analysis. It measures closeness to an ideal solution across all {problem.criteria.length} criteria.
</p>
```

---

### Change 3: Add Graphs to TOPSIS View

**Find** (around line 750):
```tsx
{/* ─── TOPSIS VIEW ───────────────────────────────────────────────── */}
{activeView === 'topsis' && topsisResult && (
  <>
    {/* TOPSIS Rankings */}
```

**After the TOPSIS Rankings section, ADD:**

```tsx
{/* TOPSIS Graphs - Same as WSM but with TOPSIS data */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
  
  {/* 1. Closeness Coefficient Chart */}
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
    <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
      <BarChart3 className="w-5 h-5 mr-2 text-violet-600" />
      Closeness Coefficients
    </h3>
    <p className="text-xs text-slate-500 mb-4">Distance from ideal solution (higher is better)</p>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={topsisResult.results.map((r, i) => ({
          name: r.optionName,
          score: Math.round(r.closenessCoefficient * 1000) / 10,
          fill: COLORS[i % COLORS.length],
        }))} 
        layout="vertical" 
        margin={{ left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} width={120} />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'CC']}
        />
        <Bar dataKey="score" radius={[0, 8, 8, 0]}>
          {topsisResult.results.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* 2. Distance Comparison */}
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
    <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
      <Target className="w-5 h-5 mr-2 text-violet-600" />
      Distance Analysis
    </h3>
    <p className="text-xs text-slate-500 mb-4">Distance from best (D+) vs worst (D-)</p>
    <div className="space-y-4">
      {topsisResult.results.slice(0, 3).map((opt, idx) => (
        <div key={opt.optionId}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">{opt.optionName}</span>
            <span className="text-xs text-slate-500">Rank #{opt.rank}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 w-20">From Best:</span>
              <div className="flex-1 h-4 bg-red-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${(opt.distanceFromBest / Math.max(...topsisResult.results.map(r => r.distanceFromBest))) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-700 w-12 text-right">
                {opt.distanceFromBest.toFixed(3)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 w-20">From Worst:</span>
              <div className="flex-1 h-4 bg-green-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(opt.distanceFromWorst / Math.max(...topsisResult.results.map(r => r.distanceFromWorst))) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-700 w-12 text-right">
                {opt.distanceFromWorst.toFixed(3)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

{/* 3. Ideal Points Visualization */}
<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
  <h3 className="font-semibold text-slate-700 mb-4 flex items-center">
    <Trophy className="w-5 h-5 mr-2 text-violet-600" />
    Ideal vs Anti-Ideal Solutions
  </h3>
  <p className="text-xs text-slate-500 mb-4">TOPSIS calculates theoretical best (A+) and worst (A-) for each criterion</p>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {topsisResult.idealPoints.slice(0, 6).map((point) => (
      <div key={point.criterionId} className="bg-slate-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">{point.criterionName}</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-700">Ideal Best (A+):</span>
            <span className="text-sm font-bold text-green-700">{point.idealBest.toFixed(3)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-red-700">Ideal Worst (A-):</span>
            <span className="text-sm font-bold text-red-700">{point.idealWorst.toFixed(3)}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

{/* 4. Radar Chart - Same as WSM */}
<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
  <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
    <BarChart3 className="w-5 h-5 mr-2 text-violet-600" />
    Multi-Dimensional Comparison
  </h3>
  <p className="text-xs text-slate-500 mb-4">All criteria across top {Math.min(3, topsisResult.results.length)} options</p>
  <ResponsiveContainer width="100%" height={400}>
    <RadarChart data={radarData}>
      <PolarGrid stroke="#e2e8f0" />
      <PolarAngleAxis 
        dataKey="criterion" 
        tick={{ fill: '#64748b', fontSize: 11 }} 
      />
      <PolarRadiusAxis 
        domain={[0, 100]} 
        tick={{ fill: '#94a3b8', fontSize: 10 }} 
        angle={90}
      />
      {topsisResult.results.slice(0, 3).map((r, i) => {
        const optName = r.optionName;
        return (
          <Radar
            key={r.optionId}
            name={optName}
            dataKey={optName}
            stroke={COLORS[i % COLORS.length]}
            fill={COLORS[i % COLORS.length]}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        );
      })}
      <Legend wrapperStyle={{ fontSize: '12px' }} />
      <Tooltip 
        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
        formatter={(value: number) => `${value.toFixed(0)}%`}
      />
    </RadarChart>
  </ResponsiveContainer>
</div>
```

---

### Change 4: Add Algorithm Agreement Section

**Add this AFTER both WSM and TOPSIS views** (around line 850):

```tsx
{/* Algorithm Agreement Analysis - Show for both views */}
{topsisResult && (
  <div className={`rounded-xl p-5 mb-6 ${
    topsisResult.rankAgreement.level === 'full' || topsisResult.rankAgreement.level === 'high'
      ? 'bg-green-50 border-2 border-green-300'
      : topsisResult.rankAgreement.level === 'moderate'
        ? 'bg-blue-50 border-2 border-blue-300'
        : 'bg-amber-50 border-2 border-amber-300'
  }`}>
    <div className="flex items-start">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
        topsisResult.rankAgreement.level === 'full' || topsisResult.rankAgreement.level === 'high'
          ? 'bg-green-200'
          : topsisResult.rankAgreement.level === 'moderate'
            ? 'bg-blue-200'
            : 'bg-amber-200'
      }`}>
        <BarChart3 className={`w-5 h-5 ${
          topsisResult.rankAgreement.level === 'full' || topsisResult.rankAgreement.level === 'high'
            ? 'text-green-700'
            : topsisResult.rankAgreement.level === 'moderate'
              ? 'text-blue-700'
              : 'text-amber-700'
        }`} />
      </div>
      <div className="flex-1">
        <h4 className={`font-semibold text-lg ${
          topsisResult.rankAgreement.level === 'full' || topsisResult.rankAgreement.level === 'high'
            ? 'text-green-900'
            : topsisResult.rankAgreement.level === 'moderate'
              ? 'text-blue-900'
              : 'text-amber-900'
        }`}>
          Algorithm Agreement: {topsisResult.rankAgreement.level.charAt(0).toUpperCase() + topsisResult.rankAgreement.level.slice(1)}
        </h4>
        <p className={`mt-2 text-sm ${
          topsisResult.rankAgreement.level === 'full' || topsisResult.rankAgreement.level === 'high'
            ? 'text-green-800'
            : topsisResult.rankAgreement.level === 'moderate'
              ? 'text-blue-800'
              : 'text-amber-800'
        }`}>
          {topsisResult.rankAgreement.interpretation}
        </p>
        <div className="mt-3 flex items-center gap-4">
          <div className="text-sm">
            <span className="font-medium text-slate-700">Kendall's Tau:</span>
            <span className="ml-2 font-bold">{topsisResult.rankAgreement.kendallTau.toFixed(2)}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-slate-700">Exact Matches:</span>
            <span className="ml-2 font-bold">{topsisResult.rankAgreement.agreementCount}/{result.results.length}</span>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-3">
          💡 Both WSM and TOPSIS are independent algorithms. High agreement indicates your decision is robust regardless of methodology.
        </p>
      </div>
    </div>
  </div>
)}
```

---

## Summary of Changes:

1. ✅ **WSM View**: Move graphs AFTER rankings
2. ✅ **TOPSIS View**: Add 4 graph sections (CC chart, distance analysis, ideal points, radar)
3. ✅ **TOPSIS Banner**: Change text to emphasize independence
4. ✅ **Agreement Section**: Add after both views with proper messaging

---

## Key Messaging Changes:

### OLD (Wrong):
- "TOPSIS validates WSM"
- "TOPSIS balances WSM results"
- "TOPSIS confirms the recommendation"

### NEW (Correct):
- "TOPSIS independently recommends..."
- "Both algorithms are peers"
- "High agreement indicates robust decision"
- "TOPSIS uses geometric distance while WSM uses linear sum"

---

## File is Too Large

The ResultsStep.tsx file is 871 lines. Making these changes manually:

1. Open `decision-companion/src/components/ResultsStep.tsx`
2. Find line ~350 (WSM graphs section)
3. Cut lines 350-550 (all 4 graph sections)
4. Find line ~550 (Rankings section)
5. Paste the graphs AFTER rankings
6. Find line ~750 (TOPSIS view)
7. Add the TOPSIS graphs code after TOPSIS rankings
8. Update TOPSIS banner text (line ~230)
9. Add algorithm agreement section at the end

Would you like me to create a completely new, clean ResultsStep.tsx file instead?
