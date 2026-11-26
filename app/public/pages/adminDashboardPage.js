// Admin Dashboard Page
function renderAdminDashboard() {
  const isLoggedIn = localStorage.getItem('adminLoggedIn');
  if (!isLoggedIn) {
    router.navigate('admin-login');
    return renderAdminLoginPage();
  }

  const { status } = state.meeting;

  return `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="admin-header">
        <div class="admin-header-title">
          <span>Doral Toastmasters - Admin</span>
          <button onclick="handleAdminSignOut()" class="btn btn-link">Sign out</button>
        </div>

        <!-- Navigation -->
        <div class="admin-nav">
          <button class="tab admin-tab active" data-section="meeting-control">Meeting Control</button>
          <button class="tab admin-tab" data-section="members">Members</button>
          <button class="tab admin-tab" data-section="meeting-setup">Meeting Setup</button>
          <button class="tab admin-tab" data-section="results">Results</button>
        </div>
      </div>

      <!-- Content -->
      <div class="admin-content">
        <div id="adminContent"></div>
      </div>
    </div>

    <script>
      function handleAdminSignOut() {
        localStorage.removeItem('adminLoggedIn');
        router.navigate('admin-login');
      }

      function renderAdminSection(section) {
        const contentDiv = document.getElementById('adminContent');
        
        // Update active tab
        document.querySelectorAll('.admin-tab').forEach((tab) => {
          tab.classList.remove('active');
        });
        event.target.classList.add('active');

        if (section === 'meeting-control') {
          contentDiv.innerHTML = renderMeetingControlSection();
        } else if (section === 'members') {
          contentDiv.innerHTML = renderMembersSection();
        } else if (section === 'meeting-setup') {
          contentDiv.innerHTML = renderMeetingSetupSection();
        } else if (section === 'results') {
          contentDiv.innerHTML = renderResultsSection();
        }

        // Re-attach event listeners
        attachAdminEventListeners();
      }

      document.querySelectorAll('.admin-tab').forEach((tab) => {
        tab.addEventListener('click', (e) => {
          renderAdminSection(e.target.dataset.section);
        });
      });

      // Render default section
      document.getElementById('adminContent').innerHTML = renderMeetingControlSection();
      attachAdminEventListeners();
    </script>
  `;
}

function renderMeetingControlSection() {
  const { status } = state.meeting;

  let html = `
    <div class="card">
      <h2>Meeting Control</h2>
      <div class="mt-6">
        <p class="font-semibold mb-4">Status: <span style="color: #2563eb; text-transform: uppercase;">${status}</span></p>
  `;

  if (status === 'ready') {
    html += `
      <div class="space-y-4">
        <p class="text-muted">The permanent club QR / URL remains unchanged.</p>
        <button onclick="handleStartMeeting()" class="btn btn-success">Start meeting</button>
      </div>
    `;
  } else if (status === 'active') {
    html += `
      <div class="space-y-4">
        <p class="text-muted">Feedback and voting are available to attendees.</p>
        <button onclick="handleFinishMeeting()" class="btn btn-danger">Finish Meeting</button>
      </div>
    `;
  } else if (status === 'finished') {
    html += `
      <div class="space-y-4">
        <p class="text-muted mb-4">Feedback and voting are closed.</p>
        <div style="background-color: #f3f4f6; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
          <h3>Feedback delivery</h3>
          <div class="space-y-2 mt-4">
            <div class="delivery-status">
              <span class="delivery-recipient">Maria Smith</span>
              <span class="delivery-status-badge delivery-sent">Sent</span>
            </div>
            <div class="delivery-status">
              <span class="delivery-recipient">John Smith</span>
              <span class="delivery-status-badge delivery-pending">Pending</span>
            </div>
            <div class="delivery-status">
              <span class="delivery-recipient">Rene De Posada</span>
              <div style="display: flex; gap: 1rem; align-items: center;">
                <span class="delivery-status-badge delivery-failed">Failed</span>
                <button onclick="handleRetryDelivery()" class="btn btn-link">Retry</button>
              </div>
            </div>
          </div>
        </div>
        <button onclick="handleResetMeeting()" class="btn btn-warning">Reset for New Meeting</button>
      </div>
    `;
  }

  html += `
      </div>
    </div>
  `;

  return html;
}

function renderMembersSection() {
  const members = state.club.members;

  let html = `
    <div class="card">
      <div class="flex-between mb-6">
        <h2 style="margin: 0;">Members</h2>
        <button onclick="showMemberForm()" class="btn btn-primary">Add member</button>
      </div>

      <div class="space-y-3">
  `;

  members.forEach((member) => {
    html += `
      <div class="list-item">
        <div>
          <div class="font-semibold">${member.name}</div>
          <div class="text-sm">${member.email}</div>
        </div>
        <div class="flex gap-2" style="align-items: center;">
          <span class="status ${member.active ? 'status-active' : 'status-inactive'}">
            ${member.active ? 'Active' : 'Inactive'}
          </span>
          <button onclick="editMember('${member.id}')" class="btn btn-link">Edit</button>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  return html;
}

function renderMeetingSetupSection() {
  const activeMembersOptions = state.club.members.filter((m) => m.active);

  let speakersHtml = '';
  for (let i = 1; i <= 3; i++) {
    speakersHtml += `
      <div class="form-group">
        <label>Speaker ${i}</label>
        <select>
          <option value="">Select member</option>
          ${activeMembersOptions.map((m) => `<option value="${m.id}">${m.name}</option>`).join('')}
        </select>
      </div>
    `;
  }

  return `
    <div class="card">
      <div class="flex-between mb-6">
        <div>
          <h2 style="margin: 0;">Meeting Setup</h2>
          <p class="text-muted text-sm mt-1">Status: Ready</p>
        </div>
      </div>

      <div class="space-y-8">
        <!-- Prepared Speakers -->
        <div>
          <h3>Prepared Speakers</h3>
          <div class="space-y-3">
            ${speakersHtml}
          </div>
        </div>

        <!-- Key Roles -->
        <div>
          <div class="space-y-3">
            <div class="form-group">
              <label>Toastmaster</label>
              <select>
                <option value="">Select member</option>
                ${activeMembersOptions.map((m) => `<option value="${m.id}">${m.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label>Topicsmaster</label>
              <select>
                <option value="">Select member</option>
                ${activeMembersOptions.map((m) => `<option value="${m.id}">${m.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label>General Evaluator</label>
              <select>
                <option value="">Select member</option>
                ${activeMembersOptions.map((m) => `<option value="${m.id}">${m.name}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Evaluators -->
        <div>
          <h3>Evaluators</h3>
          <div class="space-y-2 mb-4">
            ${state.meeting.evaluators.length === 0
              ? '<p class="text-muted text-sm">No evaluators added yet.</p>'
              : state.meeting.evaluators
                  .map(
                    (evaluator) => `
              <div class="delivery-status">
                <span>${evaluator.name}</span>
                <button class="btn btn-link" style="color: #dc2626;">Remove</button>
              </div>
            `
                  )
                  .join('')}
          </div>
          <button class="btn btn-link">Add evaluator</button>
        </div>

        <!-- Table Topics -->
        <div>
          <h3>Table Topics participants</h3>
          <div class="space-y-2 mb-4">
            ${state.meeting.tableTopicsParticipants.length === 0
              ? '<p class="text-muted text-sm">No participants added yet.</p>'
              : state.meeting.tableTopicsParticipants
                  .map(
                    (participant) => `
              <div class="delivery-status">
                <span>${participant.name}</span>
                <button class="btn btn-link" style="color: #dc2626;">Remove</button>
              </div>
            `
                  )
                  .join('')}
          </div>
          <div class="flex gap-2">
            <button class="btn btn-link">Add member</button>
            <button class="btn btn-link">Add guest</button>
          </div>
        </div>

        <!-- Save Button -->
        <button class="btn btn-primary btn-block">Save setup</button>
      </div>
    </div>
  `;
}

function renderResultsSection() {
  const results = state.getVoteResults();

  let html = `
    <div class="card">
      <h2>Results</h2>
      <div class="space-y-8 mt-6">
  `;

  SAMPLE_DATA.votingCategories.forEach((category) => {
    const categoryResults = results[category.id];
    const sortedCandidates = Object.values(categoryResults.votes).sort((a, b) => b.count - a.count);
    const maxVotes = sortedCandidates[0]?.count || 0;
    const winnersCount = sortedCandidates.filter((c) => c.count === maxVotes).length;

    html += `
      <div>
        <h3>${category.name}</h3>
        <div class="space-y-2">
    `;

    if (sortedCandidates.length === 0 || sortedCandidates[0].count === 0) {
      html += '<p class="text-muted">No votes yet.</p>';
    } else {
      sortedCandidates.forEach((item) => {
        html += `
          <div class="delivery-status">
            <span>${item.candidate.name}</span>
            <span class="font-semibold">${item.count}</span>
          </div>
        `;
      });

      html += `
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
      `;

      if (winnersCount > 1) {
        const winners = sortedCandidates
          .filter((c) => c.count === maxVotes)
          .map((c) => c.candidate.name)
          .join(', ');
        html += `<p class="font-semibold">Tie: ${winners}</p>`;
      } else {
        html += `<p class="font-semibold">Winner: ${sortedCandidates[0]?.candidate.name}</p>`;
      }

      html += '</div>';
    }

    html += `
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  return html;
}

function attachAdminEventListeners() {
  // Attach any dynamic event listeners needed
}

function handleStartMeeting() {
  state.startMeeting();
  router.navigate('admin-dashboard');
}

function handleFinishMeeting() {
  if (confirm('Finish this meeting? Feedback and voting will close.')) {
    state.finishMeeting();
    router.navigate('admin-dashboard');
  }
}

function handleResetMeeting() {
  if (confirm('Reset for a new meeting? Current participants, feedback, votes, and results will be cleared.')) {
    state.resetMeeting();
    router.navigate('admin-dashboard');
  }
}

function handleRetryDelivery() {
  alert('Retry delivery initiated');
}

function showMemberForm() {
  alert('Add member form - to be implemented');
}

function editMember(memberId) {
  alert('Edit member form for ' + memberId + ' - to be implemented');
}
