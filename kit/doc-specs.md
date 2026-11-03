# Document specs

This file is the playbook for the six documents. For each one it says what to read first, which questions to ask (with an example answer from the Tidewater Pottery example), the exact file structure, and what the person should check. Headings and table column names are fixed because the deck builder and the validator depend on them. Everything else is free.

General rules for every interview:

- One question at a time. Plain English. Never ask for more than 10 questions in total per document.
- Under each question show a short **example answer** from the Tidewater example, in italics, so the person can see what good looks like. Offer: "Not sure? Say **suggest** and I'll propose something you can edit."
- If an answer is vague, ask one follow-up, then move on. Do not interrogate.
- Never decide for the person. If a choice is theirs (a payment provider, a launch date, who can see what), list it under "decisions" instead of picking silently.
- Write in the person's own words where possible. Keep jargon out; if a technical word is unavoidable, explain it in the same sentence.
- When writing the file, keep it to about one page (two for the App Flow).

---

## Document 1: Product requirements

**File:** `01-product-requirements.md`
**Reads first:** `project.json` only.
**Purpose:** What the product does, feature by feature. If it is not here, it is not in the build.

### Questions

1. In one sentence, what do you want built? *Example: A website where people book pottery classes, manage a membership, and see when their pieces are ready.*
2. What does your business do, and who are your customers? *Example: A pottery studio with about 400 members and walk-in visitors.*
3. Who will use it? List every kind of person. *Example: Visitors, members, six part-time instructors, three studio staff.*
4. For each kind of person, what are the one to three things they must be able to do? *Example: Members: book a class, see their pieces. Staff: update kiln batches.*
5. How do people do these things today, and what is the most annoying part? *Example: Instagram messages and a spreadsheet. Members keep asking "is my bowl ready?"*
6. For each thing, how would you know it works? Finish the sentence "It is done when…". *Example: …a booked seat appears on the instructor's class list and the member gets an email within a minute.*
7. What must NOT be in the first version? *Example: A shop, a phone app, gift vouchers.*
8. Any hard limits: numbers of users, dates, rules, legal needs? *Example: About 400 members; launch before the spring term.*
9. Is there an existing website or tool that must stay? *Example: The Google Calendar timetable stays.*

### File structure

```
# <Project name>: Product requirements
## Goal                 (one or two sentences)
## Who uses it          (bullet list)
## Features             (table: Feature | Who uses it | Done when)
## Not in this version  (short paragraph or list)
```

### Person checks

Anything they assumed was included but is not listed. Every "done when" must be something they could check themselves in under a minute. If a "done when" is vague ("works well"), rewrite it with them.

---

## Document 2: Technical requirements

**File:** `02-technical-requirements.md`
**Reads first:** Document 1.
**Purpose:** The tools it is built on, decided once and written down.

### Questions

1. Which tools do you already pay for or use every day? (calendar, email, payments, accounting, newsletter, CRM) *Example: Google Calendar, Mailchimp, Xero.*
2. Where are you and your customers based, and which payment providers actually work for you there? *Example: United States; Stripe, Square or PayPal all work.* (If unsure, say so and flag it as a decision.)
3. Who will look after it after launch, and how technical are they? *Example: Nobody technical, so choose hosting that needs no server care.*
4. Do people need to log in? How would they prefer to? *Example: Yes, members. An emailed link, no passwords.*
5. Any privacy, legal or language requirements? *Example: Customers in the EU, so consent for the newsletter.*
6. Roughly how many people will use it at once, and is that growing? *Example: 400 members, a few dozen at a time.*
7. What is the monthly budget for tools? *Example: Under $150 a month.*

Claude proposes the table; the person reacts. Keep the choices ordinary and well-supported. Do not invent exotic stacks.

### File structure

```
# <Project name>: Technical requirements
## Choices                  (table: Area | Choice | Why, in plain English)
## Connects to              (bullet list of the person's existing tools)
## Decisions still needed   (numbered list of choices that are theirs to make)
```

Areas to cover: website and members area, database, hosting, payments (if any), email, logging in, backups, plus one row for each existing tool that is the "master" of something.

### Person checks

Every tool they already pay for appears under "Connects to". They understand each "why" well enough to explain it. The example choices are one sensible setup, not the only one.

---

## Document 3: App flow

**File:** `03-app-flow.md`
**Reads first:** Documents 1 and 2.
**Purpose:** What happens when someone clicks, which page comes next, and where they land when something goes wrong.

### Questions

1. Walk me through what each kind of person does first when they arrive. *Example: A visitor looks at the class list, opens a class, picks a seat.*
2. Which three journeys matter most? *Example: Booking a class, checking my pieces, updating a kiln batch.*
3. How should people be notified of things (email, text, on screen)? *Example: Email only for now.*
4. Which pages must exist no matter what? *Example: Home, class list, billing.*
5. I'll propose what happens when things go wrong (a failed payment, two people picking the same slot, an expired login, a form with missing details). Which of these should work differently? *Example: Hold the seat for 15 minutes after a failed payment.*

Claude drafts the journeys itself from Documents 1 and 2 and asks the person to react. Do not make the person design the screens.

### File structure

```
# <Project name>: App flow
## Main path                  (one ```flow block)
## Journeys                   (### 1. <name> … each with a ```flow block and a numbered step list)
## When something goes wrong  (a ```flow block of error paths, then a table: What goes wrong | What the person sees | Where they end up)
## Pages                      (table: Page | Who can reach it | What is on it | Where the buttons lead)
```

### Flow block syntax

The deck turns these into a station-line diagram. Rules:

- One `journey:` line starts a diagram: `journey: Title | Who`
- Each following line is one path. Steps are separated by `>`. Maximum 6 steps per line.
- A line starting with `error:` is a failure path. Its first step is the thing that went wrong. Its last step must be somewhere the person can still finish what they came to do.
- Steps are short labels (under about 40 characters).

````
```flow
journey: Book a class | Visitor or member
Class list > Class details > Choose a seat > Pay > Confirmed, email sent
error: Class is full > Offer the waitlist > Seat offered when one opens
```
````

### Person checks

Dead ends. They walk each journey as one of their own customers. Every error path ends somewhere the person can still finish.

---

## Document 4: Design brief

**File:** `04-design-brief.md`
**Reads first:** Document 1 (who the customers are, and on which device).
**Purpose:** Colours, fonts and tone, so the tenth screen looks as on-brand as the first.

### Questions

1. What are your brand colours? Give hex codes (like #1D4E63), or attach your logo and say "suggest". *Example: Deep sea blue and a warm clay orange.*
2. What fonts do you use, or do you want two suggestions? *Example: Suggest. Friendly serif headings, clean body text.*
3. Do your customers mostly use phones or computers? *Example: Phones, mostly.*
4. Pick three words for how the site should feel. *Example: Warm, hands-on, unfussy.*
5. Name one or two sites you like and one you do not, and say why. *Example: I like the look of small ceramics shops. I dislike busy marketplaces.*
6. How should the words on screen sound? Give one example of a phrase you would use and one you would never use. *Example: "Book a seat", never "Register for session".*
7. Any accessibility needs? *Example: Large text, strong contrast.*

If the person attaches a logo (or `project.json` has one), look at it and propose colours. Never invent a hex code and present it as theirs: say where it came from ("sampled from your logo" or "my suggestion").

### File structure

```
# <Project name>: Design brief
## Colours            (table: Name | Hex | Use, at least 3 real hex codes)
## Fonts              (one or two sentences)
## How things look    (table: Element | Rule; cover buttons, forms, logo, photos, screens)
## Words on screen    (bullet list)
```

After writing the colours, also copy the main colour into `project.json` under `brand.primary` and the accent under `brand.accent`. The deck uses them on the cover.

### Person checks

Real colour codes and fonts, not near matches. If the brief could describe any company's site, it is not specific enough.

---

## Document 5: Backend schema

**File:** `05-backend-schema.md`
**Reads first:** Documents 1, 2 and 3.
**Purpose:** Where the data lives, and who can see it. This is the one that protects the person's customers.

### Questions

Claude drafts the records from Documents 1 to 3 first, then asks:

1. Looking at this list of records, is anything missing? *Example: We forgot to track which kiln a piece went in.*
2. Who must never see what? *Example: Instructors must not see members who are not in their classes.*
3. Will you store anything about children, health, or payments? *Example: Under-18s book through a parent's account. No health details. Payments through the provider only.*
4. Who is the "owner", the only person who can delete things? *Example: Me, the studio owner.*
5. Are there legal rules you need to follow about this data? *Example: Customers in the EU.*

### File structure

```
# <Project name>: Backend schema
## Records           (table: Record | What is stored | Who can see it | Who can change or delete it)
## How records link  (short paragraph)
## Rules             (bullet list)
## Sensitive data    (bullet list: payments, children, health, anything not stored at all)
```

Never write that something is "GDPR compliant" or "secure". Describe what is stored and who sees it. If a legal question is real, put it in the Sensitive data list as "Check with a lawyer: …".

### Person checks

For each record: should this person really be able to see it? Nothing about children, health or payments should surprise them.

---

## Document 6: Implementation plan

**File:** `06-implementation-plan.md`
**Reads first:** Documents 1 to 5.
**Purpose:** What gets built, in what order, with the points where the person signs off.

### Questions

1. Do you have a hard launch date or event to hit? *Example: Before the spring term.*
2. Who will test each stage, and how many hours a week can you give to reviewing? *Example: Me, plus three members and one staff member. About three hours a week.*
3. Who is building it: you with AI tools, a freelancer, an agency? *Example: A freelancer using Claude Code.*
4. Is there real data to move over at launch? *Example: 400 members' names and emails.*
5. Is any stage a must-have for a business reason? *Example: Payments before anything else, so memberships can start.*

### File structure

```
# <Project name>: Implementation plan
## Stages                  (table: Stage | What you get | How you test it | You sign off when)
## Riskiest part first     (short paragraph saying what is riskiest and why it is early)
## What you provide        (bullet list)
```

Rules for the stages: each one gives the person something they can test themselves. Name the Document 1 features in the "What you get" column using the exact feature names, so the validator can match them. Put the riskiest part (usually payments, logins or data migration) early.

### Person checks

A sign-off they can do themselves at every stage. If they cannot test it, they will only find out at the end.

---

## After Document 6

1. Run `node scripts/validate.mjs projects/<slug>` and fix every ERROR with the person. Warnings are worth a look.
2. Run the `consistency-reviewer` agent on `projects/<slug>`. Go through its findings with the person in plain English and fix what they agree with.
3. Build the deck, then follow the review loop in `CLAUDE.md`.

## When an earlier document changes

If Document 1 changes, Documents 2 to 6 may be out of date. If Document 2 changes, check 3, 5 and 6. If Document 3 changes, check 5 and 6. Tell the person which later documents might need an update and offer to update them. Never change them silently.
