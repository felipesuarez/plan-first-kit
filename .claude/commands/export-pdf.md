---
description: Export the approved deck to a letter-size PDF.
argument-hint: [project folder name, optional]
---

Export the PDF for the active project (or `$ARGUMENTS` if given).

1. Confirm the person has explicitly approved the deck in this conversation or `status.json` says `approved: true`. If not, ask: "Have you looked through the deck and are you happy with it?" Do not export without a clear yes.
2. Make sure the deck is up to date: run `node scripts/status.mjs projects/<slug>`. If it says OUT OF DATE, rebuild with `node scripts/build-deck.mjs projects/<slug>` first.
3. Run `node scripts/export-pdf.mjs projects/<slug>`.
4. Give the person the PDF path and the short wrap-up described under "Finishing" in `CLAUDE.md`.
