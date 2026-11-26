// Voting Form Page
function renderVotingPage() {
  const { categoryId } = router.pageParams;
  const category = SAMPLE_DATA.votingCategories.find((c) => c.id === categoryId);

  if (!category) {
    return '<div class="text-center p-4">Category not found</div>';
  }

  if (category.candidates.length === 0) {
    return `
      <div class="min-h-screen bg-gray-50">
        <div class="container">
          <div class="header">
            <div class="flex gap-4" style="align-items: center;">
              <a href="#home" class="nav-link">← Home</a>
              <h1 style="margin: 0;">${category.name}</h1>
            </div>
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
        ${candidate.name}
      </label>
    `;
  });

  return `
    <div class="min-h-screen bg-gray-50">
      <div class="container">
        <div class="header">
          <div class="flex gap-4" style="align-items: center;">
            <a href="#home" class="nav-link">← Home</a>
            <h1 style="margin: 0;">${category.name}</h1>
          </div>
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

    <script>
      const votingForm = document.getElementById('votingForm');
      const radioInputs = votingForm.querySelectorAll('input[type="radio"]');
      const submitBtn = document.getElementById('submitBtn');

      radioInputs.forEach((input) => {
        input.addEventListener('change', () => {
          submitBtn.disabled = false;
        });
      });

      votingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedCandidate = votingForm.querySelector('input[type="radio"]:checked').value;
        
        state.submitVote('${categoryId}', selectedCandidate);
        
        // Show confirmation page
        router.navigate('vote-confirmation');
      });
    </script>
  `;
}

// Vote Confirmation Page
function renderVoteConfirmationPage() {
  return `
    <div class="center-screen">
      <div class="card" style="max-width: 24rem;">
        <h2 class="text-center mb-4">Vote submitted</h2>
        <p class="text-center text-muted mb-6">Thank you for voting.</p>
        <a href="#home" class="btn btn-primary btn-block" style="text-align: center;">Back to Home</a>
      </div>
    </div>
  `;
}
