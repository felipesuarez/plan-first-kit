# Tidewater Pottery Studio: Technical requirements

## Choices

| Area | Choice | Why, in plain English |
|---|---|---|
| Website and members area | Next.js | One build covers the public pages and the logged-in members area |
| Database | Postgres, hosted on Supabase | Keeps people, classes, bookings and pieces together in one tidy place |
| Hosting | Vercel | Updates go live without anyone managing a server |
| Payments | Decision needed: Stripe, Square or PayPal | Whichever works in the studio's country and bank. Card numbers never touch our system |
| Email | Resend, sent from the studio's own address | Confirmations and "your piece is ready" notes come from a name people recognise |
| Logging in | Email link, no passwords | Nothing for members to forget or reset |
| Class timetable | The studio's Google Calendar stays the master | Instructors keep working the way they already do |
| Backups | Daily, kept 14 days, plus a monthly copy kept for a year | A bad day can be undone |

## Connects to

- **Google Calendar**: the class timetable instructors already use.
- **Mailchimp**: the newsletter list. New members are added only if they tick the consent box.
- **Xero**: paid memberships and class fees flow into the accounts.

## Decisions still needed

1. Which payment provider to use (Stripe, Square or PayPal), based on what the studio's bank and country support.
2. Should "ready to collect" alerts be email only, or email plus text message? Texts cost extra per message.
3. Does Google Calendar stay the master timetable, or does the website's own calendar replace it?
