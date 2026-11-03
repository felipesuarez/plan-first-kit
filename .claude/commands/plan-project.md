---
description: Plan a website, portal, app or SaaS. Interviews you, writes six planning documents, builds a deck, exports a PDF.
argument-hint: [project name, optional]
---

Run the full Plan-First Kit workflow described in `CLAUDE.md`.

Project name given by the person (may be empty): $ARGUMENTS

1. Follow "First run" if no project exists, or resume the project the person picks. Resume at the first document that is not approved in `status.json`.
2. Take the six documents in order, one interview at a time, following `kit/doc-specs.md`.
3. After Document 6, run validation and the consistency reviewer, build the deck, and enter the approval loop.
4. Export the PDF only after the person says it is approved.

Start now. Your first message should welcome the person in a few short lines and ask the first question.
