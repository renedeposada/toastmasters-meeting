// Feedback Form Page
function renderFeedbackPage() {
  const { recipientId } = router.pageParams;
  if (state.meeting.status !== 'active') return renderAttendeePage();
  const recipient = state.getFeedbackRecipients().find((r) => r.id === recipientId);

  if (!recipient) {
    return '<div class="text-center p-4">Recipient not found</div>';
  }

  return `
    <div class="min-h-screen bg-gray-50">
      <div class="container">
        <div class="header participant-page-header">
          <div class="flex gap-4" style="align-items: center;">
            <a href="#home" class="nav-link">← Home</a>
            <h1 style="margin: 0;">Give Feedback</h1>
          </div>
          ${renderAdminLink()}
        </div>

        <div class="p-4">
          <form id="feedbackForm" class="card space-y-6">
            <!-- Recipient Info -->
            <div>
              <p class="font-semibold" style="font-size: 1.125rem;">${escapeHtml(recipient.name)}</p>
              <p class="text-muted">${escapeHtml(recipient.role)}</p>
            </div>

            <!-- What worked well -->
            <div class="form-group">
              <label for="wellWorked">What worked well?</label>
              <textarea id="wellWorked" name="wellWorked" placeholder="Share what you appreciated..." required></textarea>
            </div>

            <!-- What could help improve -->
            <div class="form-group">
              <label for="improve">What could help improve?</label>
              <textarea id="improve" name="improve" placeholder="Share constructive suggestions..." required></textarea>
            </div>

            <!-- Attribution -->
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" id="includeName" name="includeName">
                Add my name to this feedback
              </label>
            </div>

            <!-- Name input (conditional) -->
            <div id="nameField" class="form-group" style="display: none;">
              <label for="senderName">Your name</label>
              <input type="text" id="senderName" name="senderName" placeholder="Enter your name">
            </div>

            <!-- Submit button -->
            <button type="submit" class="btn btn-primary btn-block">Send Feedback</button>
          </form>
        </div>
      </div>
    </div>

  `;
}

function attachFeedbackEvents() {
  const form = document.getElementById('feedbackForm');
  if (!form) return;
  const includeName = document.getElementById('includeName');
  const senderName = document.getElementById('senderName');
  includeName.addEventListener('change', () => {
    document.getElementById('nameField').style.display = includeName.checked ? 'block' : 'none';
    senderName.required = includeName.checked;
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (state.meeting.status !== 'active') {
      router.navigateTo('home');
      return;
    }
    state.submitFeedback(router.pageParams.recipientId,
      document.getElementById('wellWorked').value,
      document.getElementById('improve').value,
      includeName.checked ? senderName.value : null);
    window.location.hash = 'feedback-confirmation';
  });
}

// Feedback Confirmation Page
function renderFeedbackConfirmationPage() {
  return `
    <div class="center-screen">
      <div class="card" style="max-width: 24rem;">
        <h2 class="text-center mb-4">Feedback recorded</h2>
        <p class="text-center text-muted mb-6">Thank you for your feedback.</p>
        <a href="#home" class="btn btn-primary btn-block" style="text-align: center;">Back to Home</a>
        <p class="text-center mt-4">${renderAdminLink()}</p>
      </div>
    </div>
  `;
}
