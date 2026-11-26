# Toastmasters Meeting Companion - App

A lightweight, vanilla JavaScript web application for managing Toastmasters meeting feedback and voting.

## Folder Structure

```
app/
├── public/
│   ├── index.html              # Main HTML entry point
│   ├── styles.css              # Global styling
│   ├── data.js                 # Sample data for the meeting
│   ├── state.js                # Application state management
│   ├── router.js               # Client-side routing
│   ├── app.js                  # Main application controller
│   └── pages/
│       ├── attendeePage.js     # Attendee home page
│       ├── feedbackPage.js     # Feedback form and confirmation
│       ├── votingPage.js       # Voting form and confirmation
│       ├── adminLoginPage.js   # Admin login
│       └── adminDashboardPage.js # Admin dashboard
└── package.json                # Project metadata
```

## Running the App

### Using Python's built-in HTTP server (recommended)

```bash
cd app
python3 -m http.server 8000 --directory public
```

Then open your browser to: http://localhost:8000

### Using npm script

```bash
cd app
npm run serve
```

## Features

### Attendee Features
- **Home Page**: View feedback-eligible recipients and voting categories
- **Feedback Form**: Submit feedback with optional name attribution
- **Voting**: Cast votes for Best Speaker, Best Evaluator, and Best Table Topics Speaker
- **Meeting Status**: Shows appropriate UI based on meeting status (Ready, Active, Finished)

### Admin Features
- **Login**: Simple authentication
- **Meeting Control**: Start, finish, and reset meetings
- **Members**: View and manage club members
- **Meeting Setup**: Configure meeting participants and roles
- **Results**: View voting results with winner determination and tie handling

## Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Responsive styling with flexbox and grid
- **Vanilla JavaScript** - No frameworks, no build tools

## State Management

The app uses a simple `AppState` class that manages:
- Meeting status and configuration
- Club member information
- Feedback submissions
- Vote submissions
- Results calculation

## Routing

Client-side routing is implemented via URL hash navigation:
- `#home` - Attendee home page
- `#feedback/{recipientId}` - Feedback form
- `#vote/{categoryId}` - Voting form
- `#admin/login` - Admin login
- `#admin/dashboard` - Admin dashboard
- `#admin/members` - Members management
- `#admin/meeting-setup` - Meeting configuration
- `#admin/results` - Voting results

## Sample Data

The app includes sample data for Doral Toastmasters club with:
- 7 club members
- Pre-configured meeting roles
- Sample feedback and voting categories

Modify `public/data.js` to customize the data.

## Styling

All styling is in `public/styles.css` using utility classes:
- Buttons: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- Layout: `.container`, `.flex`, `.grid`
- Spacing: `.mb-X`, `.mt-X`, `.px-X`, `.py-X`
- Cards: `.card`, `.card-sm`

The design is mobile-first and responsive.

## Browser Support

Works on all modern browsers that support:
- ES6 JavaScript
- CSS Flexbox and Grid
- LocalStorage API

## Privacy & Security

- Member email addresses are only stored in state, never sent to attendee-facing views
- Feedback and voting data are stored in browser memory (AppState)
- Admin functions require localStorage flag for authentication (demo only)
- For production, replace with proper backend authentication
