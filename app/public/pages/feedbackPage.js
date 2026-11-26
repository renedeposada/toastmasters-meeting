// Feedback Form Page
function renderFeedbackPage() {
  const { recipientId } = router.pageParams;
  const recipient = SAMPLE_DATA.feedbackEligibleRecipients.find((r) => r.id === recipientId);

  if (!recipient) {
    return '<div class="text-center p-4">Recipient not found</div>';
  }

  return `
    <div class="min-h-screen bg-gray-50">
      <div class="container">
        <div class="header">
          <div class="flex gap-4" style="align-items: center;">
            <a href="#home" class="nav-link">← Home</a>
            <h1 style="margin: 0;">Give Feedback</h1>
          </div>
        </div>

        <div class="p-4">
          <form id="feedbackForm" class="card space-y-6">
            <!-- Recipient Info -->
            <div>
              <p class="font-semibold" style="font-size: 1.125rem;">${recipient.name}</p>
              <p class="text-muted">${recipient.role}</p>
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

    <script>
      const includeName = document.getElementById('includeName');
      const nameField = document.getElementById('nameField');
      const feedbackForm = document.getElementById('feedbackForm');

      includeName.addEventListener('change', (e) => {
        nameField.style.display = e.target.checked ? 'block' : 'none';
      });

      feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const wellWorked = document.getElementById('wellWorked').value;
        const improve = document.getElementById('improve').value;
        const senderName = document.getElementById('includeName').checked 
          ? document.getElementById('senderName').value 
          : null;

        state.submitFeedback('${recipientId}', wellWorked, improve, senderName);
        
        // Show confirmation page
        router.navigate('feedback-confirmation');
      });
    </script>
  `;
}

// Feedback Confirmation Page
function renderFeedbackConfirmationPage() {
  return `
    <div class="center-screen">
      <div class="card" style="max-width: 24rem;">
        <h2 class="text-center mb-4">Feedback sent</h2>
        <p class="text-center text-muted mb-6">Thank you for your feedback.</p>
        <a href="#home" class="btn btn-primary btn-block" style="text-align: center;">Back to Home</a>
      </div>
    </div>
  `;
}
