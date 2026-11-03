---
description: Rebuild the HTML deck from the six documents.
argument-hint: [project folder name, optional]
---

Rebuild the deck for the active project (or `$ARGUMENTS` if given).

1. Run `node scripts/validate.mjs projects/<slug>`. If there are ERRORs, explain them in plain English and offer to fix them. If documents are missing, offer a partial preview with `--allow-missing` instead.
2. Run `node scripts/build-deck.mjs projects/<slug>`.
3. Tell the person the deck is at `projects/<slug>/deck.html` and offer to open it. Remind them they can say "change Doc N: …" or "approved".
