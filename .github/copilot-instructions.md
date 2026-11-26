# Toastmasters Meeting Companion - Copilot Instructions

This document contains the Product Requirements Document (PRD) and wireframes for the Toastmasters Meeting Companion application. Use this as reference for all development decisions and feature implementations.

---

## TABLE OF CONTENTS

1. [PRD - Product Requirements Document](#prd)
2. [Wireframes - UI/UX Specifications](#wireframes)

---

## PRD

# Product Requirements Document: Toastmasters Meeting Companion

**Status:** MVP Draft  
**Initial deployment:** Doral Toastmasters club  
**Future direction:** Multi-club public release  
**Platform:** Mobile-first web application  
**Proposed frontend:** GitHub Pages  
**Proposed backend:** Firebase  
**Primary principle:** **Digitize the ballot, not the meeting.**

### 1. Product Overview

The Toastmasters Meeting Companion is a lightweight web application designed to replace the paper **Ballots and Brief Evaluations** slip currently used during Toastmasters meetings.

The application will focus on two activities:

1. **Providing useful written feedback** to selected meeting participants.
2. **Voting** for Best Speaker, Best Evaluator, and Best Table Topics Speaker.

The application should reduce paperwork without changing how the Toastmasters meeting itself operates.

It is **not** intended to become an agenda system, timer, Pathways manager, attendance system, or full club-management platform.

### Product purpose

> **Help people get better at public speaking while making them less concerned about the paperwork.**

The application should stay in the background of the meeting. It should be fast enough that a participant can scan the permanent QR code, provide feedback or vote, put the phone away, and return attention to the meeting.

### 2. Product Goals

#### Primary goals

1. Replace the existing paper feedback and voting slip.
2. Make submitting feedback easier during the one-minute speaker feedback period and throughout the meeting.
3. Deliver collected feedback electronically in one consolidated message per recipient.
4. Simplify vote collection and counting.
5. Protect club-member email addresses and administrative information.
6. Require **no attendee account or login**.
7. Keep operating costs extremely low so the service can initially be supported voluntarily.
8. Validate the experience with one club before public release.
9. Architect the application so additional clubs can be introduced without rebuilding the core platform.

#### Product experience goal

A normal attendee should never need to understand how the application works technically.

The desired interaction is essentially:

**Scan -> Feedback / Vote -> Submit -> Back to the meeting**

### 3. Product Principles

Development decisions should follow these principles in order.

#### 3.1 Simplicity first

If a feature isn't necessary for feedback, voting, results, member administration, privacy, or meeting reset, it probably doesn't belong in the MVP.

#### 3.2 The meeting remains primary

The application supports the Toastmasters meeting.

It does not control the meeting.

For example, the existing Timer still manages the one-minute feedback period. The application does not need a feedback countdown.

#### 3.3 No unnecessary attendee friction

Attendees should not:

- create accounts
- log in
- verify email addresses
- select a meeting
- configure profiles
- download an app

#### 3.4 Privacy by design

Member email addresses must never be exposed to meeting attendees or delivered to the public client.

#### 3.5 Multi-club architecture, single-club MVP

The MVP only needs to operate Doral Toastmasters, but permanent data and security boundaries should be associated with a `clubId`.

Multi-club administration itself is **not** an MVP requirement.

#### 3.6 Low operating cost

The architecture should favor free or low-cost static hosting and serverless infrastructure rather than requiring continuously running servers.

### 4. User Types

The MVP has three conceptual roles.

#### 4.1 Attendee

No authentication required.

Can:

- access the current club meeting through the permanent QR code/URL
- view eligible feedback recipients
- submit feedback
- optionally identify themselves with feedback
- view eligible voting candidates
- submit votes

Cannot:

- view email addresses
- view membership records
- configure the meeting
- view vote totals
- finish/reset the meeting

#### 4.2 Club Admin

Authentication required.

Initially this represents whichever officer/functionary is managing the application, such as the Vote Counter.

Can:

- manage members
- configure current meeting participants
- assign relevant roles
- add guests
- add Table Topics participants
- view vote results
- finish the meeting
- initiate consolidated feedback distribution
- reset the application for the next meeting

The MVP does not need different officer permission levels.

Every Club Admin can initially have the same functionality.

#### 4.3 Platform Administrator

The architecture may eventually support platform administration for multiple clubs.

**No Platform Administrator interface is required for MVP.**

### 5. Club Model

Each club must be an independent data boundary.

Conceptually:

```
Club
|-- Club configuration
|-- Admins
|-- Members
`-- Current Meeting
    |-- Participants
    |-- Feedback
    `-- Votes
```

Every applicable record must belong to a `clubId`.

This should be implemented from the beginning even though only one club exists during the initial trial.

### 6. Permanent Club QR Code

Each club has one permanent attendee URL and therefore one permanent QR code.

Conceptually:

`/club/doral`

The URL should remain the same from meeting to meeting.

The club should be able to:

- print the QR code
- display it at meetings
- place it on club materials
- display it on the club website

**Requirement**

**No meeting-specific QR codes should be generated.**

Resetting or finishing a meeting does not change the QR code.

### 7. Member Directory

The application maintains a permanent club-member directory.

Each member requires, at minimum:

- unique internal ID
- club ID
- name
- email address
- active/inactive status

Administrators must be able to:

- add member
- edit member
- deactivate member
- update email address

Deleting members should generally be avoided where deactivation achieves the same purpose.

### 8. Member Privacy Requirements

Member email addresses are private information.

The attendee-facing application must **never receive member email addresses**, even if the UI would not visibly display them.

The system must not depend on client-side hiding, JavaScript obfuscation, or CSS visibility to protect emails.

#### Public participant representation

An attendee may receive information similar to:

```
participantId
displayName
meetingRole
feedbackEligible
votingEligibility
```

#### Private member representation

Administrative/server-side systems can additionally access:

```
memberId
clubId
email
active
```

The connection between a meeting participant and a private email address must be handled securely outside the public attendee experience.

### 9. Meeting Model

The application will **not create named meetings or maintain a meeting calendar** in the MVP.

Each club simply maintains one **current meeting**.

#### Meeting states

The current meeting has three states:

**Ready -> Active -> Finished**

After Finished:

**Reset for New Meeting -> Ready**

No meeting date, meeting number, title, or unique meeting URL is required from administrators.

### 10. Meeting Setup

The Club Admin configures the current meeting.

The admin should select participants from the permanent member directory.

#### Prepared Speakers

Support:

- Speaker 1
- Speaker 2
- Speaker 3

Unused speaker positions may remain empty.

#### Feedback-related meeting roles

Select:

- Toastmaster of the Meeting
- Topicsmaster
- General Evaluator

#### Evaluators

The administrator adds the Evaluators participating in the meeting.

Evaluators are needed for **Best Evaluator voting**, but Evaluators do not receive written feedback through this application.

The UI should support varying numbers of Evaluators rather than assuming exactly two or three.

### 11. Table Topics Participants

Table Topics participants do not need to be configured before the meeting.

The Club Admin must be able to add participants as Table Topics progresses.

Two types:

#### Existing member

Select from the member directory.

#### Guest

Enter a display name.

Example:

`Michael Smith`

A guest does not automatically become a permanent club member.

Guest Table Topics participants:

- appear as Best Table Topics candidates
- do not receive written feedback
- do not require email addresses

### 12. Feedback Eligibility

Following the existing paper feedback slip and the agreed MVP scope, written feedback is available only for:

#### Prepared Speakers

- Speaker 1
- Speaker 2
- Speaker 3, when present

#### Functionaries

- Toastmaster of the Meeting
- Topicsmaster
- General Evaluator

No written feedback will be collected by the application for:

- individual Evaluators
- individual Table Topics speakers
- Timer
- Grammarian
- Ah-Counter
- Vote Counter
- other meeting functionaries

### 13. Feedback Experience

From the attendee home screen, eligible recipients should be immediately visible.

### 14. Feedback Form

The form should encourage concise, useful Toastmasters feedback.

#### Recipient

**Maria Smith**  
Prepared Speaker

#### Field 1

**What worked well?**

Multiline text field.

#### Field 2

**What could help improve?**

Multiline text field.

#### Attribution

Unchecked by default:

`[ ] Add my name to this feedback`

If selected, the attendee can provide/select a name.

#### Action

**Send Feedback**

### 15. Anonymous Feedback

Anonymous feedback must be the default.

If the sender doesn't choose identification:

```
sender = null
```

The system should not silently capture the sender's identity and merely hide it from the recipient.

If identification is selected, the submitted name accompanies that specific feedback.

Because attendees are not authenticated, the MVP should not imply that sender names have been identity-verified.

### 16. Feedback Availability

The application imposes **no one-minute software timer**.

The existing Toastmasters Timer continues to manage the meeting's one-minute feedback period.

Feedback remains available throughout the active meeting.

Therefore, an attendee may:

1. submit immediately during the one-minute feedback period, or
2. return later during the meeting and submit feedback.

This prevents the software from unnecessarily controlling meeting procedure.

### 17. Voting Categories

The MVP supports exactly three awards:

1. **Best Speaker**
2. **Best Evaluator**
3. **Best Table Topics Speaker**

There are no:

- second-place votes
- third-place votes
- Most Improved votes

### 18. Voting Eligibility

#### Best Speaker

Candidates are the configured Prepared Speakers.

#### Best Evaluator

Candidates are the configured Evaluators.

#### Best Table Topics Speaker

Candidates are the Table Topics participants added during the current meeting.

Guest Table Topics participants are fully eligible.

### 19. Voting UX

All voting categories remain available during the active meeting.

There is no separate:

- open ballot
- close ballot
- voting window
- category activation

### 20. Voting Privacy

Votes are anonymous.

The system should not intentionally maintain a relationship such as:

> Rene voted for Maria.

Vote data should concern the candidate/category rather than building attendee voting profiles.

#### MVP trade-off

Because attendees do not authenticate, the application cannot perfectly establish one person, one vote while simultaneously maintaining zero-friction anonymous access.

The initial club MVP accepts this limitation.

The product should **not introduce attendee authentication solely to solve hypothetical duplicate voting** unless club testing demonstrates that abuse is a real problem.

### 21. Voting Results

Attendees must **never see live vote totals**.

The Admin interface may show results.

Ties must be represented accurately.

The app should not invent automatic tie-breaking logic for MVP.

### 22. Finish Meeting

The Admin interface contains:

**Finish Meeting**

This is a consequential action and should require a simple confirmation.

### 23. Consolidated Feedback Email

A participant should receive **one email per meeting**, not one message per feedback submission.

The first version should simply organize the feedback.

It should **not use AI to rewrite, summarize, rank, or interpret feedback in MVP**.

That preserves exactly what fellow participants intended to communicate.

### 24. Failed Email Delivery

The application must not delete feedback simply because email delivery fails.

Admin should see a clear status such as:

- Sent
- Pending
- Failed

If a delivery fails, feedback must remain available for retry.

**Reset must never silently destroy undelivered feedback.**

### 25. Reset for New Meeting

After the current meeting is finished, the administrator can select:

**Reset for New Meeting**

A confirmation should explain that the action removes the previous meeting's active data from the current meeting experience.

Reset clears:

- Prepared Speakers
- Toastmaster
- Topicsmaster
- General Evaluator
- Evaluators
- Table Topics participants
- current votes
- current feedback
- current results
- current meeting state

Reset does **not** remove:

- club
- members
- member email addresses
- administrator accounts
- club configuration
- permanent QR/URL

The application returns to `Ready`.

### 26. Admin Authentication

Regular attendees require no authentication.

Administrative functionality requires authentication.

For MVP, Firebase Authentication is the proposed identity service.

The application does not need:

- custom account registration
- attendee accounts
- member passwords
- complex officer roles

An authenticated account simply needs authorization for one or more `clubId` values.

### 27. Suggested Technical Architecture

The working architecture is:

```
Permanent QR
    |
    v
GitHub Pages
    |-- Participant UI
    `-- Admin UI
            |
            v
Firebase
    |-- Authentication
    |-- Firestore
    `-- Security Rules
            |
            v
Server-side Email Processing
            |
            v
Consolidated Feedback Email
```

GitHub Pages hosts the static application.

Firebase provides:

- persistent application data
- admin authentication
- security rules
- backend/serverless integration

A transactional email solution handles consolidated feedback delivery.

### 28. Mobile-First UX Requirements

The attendee experience should primarily target smartphones.

#### Requirements

- responsive from small mobile screens upward
- large tap targets
- minimal typing outside feedback
- clear role labels
- no horizontal scrolling
- no complex menus
- no unnecessary dashboards
- no installation requirement
- immediate QR access

Desktop should remain functional, particularly for Admin use, but mobile is the priority for attendee workflows.

### 29. Attendee Information Architecture

The attendee application should ideally remain only a few screens deep.

#### Home

**Club Name**

**Give Feedback**

Eligible participants

**Vote**

- Best Speaker
- Best Evaluator
- Best Table Topics Speaker

That's the core application.

#### Feedback

Home -> Recipient -> Feedback -> Confirmation -> Home

#### Voting

Home -> Category -> Candidate -> Submit -> Home

Navigation should be obvious enough that instructions aren't required.

### 30. Admin Information Architecture

The Admin experience needs four primary areas.

#### Members

Manage permanent club members.

#### Meeting Setup

Configure:

- Prepared Speakers
- Toastmaster
- Topicsmaster
- General Evaluator
- Evaluators

And during the meeting:

- Table Topics participants

#### Results

View:

- Best Speaker
- Best Evaluator
- Best Table Topics

#### Meeting Control

- status
- finish meeting
- email delivery status
- reset for new meeting

No more administrative navigation should be added unless real club usage demonstrates the need.

### 31. Multi-Club Readiness Requirements

Although public multi-club onboarding is outside MVP, the architecture must not assume a single global club.

From the beginning:

#### Required

- club-scoped member records
- club-scoped administrators
- club-scoped meetings
- club-scoped feedback
- club-scoped votes
- club-specific permanent URL
- club-specific permanent QR code
- security rules preventing cross-club administrative access

#### Not required yet

- Create Club UI
- public club signup
- club approval
- club discovery
- invitations
- Toastmasters club-number lookup
- cross-club member management
- subscription/payment handling
- multi-club analytics

This distinction protects future scalability without expanding the MVP.

### 32. MVP Security Requirements

The application must meet the following minimum standards before real member data is introduced:

1. Emails never exposed through the attendee-facing API/data path.
2. Administrative actions require authentication.
3. Admin authorization is club-scoped.
4. Firestore Security Rules enforce access control.
5. Anonymous attendee access cannot modify club/member configuration.
6. Attendees cannot retrieve feedback submitted to other participants.
7. Attendees cannot retrieve raw voting results.
8. Email credentials/API keys requiring secrecy never exist in public GitHub Pages JavaScript.
9. Cross-club data access is prevented.
10. Reset cannot destroy feedback still awaiting email processing.

### 33. Cost Requirement

The application should be architected to operate a small club at essentially negligible recurring infrastructure cost.

### 34. Explicitly Out of Scope for MVP

This list should be treated as a product boundary, not a future development backlog that must automatically be implemented.

#### Meeting management

- agenda creation
- scheduling
- calendar
- meeting themes
- automated role assignments
- Timer functionality
- speech timing
- attendance

#### Toastmasters administration

- Pathways integration
- speech-project tracking
- Distinguished Club Program
- member achievements
- dues
- club officer management
- Toastmasters International integration

#### Accounts

- attendee accounts
- participant passwords
- public user profiles

#### Analytics

- speaker performance history
- member scoring
- feedback trends
- club dashboards

#### AI

- AI evaluations
- AI feedback rewriting
- AI feedback scoring
- AI-generated recommendations
- speech analysis

#### Open platform

- public club registration
- subscriptions
- payments
- marketplace functionality

### 35. MVP Acceptance Criteria

The MVP is ready for club testing when this complete scenario works:

1. Admin authenticates.
2. Admin creates/maintains the permanent club roster.
3. Admin resets the current meeting.
4. Admin selects today's Prepared Speakers.
5. Admin selects Toastmaster.
6. Admin selects Topicsmaster.
7. Admin selects General Evaluator.
8. Admin selects Evaluators.
9. Attendee scans the permanent club QR code.
10. Attendee requires no login.
11. Attendee provides anonymous feedback to a Prepared Speaker.
12. Another attendee provides named feedback.
13. Admin adds a member to Table Topics.
14. Admin adds a guest to Table Topics.
15. Attendees vote for Best Speaker.
16. Attendees vote for Best Evaluator.
17. Attendees vote for Best Table Topics Speaker.
18. Attendees cannot see results.
19. Admin can see results.
20. Admin selects **Finish Meeting**.
21. Additional submissions stop.
22. Feedback is consolidated by recipient.
23. One feedback email is generated per applicable recipient.
24. Member email addresses never appear in attendee-accessible data.
25. Admin can confirm delivery status.
26. Admin selects **Reset for New Meeting**.
27. Meeting-specific information clears.
28. Club membership remains intact.
29. Permanent QR code remains unchanged.
30. The app is ready for the next meeting.

If those 30 conditions work cleanly, **the product has a real MVP**.

### 36. Product North Star

> **Listen -> Give feedback -> Vote -> Put the phone away.**

That should be the experience protected as the app evolves.

---

## WIREFRAMES

# Toastmasters Meeting Companion: MVP wireframes

Low-fidelity layouts based on the MVP PRD. These describe content and navigation, not visual styling or an implementation.

### Navigation

```
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

### Attendee screens

#### 1. Home: active meeting

```
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

#### 2. Feedback

```
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

```
+----------------------------------+
| Feedback sent                     |
|                                  |
| Thank you for your feedback.     |
|                                  |
| [          Back to Home        ] |
+----------------------------------+
```

#### 3. Vote

```
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

Best Evaluator and Best Table Topics Speaker use the same layout with their respective candidates. Table Topics candidates include members and guests added during the meeting. If a category has no candidates, show "No candidates yet" instead of the ballot and keep the link back home. Votes are anonymous; do not show results or totals to attendees.

```
+----------------------------------+
| Vote submitted                   |
|                                  |
| Thank you for voting.            |
|                                  |
| [          Back to Home        ] |
+----------------------------------+
```

#### 4. Attendee availability and errors

```
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

### Admin screens

The four areas below share the same club-scoped navigation. The navigation can wrap or stack on small screens; email addresses are shown only in authorized admin views.

#### 5. Admin sign-in

```
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

#### 6. Members

```
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

#### 7. Meeting Setup

```
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

```
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

#### 8. Results

```
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

#### 9. Meeting Control

```
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

```
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

```
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

```
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

### Cross-screen behavior

- Use large tap targets, clear role labels, vertical scrolling, and no horizontal scrolling. Keep the attendee experience shallow and free of dashboards or complex menus.
- Admin actions should show clear validation and save, delivery, or network errors; preserve entered data when an operation fails.
- Attendee data must not include member emails, submitted feedback from others, or vote totals. Hiding them in the interface alone is not sufficient.
- Anonymous voting has no attendee identity verification and does not guarantee one person, one vote.
- These wireframes intentionally omit agenda, timing, scheduling, attendee accounts, AI feedback processing, and public club onboarding.

