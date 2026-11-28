# Toastmasters Meeting Companion

A prototype for collecting meeting feedback and votes, built with plain HTML,
CSS, and JavaScript. It uses sample data for Doral Toastmasters and has no
framework, build step, or package dependencies. The Firebase JavaScript SDK is
loaded from Google's CDN to initialize the development project's App, Auth, and
Firestore services.
Its maroon, blue, and yellow styling is inspired by the
[Toastmasters International website](https://www.toastmasters.org/).

## Run locally

From the repository root, run:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). If port 8000 is in use,
choose another port, for example `python3 -m http.server 8001`.
Open the browser developer console and check `firebaseServices` as described
below. When the app is deployed on GitHub Pages, open the deployed page, inspect
the browser developer console, and check the same object and initialization
messages.

Alternatively, run `npm run serve` from the `app/` directory. Python 3 is
required for both commands.

Run the regression tests with `npm test` from the `app/` directory
(requires Node.js).

## Prototype

The sample meeting starts active. The home screen links to feedback forms and
voting categories for Best Speaker, Best Evaluator, and Best Table Topics
Speaker. Use the **Admin** link or `/#admin/login` to access meeting control,
members, setup, and results. Admins sign in with Google; attendees do not need
an account.

Use **Participant view** in the admin header to return to the meeting without
signing out. The **Admin** link returns signed-in admins to the dashboard;
**Sign out** ends the Firebase session.

Admins can update members and meeting participants, view locally recorded
feedback and voting results, and start, finish, or reset the meeting. To select
multiple members in meeting setup, use Ctrl/Command-click. Enter each guest on
a separate line. A reset clears meeting participants, feedback, and votes.

Application data is still held in browser memory and is lost on refresh; it is
not shared between visitors. Firebase is initialized but is not yet connected
to application state. Feedback delivery is not implemented. Do not add real
member data or email addresses to the prototype.

## Firebase development foundation

The client initializes Firebase project `tm-meeting-companion-dev` through the
Firebase Web compat SDK loaded from Google's CDN. The Firebase App,
Authentication, and Cloud Firestore instances are exposed through
`window.firebaseServices`. Initialization itself does not read or write
Firestore; the Admin authorization check later gets only the signed-in user's
Admin document.
In the browser developer console, inspect `firebaseServices` and confirm
`projectId` is `tm-meeting-companion-dev` and all three entries in `status` are
`true`. The bootstrap also logs each successful initialization.

The development Firebase Console has Google Authentication enabled, and the
Admin sign-in uses that provider. The repository rules must be published before
the client can read an authorization document; until then the Console's
deny-all rules will reject that read. The Firestore database should contain no
application data; the only document this phase expects is an Admin
authorization document created manually by a trusted project owner. The
existing mock/in-memory state remains the active data source. Do not add real
member information or email addresses to this repository or Firebase. Keep any
future production Firebase project separate from the development project.

GitHub Pages remains the frontend host; Firebase Hosting is not used. Firebase
initialization failures are logged to the developer console without preventing
the in-memory attendee prototype from loading.

## Admin sign-in and authorization

Google Sign-In authenticates Admins with Firebase Authentication. Attendees
remain unauthenticated. Authentication alone does not grant Admin access: the
client retrieves only `clubs/{clubId}/admins/{uid}`, using the authenticated
Firebase UID. The initial development club ID is `doral`. Access requires the
document to contain Boolean `active: true` and String `role: "admin"`.
Firebase Authentication's default browser persistence restores the sign-in
after a refresh, and the authorization document is checked again on restore.

The client never creates, updates, deletes, or lists Admin documents. A trusted
Firebase project owner must create the initial Admin document manually after
the user signs in once. The user's Firebase UID can be found in Firebase
Console under **Authentication → Users**. Create a Firestore document at
`clubs/doral/admins/{uid}` (replace `{uid}` with the user's UID), with:

```text
active: true   (Boolean)
role: "admin"   (String)
```

Do not add personal email addresses or actual UIDs to repository documentation.
To authorize another Admin, repeat the process for that user's UID. The client
does not provide self-service enrollment.

The repository's [firestore.rules](firestore.rules) allows an authenticated
user to get only their own Admin document. It denies listing Admins and all
client-side creation, update, and deletion. Every other Firestore path remains
denied. Adding this file does not publish rules to Firebase. A trusted project
owner must open the development project in Firebase Console, go to
**Firestore Database → Rules**, replace the rules with the contents of
`firestore.rules`, and select **Publish** before Admin authorization can work.
No rules deployment workflow is configured in this repository.

To verify locally, start the static server as described above, open
`http://localhost:8000/#admin/login`, and select **Sign in with Google**. The
first sign-in creates/restores the Firebase Authentication user but will not
grant Admin access until its Admin document exists. Copy that user's UID from
**Authentication → Users**, create the document and fields above, then refresh
the page. An authorized Admin reaches the existing dashboard; a signed-in
account without a valid Admin document sees an access-denied message and can
sign out. Repeat the same steps on the GitHub Pages site after confirming that
`localhost` and `renedeposada.github.io` are Firebase Authentication authorized
domains.

Members, meetings, feedback, votes, and results continue to use mock or
in-memory data. No application data is stored in Firestore. Keep production
Firebase projects separate from `tm-meeting-companion-dev`.

## Project structure

```text
index.html                     # Entry point
app/
  package.json                 # Local server scripts
  public/
    styles.css                 # Styling
    firebase.js                # Firebase app, Auth, and Firestore initialization
    adminAuth.js               # Google sign-in and club-scoped Admin authorization
    data.js                    # Sample club and meeting data
    state.js                   # In-memory application state
    router.js                  # Hash-based navigation
    app.js                     # Application controller
    pages/                     # Attendee and admin page rendering
planning/
  TM-meeting-PRD.md            # Product requirements
  TM-meeting-wireframes.md     # Wireframe specifications
.github/
  copilot-instructions.md      # PRD and wireframes for Copilot
firestore.rules                # Minimal Admin-document access rules
```

Edit [`app/public/data.js`](app/public/data.js) to change the sample data.
The [PRD](planning/TM-meeting-PRD.md) and
[wireframes](planning/TM-meeting-wireframes.md) describe the intended product;
they are not a guarantee that every feature is implemented.

## GitHub Pages

In the repository's Pages settings, select **Deploy from a branch** and publish
the desired branch from **/ (root)**. The root entry point uses relative asset
paths so it also works under a GitHub Pages project subpath. This publishes a
static prototype with Firebase-backed Admin authentication; Firebase Hosting
is not used, and application data is not persisted.
