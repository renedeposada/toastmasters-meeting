# Toastmasters Meeting Companion

A prototype for collecting meeting feedback and votes, built with plain HTML,
CSS, and JavaScript. It uses sample data for Doral Toastmasters and has no
framework, build step, or runtime dependencies.
Its maroon, blue, and yellow styling is inspired by the
[Toastmasters International website](https://www.toastmasters.org/).

## Run locally

From the repository root, run:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). If port 8000 is in use,
choose another port, for example `python3 -m http.server 8001`.

Alternatively, run `npm run serve` from the `app/` directory. Python 3 is
required for both commands.

Run the regression tests with `npm test` from the `app/` directory
(requires Node.js).

## Prototype

The sample meeting starts active. The home screen links to feedback forms and
voting categories for Best Speaker, Best Evaluator, and Best Table Topics
Speaker. Use the **Admin** link or `/#admin/login` to access meeting control,
members, setup, and results. Demo sign-in accepts any valid email and non-empty
password; do not use real credentials.

Use **Participant view** in the admin header to return to the meeting without
signing out. The **Admin** link returns signed-in admins to the dashboard;
**Sign out** ends the demo admin session.

Admins can update members and meeting participants, view locally recorded
feedback and voting results, and start, finish, or reset the meeting. To select
multiple members in meeting setup, use Ctrl/Command-click. Enter each guest on
a separate line. A reset clears meeting participants, feedback, and votes.

Application data is held in browser memory and is lost on refresh; it is not
shared between visitors. Admin authentication is a demo only, and feedback
delivery is not implemented. Do not use real credentials or sensitive
meeting data. Production use requires a backend, secure authentication,
persistent storage, and appropriate privacy controls.

## Project structure

```text
index.html                     # Entry point
app/
  package.json                 # Local server scripts
  public/
    styles.css                 # Styling
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
```

Edit [`app/public/data.js`](app/public/data.js) to change the sample data.
The [PRD](planning/TM-meeting-PRD.md) and
[wireframes](planning/TM-meeting-wireframes.md) describe the intended product;
they are not a guarantee that every feature is implemented.

## GitHub Pages

In the repository's Pages settings, select **Deploy from a branch** and publish
the desired branch from **/ (root)**. The root entry point uses relative asset
paths so it also works under a GitHub Pages project subpath. This publishes a
static prototype only; it does not add authentication or persistence.
