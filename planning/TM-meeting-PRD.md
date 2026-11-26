# Product Requirements Document: Toastmasters Meeting Companion

**Status:** MVP Draft  
**Initial deployment:** Doral Toastmasters club  
**Future direction:** Multi-club public release  
**Platform:** Mobile-first web application  
**Proposed frontend:** GitHub Pages  
**Proposed backend:** Firebase  
**Primary principle:** **Digitize the ballot, not the meeting.**

---

## 1. Product Overview

The Toastmasters Meeting Companion is a lightweight web application designed to replace the paper **Ballots and Brief Evaluations** slip currently used during Toastmasters meetings.

The application will focus on two activities:

1. **Providing useful written feedback** to selected meeting participants.
2. **Voting** for Best Speaker, Best Evaluator, and Best Table Topics Speaker.

The application should reduce paperwork without changing how the Toastmasters meeting itself operates.

It is **not** intended to become an agenda system, timer, Pathways manager, attendance system, or full club-management platform.

### Product purpose

> **Help people get better at public speaking while making them less concerned about the paperwork.**

The application should stay in the background of the meeting. It should be fast enough that a participant can scan the permanent QR code, provide feedback or vote, put the phone away, and return attention to the meeting.

---

## 2. Product Goals

### Primary goals

1. Replace the existing paper feedback and voting slip.
2. Make submitting feedback easier during the one-minute speaker feedback period and throughout the meeting.
3. Deliver collected feedback electronically in one consolidated message per recipient.
4. Simplify vote collection and counting.
5. Protect club-member email addresses and administrative information.
6. Require **no attendee account or login**.
7. Keep operating costs extremely low so the service can initially be supported voluntarily.
8. Validate the experience with one club before public release.
9. Architect the application so additional clubs can be introduced without rebuilding the core platform.

### Product experience goal

A normal attendee should never need to understand how the application works technically.

The desired interaction is essentially:

**Scan -> Feedback / Vote -> Submit -> Back to the meeting**

---

## 3. Product Principles

Development decisions should follow these principles in order.

### 3.1 Simplicity first

If a feature isn't necessary for feedback, voting, results, member administration, privacy, or meeting reset, it probably doesn't belong in the MVP.

### 3.2 The meeting remains primary

The application supports the Toastmasters meeting.

It does not control the meeting.

For example, the existing Timer still manages the one-minute feedback period. The application does not need a feedback countdown.

### 3.3 No unnecessary attendee friction

Attendees should not:

- create accounts
- log in
- verify email addresses
- select a meeting
- configure profiles
- download an app

### 3.4 Privacy by design

Member email addresses must never be exposed to meeting attendees or delivered to the public client.

### 3.5 Multi-club architecture, single-club MVP

The MVP only needs to operate Doral Toastmasters, but permanent data and security boundaries should be associated with a `clubId`.

Multi-club administration itself is **not** an MVP requirement.

### 3.6 Low operating cost

The architecture should favor free or low-cost static hosting and serverless infrastructure rather than requiring continuously running servers.

---

## 4. User Types

The MVP has three conceptual roles.

### 4.1 Attendee

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

### 4.2 Club Admin

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

### 4.3 Platform Administrator

The architecture may eventually support platform administration for multiple clubs.

**No Platform Administrator interface is required for MVP.**

---

## 5. Club Model

Each club must be an independent data boundary.

Conceptually:

```text
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

---

## 6. Permanent Club QR Code

Each club has one permanent attendee URL and therefore one permanent QR code.

Conceptually:

`/club/doral`

The URL should remain the same from meeting to meeting.

The club should be able to:

- print the QR code
- display it at meetings
- place it on club materials
- display it on the club website

### Requirement

**No meeting-specific QR codes should be generated.**

Resetting or finishing a meeting does not change the QR code.

---

## 7. Member Directory

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

---

## 8. Member Privacy Requirements

Member email addresses are private information.

The attendee-facing application must **never receive member email addresses**, even if the UI would not visibly display them.

The system must not depend on client-side hiding, JavaScript obfuscation, or CSS visibility to protect emails.

### Public participant representation

An attendee may receive information similar to:

```text
participantId
displayName
meetingRole
feedbackEligible
votingEligibility
```

### Private member representation

Administrative/server-side systems can additionally access:

```text
memberId
clubId
email
active
```

The connection between a meeting participant and a private email address must be handled securely outside the public attendee experience.

---

## 9. Meeting Model

The application will **not create named meetings or maintain a meeting calendar** in the MVP.

Each club simply maintains one **current meeting**.

### Meeting states

The current meeting has three states:

**Ready -> Active -> Finished**

After Finished:

**Reset for New Meeting -> Ready**

No meeting date, meeting number, title, or unique meeting URL is required from administrators.

---

## 10. Meeting Setup

The Club Admin configures the current meeting.

The admin should select participants from the permanent member directory.

### Prepared Speakers

Support:

- Speaker 1
- Speaker 2
- Speaker 3

Unused speaker positions may remain empty.

### Feedback-related meeting roles

Select:

- Toastmaster of the Meeting
- Topicsmaster
- General Evaluator

### Evaluators

The administrator adds the Evaluators participating in the meeting.

Evaluators are needed for **Best Evaluator voting**, but Evaluators do not receive written feedback through this application.

The UI should support varying numbers of Evaluators rather than assuming exactly two or three.

---

## 11. Table Topics Participants

Table Topics participants do not need to be configured before the meeting.

The Club Admin must be able to add participants as Table Topics progresses.

Two types:

### Existing member

Select from the member directory.

### Guest

Enter a display name.

Example:

`Michael Smith`

A guest does not automatically become a permanent club member.

Guest Table Topics participants:

- appear as Best Table Topics candidates
- do not receive written feedback
- do not require email addresses

---

## 12. Feedback Eligibility

Following the existing paper feedback slip and the agreed MVP scope, written feedback is available only for:

### Prepared Speakers

- Speaker 1
- Speaker 2
- Speaker 3, when present

### Functionaries

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

---

## 13. Feedback Experience

From the attendee home screen, eligible recipients should be immediately visible.

Example:

### Give Feedback

**Maria Smith**  
Prepared Speaker  
`Give Feedback`

**John Smith**  
Prepared Speaker  
`Give Feedback`

**Rene De Posada**  
Toastmaster  
`Give Feedback`

**Sarah Smith**  
Topicsmaster  
`Give Feedback`

**Alex Smith**  
General Evaluator  
`Give Feedback`

Selecting a recipient opens the feedback form.

---

## 14. Feedback Form

The form should encourage concise, useful Toastmasters feedback.

### Recipient

**Maria Smith**  
Prepared Speaker

### Field 1

**What worked well?**

Multiline text field.

### Field 2

**What could help improve?**

Multiline text field.

### Attribution

Unchecked by default:

`[ ] Add my name to this feedback`

If selected, the attendee can provide/select a name.

### Action

**Send Feedback**

---

## 15. Anonymous Feedback

Anonymous feedback must be the default.

If the sender doesn't choose identification:

```text
sender = null
```

The system should not silently capture the sender's identity and merely hide it from the recipient.

If identification is selected, the submitted name accompanies that specific feedback.

Because attendees are not authenticated, the MVP should not imply that sender names have been identity-verified.

---

## 16. Feedback Availability

The application imposes **no one-minute software timer**.

The existing Toastmasters Timer continues to manage the meeting's one-minute feedback period.

Feedback remains available throughout the active meeting.

Therefore, an attendee may:

1. submit immediately during the one-minute feedback period, or
2. return later during the meeting and submit feedback.

This prevents the software from unnecessarily controlling meeting procedure.

---

## 17. Voting Categories

The MVP supports exactly three awards:

1. **Best Speaker**
2. **Best Evaluator**
3. **Best Table Topics Speaker**

There are no:

- second-place votes
- third-place votes
- Most Improved votes

---

## 18. Voting Eligibility

### Best Speaker

Candidates are the configured Prepared Speakers.

### Best Evaluator

Candidates are the configured Evaluators.

### Best Table Topics Speaker

Candidates are the Table Topics participants added during the current meeting.

Guest Table Topics participants are fully eligible.

---

## 19. Voting UX

All voting categories remain available during the active meeting.

There is no separate:

- open ballot
- close ballot
- voting window
- category activation

Example:

### Best Speaker

- ( ) Maria Smith
- ( ) John Smith

**Submit Vote**

The other categories follow the same pattern.

The application should make voting require as few interactions as practical.

---

## 20. Voting Privacy

Votes are anonymous.

The system should not intentionally maintain a relationship such as:

> Rene voted for Maria.

Vote data should concern the candidate/category rather than building attendee voting profiles.

### MVP trade-off

Because attendees do not authenticate, the application cannot perfectly establish one person, one vote while simultaneously maintaining zero-friction anonymous access.

The initial club MVP accepts this limitation.

The product should **not introduce attendee authentication solely to solve hypothetical duplicate voting** unless club testing demonstrates that abuse is a real problem.

---

## 21. Voting Results

Attendees must **never see live vote totals**.

The Admin interface may show results.

Example:

### Best Speaker

Maria Smith - 9  
John Smith - 5

**Winner: Maria Smith**

### Best Evaluator

Jennifer Smith - 8  
Michael Smith - 6

### Best Table Topics

Sarah Smith - 7  
Michael - 4  
Rene - 3

Ties must be represented accurately.

The app should not invent automatic tie-breaking logic for MVP.

---

## 22. Finish Meeting

The Admin interface contains:

**Finish Meeting**

This is a consequential action and should require a simple confirmation.

For example:

> **Finish this meeting?**
>
> Feedback and voting will close and participant feedback will be prepared for delivery.
>
> Cancel | Finish Meeting

Finishing performs the following sequence:

1. Change meeting state to `Finished`.
2. Stop new feedback submissions.
3. Stop new votes.
4. Finalize vote results.
5. Group feedback by recipient.
6. Retrieve recipient email addresses securely.
7. Produce one consolidated feedback communication for each eligible recipient with feedback.
8. Initiate email delivery.
9. Record delivery success/failure.

Email processing should occur server-side rather than from the attendee's browser.

---

## 23. Consolidated Feedback Email

A participant should receive **one email per meeting**, not one message per feedback submission.

Example:

### Your Toastmasters feedback

#### What worked well

> The opening got my attention immediately.

> Great eye contact throughout the speech.  
> **Rene**

> The story made your main point very easy to understand.

#### Suggestions for improvement

> Consider slowing down around the transitions.

> A longer pause before the conclusion would make the final point stand out.

> Tie the conclusion back to the opening.

The first version should simply organize the feedback.

It should **not use AI to rewrite, summarize, rank, or interpret feedback in MVP**.

That preserves exactly what fellow participants intended to communicate.

---

## 24. Failed Email Delivery

The application must not delete feedback simply because email delivery fails.

Admin should see a clear status such as:

- Sent
- Pending
- Failed

If a delivery fails, feedback must remain available for retry.

**Reset must never silently destroy undelivered feedback.**

This is one reason Finish and Reset remain separate operations.

---

## 25. Reset for New Meeting

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

---

## 26. Admin Authentication

Regular attendees require no authentication.

Administrative functionality requires authentication.

For MVP, Firebase Authentication is the proposed identity service.

The application does not need:

- custom account registration
- attendee accounts
- member passwords
- complex officer roles

An authenticated account simply needs authorization for one or more `clubId` values.

Conceptually:

```text
Admin User
    |
    v
Authorized Club
    |
    v
Club Administration
```

Firebase Security Rules should enforce club-scoped access. The frontend alone must not determine authorization.

---

## 27. Suggested Technical Architecture

The working architecture is:

```text
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

---

## 28. Mobile-First UX Requirements

The attendee experience should primarily target smartphones.

### Requirements

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

---

## 29. Attendee Information Architecture

The attendee application should ideally remain only a few screens deep.

### Home

**Club Name**

**Give Feedback**

Eligible participants

**Vote**

- Best Speaker
- Best Evaluator
- Best Table Topics Speaker

That's the core application.

### Feedback

Home -> Recipient -> Feedback -> Confirmation -> Home

### Voting

Home -> Category -> Candidate -> Submit -> Home

Navigation should be obvious enough that instructions aren't required.

---

## 30. Admin Information Architecture

The Admin experience needs four primary areas.

### Members

Manage permanent club members.

### Meeting Setup

Configure:

- Prepared Speakers
- Toastmaster
- Topicsmaster
- General Evaluator
- Evaluators

And during the meeting:

- Table Topics participants

### Results

View:

- Best Speaker
- Best Evaluator
- Best Table Topics

### Meeting Control

- status
- finish meeting
- email delivery status
- reset for new meeting

No more administrative navigation should be added unless real club usage demonstrates the need.

---

## 31. Multi-Club Readiness Requirements

Although public multi-club onboarding is outside MVP, the architecture must not assume a single global club.

From the beginning:

### Required

- club-scoped member records
- club-scoped administrators
- club-scoped meetings
- club-scoped feedback
- club-scoped votes
- club-specific permanent URL
- club-specific permanent QR code
- security rules preventing cross-club administrative access

### Not required yet

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

---

## 32. MVP Security Requirements

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

---

## 33. Cost Requirement

The application should be architected to operate a small club at essentially negligible recurring infrastructure cost.

Because the future vision involves voluntary support similar to WealthMap, a key scalability criterion will be:

> **Adding another normally active Toastmasters club should create very little incremental infrastructure cost.**

Cost monitoring should nevertheless be enabled before any open public release.

---

## 34. Explicitly Out of Scope for MVP

This list should be treated as a product boundary, not a future development backlog that must automatically be implemented.

### Meeting management

- agenda creation
- scheduling
- calendar
- meeting themes
- automated role assignments
- Timer functionality
- speech timing
- attendance

### Toastmasters administration

- Pathways integration
- speech-project tracking
- Distinguished Club Program
- member achievements
- dues
- club officer management
- Toastmasters International integration

### Accounts

- attendee accounts
- participant passwords
- public user profiles

### Analytics

- speaker performance history
- member scoring
- feedback trends
- club dashboards

### AI

- AI evaluations
- AI feedback rewriting
- AI feedback scoring
- AI-generated recommendations
- speech analysis

### Open platform

- public club registration
- subscriptions
- payments
- marketplace functionality

---

## 35. MVP Success Criteria

The first several real Doral Toastmasters meetings should answer one fundamental question:

> **Does this make feedback and voting easier without making phones more prominent in the meeting?**

Useful signals include:

### Adoption

A strong majority of attendees who normally use the paper ballot can use the digital version without assistance.

### Feedback

Members continue providing meaningful written feedback rather than reducing feedback because the interface is inconvenient.

### Voting

Digital ballot participation is comparable to or better than paper participation.

### Speed

A normal vote should take only a few seconds once the appropriate candidate list exists.

### Administration

Meeting configuration and vote counting should require less administrative effort than the paper process.

### Reliability

No submitted feedback should be lost during normal operation.

### Privacy

Member emails remain private and inaccessible to regular attendees.

### Meeting experience

Most importantly, members shouldn't feel that the application is pulling attention away from speakers.

---

## 36. MVP Acceptance Criteria

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

---

## 37. Product North Star

The original paper slip is a useful constraint for this product.

Every future feature should face this question:

> **Does this help participants give useful feedback or complete voting with less distraction and administration?**

If not, there should be a high bar for adding it.

The long-term opportunity may eventually include multiple clubs, better feedback delivery, member history, Toastmasters integrations, or other capabilities. But the first product should remain intentionally narrow:

### **Listen -> Give feedback -> Vote -> Put the phone away.**

That should be the experience protected as the app evolves.

---

## 38. Recommended Implementation Sequence

Build the PRD in five tightly scoped phases rather than handing a coding agent the entire application at once:

1. **Foundation:** GitHub Pages app shell, Firebase, club model, admin authentication, and security rules.
2. **Administration:** Member directory, current-meeting setup, participant/guest handling, and reset.
3. **Participant experience:** Permanent club URL/QR flow, feedback, and voting.
4. **Meeting completion:** Results, Finish Meeting, consolidated email workflow, and delivery safeguards.
5. **MVP hardening:** Mobile UX, security/privacy testing, error handling, cost safeguards, and real-club testing.

This sequencing keeps the MVP focused. Each phase delivers a testable capability while preserving the architectural decisions needed for a future multi-club release.
