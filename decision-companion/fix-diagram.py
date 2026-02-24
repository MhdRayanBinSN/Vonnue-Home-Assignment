import re

with open('docs/DIAGRAMS.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Replace lines 271-307 (0-indexed: 270-306) with WSM-only flowchart
replacement = [
    '                                 │     ┌─────────────────────────┐\n',
    '                                 │     │   Run WSM Algorithm     │\n',
    '                                 │     │  (Weighted Sum Model)   │\n',
    '                                 │     └───────────┬─────────────┘\n',
    '                                 │                 │\n',
    '                                 │                 ▼\n',
    '                                 │     ┌─────────────────────────┐\n',
    '                                 │     │   Min-Max Normalize     │\n',
    '                                 │     │   Scores (0-1 scale)    │\n',
    '                                 │     └───────────┬─────────────┘\n',
    '                                 │                 │\n',
    '                                 │                 ▼\n',
    '                                 │     ┌─────────────────────────┐\n',
    '                                 │     │   For each option:      │\n',
    '                                 │     │   Score = Σ(w_j × n_ij) │\n',
    '                                 │     └───────────┬─────────────┘\n',
    '                                 │                 │\n',
]

result = lines[:270] + replacement + lines[307:]

with open('docs/DIAGRAMS.md', 'w', encoding='utf-8') as f:
    f.writelines(result)

print("Done! Replaced the 3-algorithm flowchart with WSM-only version.")
