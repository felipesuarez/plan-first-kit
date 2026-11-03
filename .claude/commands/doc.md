---
description: Start, continue or redo one planning document (1 to 6).
argument-hint: <1-6> [what to change]
---

Work on a single document: $ARGUMENTS

1. The first word is the document number (1 to 6). If it is missing or not 1 to 6, ask which document they mean, listing the six names.
2. Find the active project in `projects/` (ask if there is more than one).
3. If the file does not exist yet, run the interview for that document following `kit/doc-specs.md` (confirm earlier documents exist first; if one is missing, offer to do that one first).
4. If the file exists and the person gave a change after the number, apply it directly, show a plain-English summary of what changed, and skip the interview.
5. If the file exists and no change was given, ask what they would like to change.
6. Check the "When an earlier document changes" section of `kit/doc-specs.md` and tell the person which later documents might now be out of date. Offer to update them.
7. Re-run `node scripts/validate.mjs projects/<slug>`. If a deck already exists, rebuild it with `node scripts/build-deck.mjs projects/<slug>`.
