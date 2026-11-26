# Quick Start Guide - Toastmasters Meeting Companion

## 🚀 Getting Started

### Prerequisites
- Python 3.x installed (for HTTP server)
- Any modern web browser
- No npm, build tools, or dependencies needed

### Step 1: Navigate to App Directory
```bash
cd /workspaces/toastmasters-meeting/app
```

### Step 2: Start Development Server
```bash
python3 -m http.server 8000 --directory public
```

You should see:
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

### Step 3: Open in Browser
Navigate to: **http://localhost:8000**

---

## 🎯 Key Features

### For Attendees
1. **Give Feedback** - Click any recipient to provide feedback (anonymous or named)
2. **Vote** - Vote for Best Speaker, Best Evaluator, or Best Table Topics
3. **No Login Required** - Scan QR code and start immediately

### For Admins
1. **Login** - Use any email/password (demo authentication)
2. **Meeting Control** - Start, finish, or reset meetings
3. **Members** - Manage club roster
4. **Meeting Setup** - Configure speakers and roles
5. **Results** - View voting results and winners

---

## 🔗 URL Routes

Navigate using the browser address bar or links:

| Route | Purpose |
|-------|---------|
| `/#home` | Attendee home screen |
| `/#feedback/{memberId}` | Feedback form for specific recipient |
| `/#vote/{categoryId}` | Voting form for specific category |
| `/#admin/login` | Admin login page |
| `/#admin/dashboard` | Admin meeting control |

**Example:**
- Feedback for Maria Smith: `http://localhost:8000/#feedback/member-1`
- Vote for Best Speaker: `http://localhost:8000/#vote/best-speaker`

---

## 📝 Demo Workflow

### As an Attendee:
1. Open http://localhost:8000
2. Click "Give Feedback" on Maria Smith
3. Enter feedback in both text areas
4. Optionally add your name
5. Click "Send Feedback"
6. See confirmation message
7. Click "Back to Home"
8. Click voting category (e.g., "Best Speaker")
9. Select a candidate
10. Click "Submit Vote"

### As an Admin:
1. Open http://localhost:8000/#admin/login
2. Enter any email/password (e.g., admin@example.com / password)
3. Click "Sign in"
4. See Meeting Control dashboard
5. Click "Start meeting" to activate
6. Navigate tabs to view Members, Setup, Results
7. Click "Finish Meeting" when done
8. View delivery status
9. Click "Reset for New Meeting"

---

## 📂 Project Structure

```
app/
├── public/
│   ├── index.html              # Entry point
│   ├── styles.css              # All styling
│   ├── data.js                 # Sample data
│   ├── state.js                # State management
│   ├── router.js               # Navigation
│   ├── app.js                  # Main app
│   └── pages/                  # Page components
├── package.json
└── README.md                   # Detailed docs
```

---

## 🎨 Styling Notes

- All styling is in `public/styles.css`
- Mobile-first responsive design
- Uses utility classes (`.mb-4`, `.btn-primary`, etc.)
- No external CSS frameworks
- Ready for Tailwind or other CSS framework migration

---

## 🔐 Sample Data

**Club:** Doral Toastmasters

**Members:**
- Maria Smith (Prepared Speaker)
- John Smith (Prepared Speaker)
- Rene De Posada (Toastmaster)
- Sarah Smith (Topicsmaster)
- Alex Smith (General Evaluator)
- Jennifer Smith (Evaluator)
- Michael Smith (Evaluator)

**Voting Categories:**
1. Best Speaker (Maria, John)
2. Best Evaluator (Jennifer, Michael)
3. Best Table Topics (Sarah Johnson, Maria)

Modify `public/data.js` to change sample data.

---

## 🧪 Testing the App

### Test Feedback Submission:
1. Start meeting in admin
2. Go to attendee home
3. Click "Give Feedback" on any recipient
4. Fill both fields
5. Toggle "Add my name" to test conditional fields
6. Submit and verify confirmation

### Test Voting:
1. Click voting category
2. Verify candidates appear
3. Select one
4. Submit vote
5. Check "No candidates yet" message if category is empty

### Test Admin Functions:
1. Click "Meeting Control" tab
2. Click "Start meeting"
3. Click "Finish Meeting" (see confirmation)
4. View delivery status
5. Click "Reset for New Meeting"

### Test State Persistence:
1. Submit feedback and vote
2. Click "Back to Home"
3. Submit more feedback/votes
4. Admin can see all in results

---

## 📖 Documentation

- **Full PRD & Wireframes:** `.github/copilot-instructions.md`
- **App Details:** `app/README.md`
- **This Guide:** `app/QUICK_START.md`

---

## 🔧 Troubleshooting

### App not loading?
- Check server is running: `python3 -m http.server 8000 --directory public`
- Clear browser cache
- Try incognito/private window

### Styling looks broken?
- Refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors
- Ensure you're serving the `public/` folder

### Admin login not working?
- Use any email/password combination (demo authentication)
- Logout and try again
- Check browser localStorage (admin session flag)

### Data not persisting?
- This is expected - data stored in memory only
- Refresh page clears all submissions
- In production, would persist to Firebase

---

## 🚀 Next Steps

1. **Backend Integration**
   - Connect to Firebase
   - Replace AppState with real API calls
   - Implement email delivery

2. **Testing**
   - Test with actual club members
   - Gather feedback
   - Iterate on UX

3. **Deployment**
   - Deploy to GitHub Pages
   - Configure custom domain
   - Set up real authentication

4. **Enhancements**
   - Add more clubs
   - Implement email templates
   - Add analytics
   - Mobile app wrapper

---

## 💡 Tips

- Use browser DevTools console to inspect `state` object
- Check `router.currentPage` to see current route
- Modify `SAMPLE_DATA` in `data.js` to test with different data
- Add `console.log()` statements to trace execution
- Use Firefox/Chrome DevTools for responsive testing

---

## 📞 Support

Refer to:
1. **Detailed Documentation:** `.github/copilot-instructions.md`
2. **Code Comments:** Check inline code comments
3. **Console Errors:** Check browser console for details
4. **PRD Requirements:** See `.github/copilot-instructions.md` for full spec

---

**Happy developing! 🎉**
