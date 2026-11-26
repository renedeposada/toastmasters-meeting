// Attendee Home Page
function renderAttendeePage() {
  const { status } = state.meeting;

  if (status === 'ready') {
    return `
      <div class="center-screen">
        <div class="card" style="max-width: 24rem;">
          <h1 class="text-center mb-6">Doral Toastmasters</h1>
          <p class="text-center text-muted mb-4">The meeting is not active yet.</p>
          <p class="text-center text-muted">Please check back later.</p>
        </div>
      </div>
    `;
  }

  if (status === 'finished') {
    return `
      <div class="center-screen">
        <div class="card" style="max-width: 24rem;">
          <h1 class="text-center mb-6">Doral Toastmasters</h1>
          <p class="text-center text-muted mb-4">This meeting has finished.</p>
          <p class="text-center text-muted">Feedback and voting are closed.</p>
        </div>
      </div>
    `;
  }

  // Active meeting
  const recipients = SAMPLE_DATA.feedbackEligibleRecipients;
  const categories = SAMPLE_DATA.votingCategories;

  let html = `
    <div class="min-h-screen bg-gray-50">
      <div class="container">
        <div class="header">
          <h1 class="header-title">Doral Toastmasters</h1>
        </div>

        <div class="p-4">
          <!-- Give Feedback Section -->
          <div class="section">
            <h2>Give Feedback</h2>
            <div class="space-y-3">
  `;

  recipients.forEach((recipient) => {
    html += `
      <div class="recipient-card">
        <div>
          <div class="recipient-name">${recipient.name}</div>
          <div class="recipient-role">${recipient.role}</div>
        </div>
        <a href="#feedback/${recipient.id}" class="btn btn-primary">Give Feedback</a>
      </div>
    `;
  });

  html += `
            </div>
          </div>

          <!-- Vote Section -->
          <div class="section">
            <h2>Vote</h2>
            <div class="space-y-3">
  `;

  categories.forEach((category) => {
    html += `
      <a href="#vote/${category.id}" class="vote-option" style="text-decoration: none; color: inherit;">
        <span class="font-semibold">${category.name}</span>
        <span style="color: #9ca3af;">→</span>
      </a>
    `;
  });

  html += `
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return html;
}
