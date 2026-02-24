$lines = Get-Content 'docs\DIAGRAMS.md'

$replacement = @(
    '                                 │     ┌─────────────────────────┐'
    '                                 │     │   Run WSM Algorithm     │'
    '                                 │     │  (Weighted Sum Model)   │'
    '                                 │     └───────────┬─────────────┘'
    '                                 │                 │'
    '                                 │                 ▼'
    '                                 │     ┌─────────────────────────┐'
    '                                 │     │   Min-Max Normalize     │'
    '                                 │     │   Scores (0-1 scale)    │'
    '                                 │     └───────────┬─────────────┘'
    '                                 │                 │'
    '                                 │                 ▼'
    '                                 │     ┌─────────────────────────┐'
    '                                 │     │   For each option:      │'
    '                                 │     │   Score = Σ(w_j × n_ij) │'
    '                                 │     └───────────┬─────────────┘'
    '                                 │                 │'
)

$before = $lines[0..269]
$after = $lines[307..($lines.Length - 1)]
$result = $before + $replacement + $after

$result | Set-Content 'docs\DIAGRAMS.md' -Encoding UTF8
Write-Host "Done! Replaced lines 271-308 with WSM-only flowchart."
