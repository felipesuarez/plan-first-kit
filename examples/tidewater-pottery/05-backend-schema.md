# Tidewater Pottery Studio: Backend schema

## Records

| Record | What is stored | Who can see it | Who can change or delete it |
|---|---|---|---|
| Person | Name, email, phone (optional) | That person, studio staff | That person edits their own details. Only the owner deletes |
| Membership | Plan, start date, status (active, paused, ended) | That member, studio staff | Staff change status. Only the owner deletes |
| Class | Title, level, instructor, date, time, seats, price | Everyone | Staff and the class's instructor |
| Booking | Person, class, seat, status | That person, the class's instructor, staff | The person can cancel. Staff can change. Only the owner deletes |
| Piece | Owner, short description, current stage, photo (optional) | The owner of the piece, staff | Staff update the stage. Only the owner deletes |
| Kiln batch | Date, kiln, list of pieces | Staff | Staff |
| Payment record | Provider reference, amount, date, status | That person, staff, the owner | No one edits. The provider holds the real details |

## How records link

One person can have one membership and many bookings and many pieces. Each booking belongs to one person and one class. Each piece belongs to one person and can appear in several kiln batches over its life. Each payment record belongs to one person and points to either a membership or a booking.

## Rules

- Instructors only see the people booked into their own classes.
- Members only ever see their own bookings, pieces and payments.
- Card details are never stored here. The payment provider holds them.
- Only the owner can delete a record, and every deletion is logged with who did it and when.
- Photos are of pieces only, never of people.

## Sensitive data

- **Payments**: only a provider reference and amount. No card numbers, ever.
- **Children**: no kids' accounts in this version. Under-18 students book through a parent's account, and we store no date of birth.
- **Phone numbers**: optional, and only used if the member chooses text alerts.
- **Not stored at all**: health details, home addresses, and any ID numbers.
