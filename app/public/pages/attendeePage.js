// Attendee Home Page
function renderAdminLink() {
  const destination = localStorage.getItem('adminLoggedIn') ? 'dashboard' : 'login';
  return `<a href="#admin/${destination}" class="nav-link">Admin</a>`;
}

function renderAttendeePage() {
  const { status } = state.meeting;

  if (status === 'ready') {
    return `
      <div class="center-screen">
        <div class="card" style="max-width: 24rem;">
          <h1 class="text-center mb-6">Doral Toastmasters</h1>
          <p class="text-center text-muted mb-4">The meeting is not active yet.</p>
          <p class="text-center text-muted">Please check back later.</p>
          <p class="text-center mt-4">${renderAdminLink()}</p>
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
          <p class="text-center mt-4">${renderAdminLink()}</p>
        </div>
      </div>
    `;
  }

  // Active meeting
  const recipients = state.getFeedbackRecipients();
  const categories = state.getVotingCategories();

  let html = `
    <div class="min-h-screen bg-gray-50">
      <div class="container">
        <header class="header home-header">
          <div>
            <p class="brand-eyebrow">Toastmasters meeting companion</p>
            <h1 class="header-title">${escapeHtml(state.club.name)}</h1>
          </div>
          ${renderAdminLink()}
        </header>

        <div class="p-4">
          <!-- Give Feedback Section -->
          <div class="section">
            <h2>Give Feedback</h2>
            <p class="section-description">Share constructive feedback with your fellow members.</p>
            <div class="space-y-3">
  `;

  recipients.forEach((recipient) => {
    html += `
      <div class="recipient-card">
        <div>
          <div class="recipient-name">${escapeHtml(recipient.name)}</div>
          <div class="recipient-role">${escapeHtml(recipient.role)}</div>
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
            <p class="section-description">Recognize the speakers and evaluators who inspired you.</p>
            <div class="space-y-3">
  `;

  categories.forEach((category) => {
    html += `
      <a href="#vote/${category.id}" class="vote-option">
        <span class="font-semibold">${category.name}</span>
        <span aria-hidden="true">→</span>
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
