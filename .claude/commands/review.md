---
description: Check the six documents against each other for gaps and contradictions.
argument-hint: [project folder name, optional]
---

Run the consistency check for the active project (or `$ARGUMENTS` if given).

1. Run `node scripts/validate.mjs projects/<slug>` first and fix structural errors.
2. Use the `consistency-reviewer` agent on `projects/<slug>`.
3. Translate its findings into plain English, grouped as "Must fix" and "Worth a look". For each, say which document it is in and propose the fix.
4. Apply the fixes the person agrees to, rebuild the deck if one exists, and say what changed.
