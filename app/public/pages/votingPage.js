// Voting Form Page
function renderVotingPage() {
  const { categoryId } = router.pageParams;
  if (state.meeting.status !== 'active') return renderAttendeePage();
  const category = state.getVotingCategories().find((c) => c.id === categoryId);

  if (!category) {
    return '<div class="text-center p-4">Category not found</div>';
  }

  if (category.candidates.length === 0) {
    return `
      <div class="min-h-screen bg-gray-50">
        <div class="container">
          <div class="header participant-page-header">
            <div class="flex gap-4" style="align-items: center;">
              <a href="#home" class="nav-link">← Home</a>
              <h1 style="margin: 0;">${category.name}</h1>
            </div>
            ${renderAdminLink()}
          </div>

          <div class="p-4">
            <div class="card text-center">
              <p class="text-muted">No candidates yet</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  let candidatesHtml = '';
  category.candidates.forEach((candidate) => {
    candidatesHtml += `
      <label class="radio-option">
        <input type="radio" name="candidate" value="${candidate.id}">
        ${escapeHtml(candidate.name)}
      </label>
    `;
  });

  return `
    <div class="min-h-screen bg-gray-50">
      <div class="container">
        <div class="header participant-page-header">
          <div class="flex gap-4" style="align-items: center;">
            <a href="#home" class="nav-link">← Home</a>
            <h1 style="margin: 0;">${category.name}</h1>
          </div>
          ${renderAdminLink()}
        </div>

        <div class="p-4">
          <form id="votingForm" class="card space-y-6">
            <p class="font-semibold">Choose one:</p>

            <!-- Candidates -->
            <div id="candidatesList">
              ${candidatesHtml}
            </div>

            <!-- Submit button -->
            <button type="submit" class="btn btn-primary btn-block" id="submitBtn" disabled>Submit Vote</button>
          </form>
        </div>
      </div>
    </div>

  `;
}

function attachVotingEvents() {
  const form = document.getElementById('votingForm');
  if (!form) return;
  form.addEventListener('change', () => {
    document.getElementById('submitBtn').disabled = !form.querySelector('input[name="candidate"]:checked');
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (state.meeting.status !== 'active') {
      router.navigateTo('home');
      return;
    }
    const selected = form.querySelector('input[name="candidate"]:checked');
    if (!selected) return;
    state.submitVote(router.pageParams.categoryId, selected.value);
    window.location.hash = 'vote-confirmation';
  });
}

// Vote Confirmation Page
function renderVoteConfirmationPage() {
  return `
    <div class="center-screen">
      <div class="card" style="max-width: 24rem;">
        <h2 class="text-center mb-4">Vote submitted</h2>
        <p class="text-center text-muted mb-6">Thank you for voting.</p>
        <a href="#home" class="btn btn-primary btn-block" style="text-align: center;">Back to Home</a>
        <p class="text-center mt-4">${renderAdminLink()}</p>
      </div>
    </div>
  `;
}
