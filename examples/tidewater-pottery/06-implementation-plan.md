# Tidewater Pottery Studio: Implementation plan

## Stages

| Stage | What you get | How you test it | You sign off when |
|---|---|---|---|
| 1. Logins and profiles | Members sign in with an email link and see a basic profile | Three real members sign in on their own phones without help | All three get in first try and the link-expired message makes sense |
| 2. Payments and membership | Membership sign-up and monthly billing, with receipts | Run test payments, one that works and one that fails, using the provider's test mode | A test payment shows as paid, the receipt arrives, and a failed card sends the person back with a clear reason |
| 3. Booking and waitlist | Class listing and booking, plus the class waitlist, matching the Google Calendar | Book, cancel and join a full class's waitlist for a week of real classes | A week of real bookings matches the calendar and the instructor lists |
| 4. Pieces and kiln updates | The my pieces tracker and staff kiln updates with email alerts | Staff update a real kiln batch and members check their pieces | Members get the right email and staff finish a batch in under two minutes |
| 5. Dashboard and launch | The studio dashboard, existing members moved over, staff shown how it works | Staff run one full day from the dashboard | Every member has a working login and the front desk uses the dashboard all day |

## Riskiest part first

Payments come in stage 2, before any booking is built on top of them. If the provider, the bank or the receipts cause trouble, we find out while the project is still small. Logins come first because payments need to know who is paying.

## What you provide

- The payment provider decision before stage 2 starts.
- Three members willing to test stage 1, and a staff member for stages 4 and 5.
- Access to the studio's Google Calendar, Mailchimp and Xero.
- Real studio photos and the logo files.
- A list of current members (names and emails) before launch.
