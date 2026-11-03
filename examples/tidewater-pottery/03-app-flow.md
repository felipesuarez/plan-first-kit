# Tidewater Pottery Studio: App flow

## Main path

```flow
journey: The usual route in | Everyone
Home page > Log in with an email link > Member home
```

## Journeys

### 1. Book a class

```flow
journey: Book a class | Visitor or member
Class list > Class details > Choose a seat > Pay > Confirmed, email sent
error: Class is full > Offer the waitlist > Seat offered when one opens
error: Payment fails > Back to checkout, reason shown > Seat held for 15 minutes
```

1. The person opens the class list and filters by day or level.
2. They open a class and see the description, instructor, price and seats left.
3. They choose a seat and pay.
4. A confirmation email goes to them and the instructor's class list updates.

### 2. Check my pieces

```flow
journey: Check my pieces | Member
Member home > My pieces > Piece detail > Ready note with pickup hours
```

1. The member opens "My pieces" and sees each piece with its current stage.
2. Opening a piece shows its history: Drying, Bisque fired, Glazed, Glaze fired, Ready to collect.
3. When a piece is ready, the note shows pickup hours.

### 3. Update a kiln batch

```flow
journey: Update a kiln batch | Staff
Dashboard > Kiln batches > Select pieces > Set the new stage > Members notified
error: Piece not found > Search by member name > Piece selected
```

1. Staff open the dashboard and choose "Kiln batches".
2. They tick the pieces that came out of the kiln and set the new stage.
3. Members whose pieces are Ready to collect get an email.

## When something goes wrong

```flow
journey: Things that go wrong | Everyone
error: Login link expired > "That link has timed out" > New link sent in one tap
error: Form missing details > Missing fields highlighted > Form keeps what was typed
error: Two people pick the last seat > Second person told kindly > Next three classes offered
```

| What goes wrong | What the person sees | Where they end up |
|---|---|---|
| Card is declined twice | A plain message with the reason and a retry button | Checkout, and staff are alerted after the second failure |
| Waitlist offer not accepted in 12 hours | Nothing, the offer passes to the next person | The first person is told the offer expired and can rejoin the list |
| Piece photo fails to upload | A message and a retry button | The piece page, with the stage update already saved |

## Pages

| Page | Who can reach it | What is on it | Where the buttons lead |
|---|---|---|---|
| Home | Everyone | Next classes, membership pitch, studio photos | Class list, Join |
| Class list | Everyone | Filters by day and level, seats left | Class details |
| Class details | Everyone | Description, instructor, price, seats left | Choose a seat, or Join waitlist |
| Checkout | Visitors and members | Order summary and payment | Confirmation page |
| Member home | Members | Upcoming classes, pieces, billing | My pieces, Billing |
| My pieces | Members | Every piece with its current stage | Piece detail |
| Billing | Members | Plan, receipts | Provider's card page |
| Dashboard | Staff and instructors | Today's classes, seats left, pieces ready | Kiln batches, class lists |
| Kiln batches | Staff | Pieces grouped by stage | Dashboard |
