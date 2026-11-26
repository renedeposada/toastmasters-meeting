# Toastmasters Meeting Companion: MVP wireframes

Low-fidelity layouts based on [the MVP PRD](./TM-meeting-PRD.md). These describe content and navigation, not visual styling or an implementation. Names and counts are examples.

The attendee layouts are mobile-first; admin layouts may expand for desktop. Controls shown in brackets are tappable unless marked otherwise.

## Navigation

```text
Permanent club QR / URL
  |
  +-- Attendee home (current meeting)
       +-- Recipient --> Feedback form --> Confirmation --> Home
       +-- Vote category --> Candidate ballot --> Confirmation --> Home
       `-- Ready / Finished: meeting unavailable

Admin entry --> Sign in --> Club administration
                              |
                              +-- Members --> Add / edit member
                              +-- Meeting Setup --> Configure roles
                              |                    `-- Add Table Topics member / guest
                              +-- Results --> Three award results
                              `-- Meeting Control --> Finish confirmation
                                                    --> Delivery status / retry
                                                    `-- Reset confirmation
```

Admin access is authenticated and authorized for the club. The permanent attendee URL does not change between meetings. No meeting selection or attendee login is needed.

## Attendee screens

### 1. Home: active meeting

```text
+----------------------------------+
| Doral Toastmasters               |
|                                  |
| Give Feedback                    |
|                                  |
| Maria Smith                      |
| Prepared Speaker  [Give Feedback] |
|                                  |
| John Smith                       |
| Prepared Speaker  [Give Feedback] |
|                                  |
| Rene De Posada                   |
| Toastmaster       [Give Feedback] |
|                                  |
| Sarah Smith                      |
| Topicsmaster      [Give Feedback] |
|                                  |
| Alex Smith                       |
| General Evaluator [Give Feedback] |
|                                  |
| Vote                             |
| [Best Speaker                 >] |
| [Best Evaluator               >] |
| [Best Table Topics Speaker    >] |
+----------------------------------+
```

Only configured, feedback-eligible recipients appear. The list can scroll vertically; it does not include individual evaluators or Table Topics speakers. All three voting categories are available during an active meeting.

### 2. Feedback

```text
+----------------------------------+
| [< Home]         Give Feedback   |
|                                  |
| Maria Smith                      |
| Prepared Speaker                 |
|                                  |
| What worked well?                |
| +------------------------------+ |
| |                              | |
| |                              | |
| +------------------------------+ |
|                                  |
| What could help improve?         |
| +------------------------------+ |
| |                              | |
| |                              | |
| +------------------------------+ |
|                                  |
| [ ] Add my name to this feedback |
|                                  |
| [        Send Feedback         ] |
+----------------------------------+
```

When the checkbox is selected, reveal a name entry or selection control. It applies only to this feedback and is not identity-verified. Otherwise the feedback is anonymous; no sender identity is captured. Feedback remains available throughout the active meeting, with no software countdown.

```text
+----------------------------------+
| Feedback sent                     |
|                                  |
| Thank you for your feedback.     |
|                                  |
| [          Back to Home        ] |
+----------------------------------+
```

### 3. Vote

```text
+----------------------------------+
| [< Home]       Best Speaker      |
|                                  |
| Choose one:                      |
| ( ) Maria Smith                  |
| ( ) John Smith                   |
|                                  |
| [         Submit Vote          ] |
+----------------------------------+
```

Best Evaluator and Best Table Topics Speaker use the same layout with their respective candidates. Table Topics candidates include members and guests added during the meeting. If a category has no candidates, show “No candidates yet” instead of the ballot and keep the link back home. Votes are anonymous; do not show results or totals to attendees.

```text
+----------------------------------+
| Vote submitted                   |
|                                  |
| Thank you for voting.            |
|                                  |
| [          Back to Home        ] |
+----------------------------------+
```

### 4. Attendee availability and errors

```text
+----------------------------------+
| Doral Toastmasters               |
|                                  |
| The meeting is not active yet.  |  Ready
| Please check back later.         |
+----------------------------------+

+----------------------------------+
| Doral Toastmasters               |
|                                  |
| This meeting has finished.       |  Finished
| Feedback and voting are closed.  |
+----------------------------------+
```

If a submission fails, keep the entered text or selected candidate visible, explain that it was not submitted, and offer retry. If the meeting finishes while a form is open, explain that submissions are closed and offer a return home rather than displaying a success confirmation.

## Admin screens

The four areas below share the same club-scoped navigation. The navigation can wrap or stack on small screens; email addresses are shown only in authorized admin views.

### 5. Admin sign-in

```text
+----------------------------------+
| Club administration              |
|                                  |
| Sign in                          |
| Email    [____________________]  |
| Password [____________________]  |
|                                  |
| [           Sign in            ] |
+----------------------------------+
```

Show authentication or club-authorization errors clearly. Sign-in is for administrators only; it is not part of the attendee flow. The precise sign-in method is subject to the chosen authentication configuration.

### 6. Members

```text
+----------------------------------------------------+
| Doral Toastmasters - Admin               [Sign out]|
| [Members] [Meeting Setup] [Results] [Meeting Control]
+----------------------------------------------------+
| Members                              [Add member]  |
|                                                    |
| Maria Smith    maria@example.com    Active  [Edit] |
| John Smith     john@example.com     Active  [Edit] |
| Alex Smith     alex@example.com   Inactive  [Edit] |
+----------------------------------------------------+

Add / edit member
+----------------------------------+
| [< Members]      Edit member     |
|                                  |
| Name   [______________________]  |
| Email  [______________________]  |
| Status [Active / Inactive    v]  |
|                                  |
| [Cancel]                [Save]   |
+----------------------------------+
```

Adding a member uses the same fields. Deactivation retains the directory record; it is not a delete action.

### 7. Meeting Setup

```text
+----------------------------------------------------+
| Doral Toastmasters - Admin               [Sign out]|
| [Members] [Meeting Setup] [Results] [Meeting Control]
+----------------------------------------------------+
| Meeting Setup                        Status: Ready |
|                                                    |
| Prepared Speakers                                  |
| Speaker 1          [Select member              v]  |
| Speaker 2          [Select member / leave blank v] |
| Speaker 3          [Select member / leave blank v] |
|                                                    |
| Toastmaster        [Select member              v]  |
| Topicsmaster       [Select member              v]  |
| General Evaluator  [Select member              v]  |
|                                                    |
| Evaluators                                         |
| Jennifer Smith                            [Remove] |
| Michael Smith                             [Remove] |
| [Add evaluator]                                    |
|                                                    |
| Table Topics participants                          |
| No participants added yet.                         |
| [Add member]  [Add guest]                          |
|                                                    |
| [Save setup]                                       |
+----------------------------------------------------+
```

Participant selection uses the member directory. Evaluators are a variable-length list. Setup does not require a meeting title, date, number, or new URL.

During the active meeting, Table Topics participants can be added as they participate:

```text
+----------------------------------+
| Add Table Topics participant     |
|                                  |
| [Member] [Guest]                 |
|                                  |
| Member: [Select member       v]  |
|   OR                             |
| Guest name: [________________]   |
|                                  |
| [Cancel]                  [Add]  |
+----------------------------------+
```

A guest is a meeting participant, not a permanent member, and needs no email. The list shows added participants and allows an admin to remove a mistaken entry.

### 8. Results

```text
+----------------------------------------------------+
| Doral Toastmasters - Admin               [Sign out]|
| [Members] [Meeting Setup] [Results] [Meeting Control]
+----------------------------------------------------+
| Results                                            |
|                                                    |
| Best Speaker                                       |
| Maria Smith       9                                |
| John Smith        5                                |
| Winner: Maria Smith                                |
|                                                    |
| Best Evaluator                                     |
| Jennifer Smith    8                                |
| Michael Smith     8                                |
| Tie: Jennifer Smith, Michael Smith                 |
|                                                    |
| Best Table Topics Speaker                          |
| No votes yet.                                      |
+----------------------------------------------------+
```

Results are admin-only. During an active meeting they may change; after finishing they are final. Show ties without inventing a tie-breaker, and do not declare a winner when there are no votes.

### 9. Meeting Control

```text
+----------------------------------------------------+
| Doral Toastmasters - Admin               [Sign out]|
| [Members] [Meeting Setup] [Results] [Meeting Control]
+----------------------------------------------------+
| Meeting Control                                    |
|                                                    |
| Status: Ready                                      |
| [Start meeting]                                    |
|                                                    |
| The permanent club QR / URL remains unchanged.     |
+----------------------------------------------------+
```

`Start meeting` is a proposed control for the PRD's Ready -> Active transition; the PRD does not specify exactly how that transition is triggered.

```text
+----------------------------------------------------+
| Meeting Control                                    |
| Status: Active                                     |
|                                                    |
| Feedback and voting are available to attendees.   |
| [Finish Meeting]                                   |
+----------------------------------------------------+

+------------------------------------------+
| Finish this meeting?                     |
|                                          |
| Feedback and voting will close. Feedback |
| will be prepared for delivery.           |
|                                          |
| [Cancel]                [Finish Meeting] |
+------------------------------------------+
```

```text
+----------------------------------------------------+
| Meeting Control                                    |
| Status: Finished                                   |
| Feedback and voting are closed.                    |
|                                                    |
| Feedback delivery                                  |
| Maria Smith        Sent                            |
| John Smith         Pending                         |
| Rene De Posada     Failed                 [Retry]  |
|                                                    |
| [Reset for New Meeting]                            |
+----------------------------------------------------+
```

Delivery is initiated server-side, with one consolidated email per eligible recipient who has feedback. Show processing and failures explicitly; retry preserves the original feedback. Recipients with no feedback do not need an email.

```text
+------------------------------------------+
| Reset for a new meeting?                 |
|                                          |
| Current participants, feedback, votes,   |
| and results will be cleared. Members,    |
| admins, club settings, and the permanent |
| QR / URL will remain.                    |
|                                          |
| [Cancel]        [Reset for New Meeting]  |
+------------------------------------------+
```

**Delivery safeguard:** As a proposed safe default, disable reset while any feedback is pending or failed, explain why, and direct the admin to delivery status and retry. Never silently discard undelivered feedback. After a successful reset, status returns to Ready and meeting-specific data is cleared.

## Cross-screen behavior

- Use large tap targets, clear role labels, vertical scrolling, and no horizontal scrolling. Keep the attendee experience shallow and free of dashboards or complex menus.
- Admin actions should show clear validation and save, delivery, or network errors; preserve entered data when an operation fails.
- Attendee data must not include member emails, submitted feedback from others, or vote totals. Hiding them in the interface alone is not sufficient.
- Anonymous voting has no attendee identity verification and does not guarantee one person, one vote.
- These wireframes intentionally omit agenda, timing, scheduling, attendee accounts, AI feedback processing, and public club onboarding.
