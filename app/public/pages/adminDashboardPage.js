// Admin Dashboard Page
function renderAdminDashboard() {
  const section = router.currentPage.slice('admin-'.length);
  const sections = {
    dashboard: ['Meeting Control', renderMeetingControlSection],
    members: ['Members', renderMembersSection],
    'meeting-setup': ['Meeting Setup', renderMeetingSetupSection],
    results: ['Results', renderResultsSection],
  };
  const current = sections[section] ? section : 'dashboard';

  return `
    <div class="min-h-screen bg-gray-50">
      <div class="admin-header">
        <div class="admin-header-title">
          <span>${escapeHtml(state.club.name)} - Admin</span>
          <div class="admin-actions">
            <a href="#home" class="nav-link">Participant view</a>
            <button type="button" data-action="sign-out" class="btn btn-link">Sign out</button>
          </div>
        </div>
        <p id="adminAuthMessage" role="alert" class="text-center">${escapeHtml(adminAuth.signOutError)}</p>
        <nav class="admin-nav" aria-label="Administration">
          ${Object.entries(sections).map(([id, [label]]) => `
            <a href="#admin/${id}" class="tab admin-tab ${id === current ? 'active' : ''}">${label}</a>
          `).join('')}
        </nav>
      </div>
      <div class="admin-content" id="adminContent">${sections[current][1]()}</div>
    </div>
  `;
}

function renderMeetingControlSection() {
  const { status } = state.meeting;
  const actions = {
    ready: '<button type="button" data-action="start" class="btn btn-success">Start meeting</button>',
    active: '<button type="button" data-action="finish" class="btn btn-danger">Finish Meeting</button>',
    finished: `<p class="text-muted">Feedback delivery is not available in this local prototype.</p>
      <button type="button" data-action="reset" class="btn btn-warning">Reset for New Meeting</button>`,
  };
  return `
    <div class="card">
      <h2>Meeting Control</h2>
      <p class="font-semibold mb-4">Status: ${escapeHtml(status.toUpperCase())}</p>
      ${actions[status]}
    </div>
  `;
}

function renderMembersSection(editId = null, adding = false) {
  const editing = state.club.members.find((member) => member.id === editId);
  const form = adding || editing ? `
    <form id="memberForm" class="card space-y-3" data-id="${editing ? escapeHtml(editing.id) : ''}">
      <h3>${editing ? 'Edit member' : 'Add member'}</h3>
      <div class="form-group">
        <label for="memberName">Name</label>
        <input id="memberName" name="name" type="text" required value="${editing ? escapeHtml(editing.name) : ''}">
      </div>
      <div class="form-group">
        <label for="memberEmail">Email</label>
        <input id="memberEmail" name="email" type="email" required value="${editing ? escapeHtml(editing.email) : ''}">
      </div>
      <label class="checkbox-label">
        <input type="checkbox" name="active" ${!editing || editing.active ? 'checked' : ''}> Active
      </label>
      <button type="submit" class="btn btn-primary">Save member</button>
      <button type="button" class="btn btn-link" data-action="cancel-member">Cancel</button>
    </form>
  ` : '';

  return `
    <div class="card">
      <div class="flex-between mb-6">
        <h2>Members</h2>
        <button type="button" data-action="add-member" class="btn btn-primary">Add member</button>
      </div>
      ${form}
      <div class="space-y-3">
        ${state.club.members.map((member) => `
          <div class="list-item">
            <div>
              <div class="font-semibold">${escapeHtml(member.name)}</div>
              <div class="text-sm">${escapeHtml(member.email)}</div>
            </div>
            <div class="flex gap-2">
              <span class="status ${member.active ? 'status-active' : 'status-inactive'}">${member.active ? 'Active' : 'Inactive'}</span>
              <button type="button" data-action="edit-member" data-id="${escapeHtml(member.id)}" class="btn btn-link">Edit</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function memberOptions(selectedIds = []) {
  return state.club.members.filter((member) => member.active || selectedIds.includes(member.id))
    .map((member) => `<option value="${escapeHtml(member.id)}" ${selectedIds.includes(member.id) ? 'selected' : ''}>${escapeHtml(member.name)}${member.active ? '' : ' (inactive)'}</option>`)
    .join('');
}

function renderMeetingSetupSection() {
  const meeting = state.meeting;
  const select = (name, label, selected) => `
    <div class="form-group">
      <label for="${name}">${label}</label>
      <select id="${name}" name="${name}">
        <option value="">Select member</option>
        ${memberOptions(selected ? [selected.id] : [])}
      </select>
    </div>`;
  const guests = meeting.tableTopicsParticipants.filter((participant) => participant.isGuest)
    .map((guest) => guest.name).join('\n');
  return `
    <form id="setupForm" class="card space-y-6">
      <h2>Meeting Setup</h2>
      <p class="text-muted">Status: ${escapeHtml(meeting.status)}</p>
      <h3>Prepared Speakers</h3>
      ${[0, 1, 2].map((index) => select(`speaker${index}`, `Speaker ${index + 1}`, meeting.preparedSpeakers[index])).join('')}
      <h3>Key Roles</h3>
      ${select('toastmaster', 'Toastmaster', meeting.toastmaster)}
      ${select('topicsmaster', 'Topicsmaster', meeting.topicsmaster)}
      ${select('generalEvaluator', 'General Evaluator', meeting.generalEvaluator)}
      <div class="form-group">
        <label for="evaluators">Evaluators (select multiple)</label>
        <select id="evaluators" name="evaluators" multiple size="5">
          ${memberOptions(meeting.evaluators.map((member) => member.id))}
        </select>
      </div>
      <div class="form-group">
        <label for="participants">Table Topics members (select multiple)</label>
        <select id="participants" name="participants" multiple size="5">
          ${memberOptions(meeting.tableTopicsParticipants.filter((participant) => !participant.isGuest).map((member) => member.id))}
        </select>
      </div>
      <div class="form-group">
        <label for="guests">Table Topics guests (one name per line)</label>
        <textarea id="guests" name="guests">${escapeHtml(guests)}</textarea>
      </div>
      <button type="submit" class="btn btn-primary">Save setup</button>
      <p id="setupMessage" role="status"></p>
    </form>
  `;
}

function renderResultsSection() {
  const results = state.getVoteResults();
  return `
    <div class="card">
      <h2>Results</h2>
      <div class="space-y-8 mt-6">
        ${state.getVotingCategories().map((category) => {
          const candidates = Object.values(results[category.id].votes).sort((a, b) => b.count - a.count);
          const max = candidates[0]?.count || 0;
          const winners = candidates.filter((candidate) => candidate.count === max);
          return `
            <div>
              <h3>${escapeHtml(category.name)}</h3>
              ${max === 0 ? '<p class="text-muted">No votes yet.</p>' : `
                ${candidates.map((item) => `<div class="delivery-status"><span>${escapeHtml(item.candidate.name)}</span><span>${item.count}</span></div>`).join('')}
                <p class="font-semibold">${winners.length > 1 ? 'Tie' : 'Winner'}: ${winners.map((item) => escapeHtml(item.candidate.name)).join(', ')}</p>
              `}
            </div>`;
        }).join('')}
      </div>
      <h3 class="mt-6">Feedback recorded in this session</h3>
      ${state.feedback.length ? state.feedback.map((item) => {
        const recipient = state.getFeedbackRecipients().find((member) => member.id === item.recipientId);
        return `<div class="card">
          <strong>${escapeHtml(recipient?.name || item.recipientName || 'Former recipient')}</strong>
          <p>From: ${escapeHtml(item.senderName || 'Anonymous')}</p>
          <p>What worked well: ${escapeHtml(item.wellWorked)}</p>
          <p>What could improve: ${escapeHtml(item.improve)}</p>
        </div>`;
      }).join('') : '<p class="text-muted">No feedback yet.</p>'}
    </div>
  `;
}

function attachAdminEventListeners() {
  const content = document.getElementById('adminContent');
  if (!content) return;

  document.querySelector('[data-action="sign-out"]').addEventListener('click', async () => {
    try {
      await adminAuth.signOut();
    } catch (error) {
      const message = document.getElementById('adminAuthMessage');
      if (message) message.textContent = error.message;
    }
  });
  content.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'start') {
      state.startMeeting();
      router.navigateTo('admin/dashboard');
    } else if (action === 'finish' && confirm('Finish this meeting? Feedback and voting will close.')) {
      state.finishMeeting();
      router.navigateTo('admin/dashboard');
    } else if (action === 'reset' && confirm('Reset for a new meeting? Current participants, feedback, votes, and results will be cleared.')) {
      state.resetMeeting();
      router.navigateTo('admin/dashboard');
    } else if (action === 'add-member') {
      content.innerHTML = renderMembersSection(null, true);
    } else if (action === 'edit-member') {
      content.innerHTML = renderMembersSection(button.dataset.id);
    } else if (action === 'cancel-member') {
      content.innerHTML = renderMembersSection();
    }
  });

  content.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    if (form.id === 'memberForm') {
      const name = data.get('name').trim();
      const email = data.get('email').trim();
      if (!name || !email) {
        alert('Enter a name and email address.');
        return;
      }
      const member = state.club.members.find((item) => item.id === form.dataset.id);
      if (member) {
        Object.assign(member, { name, email, active: data.has('active') });
        const meetingMembers = [
          ...state.meeting.preparedSpeakers, state.meeting.toastmaster, state.meeting.topicsmaster,
          state.meeting.generalEvaluator, ...state.meeting.evaluators, ...state.meeting.tableTopicsParticipants,
        ];
        meetingMembers.filter((item) => item && item.id === member.id).forEach((item) => { item.name = name; });
      } else {
        state.club.members.push({ id: state.createId(), name, email, active: data.has('active') });
      }
      content.innerHTML = renderMembersSection();
    } else if (form.id === 'setupForm') {
      const member = (id) => state.club.members.find((item) => item.id === id);
      const selected = (name) => data.getAll(name).map(member).filter(Boolean).map(({ id, name }) => ({ id, name }));
      const speakerIds = [data.get('speaker0'), data.get('speaker1'), data.get('speaker2')].filter(Boolean);
      if (new Set(speakerIds).size !== speakerIds.length) {
        document.getElementById('setupMessage').textContent = 'Select each speaker only once.';
        return;
      }
      const role = (name) => {
        const selectedMember = member(data.get(name));
        return selectedMember ? { id: selectedMember.id, name: selectedMember.name } : null;
      };
      const oldGuests = state.meeting.tableTopicsParticipants.filter((item) => item.isGuest);
      const guestNames = data.get('guests').split('\n').map((name) => name.trim()).filter(Boolean);
      if (new Set(guestNames.map((name) => name.toLowerCase())).size !== guestNames.length) {
        document.getElementById('setupMessage').textContent = 'Enter each guest only once.';
        return;
      }
      state.meeting.preparedSpeakers = speakerIds.map(member).map(({ id, name }) => ({ id, name }));
      state.meeting.toastmaster = role('toastmaster');
      state.meeting.topicsmaster = role('topicsmaster');
      state.meeting.generalEvaluator = role('generalEvaluator');
      state.meeting.evaluators = selected('evaluators');
      state.meeting.tableTopicsParticipants = [
        ...selected('participants').map((item) => ({ ...item, isGuest: false })),
        ...guestNames.map((name) => oldGuests.find((item) => item.name === name)
          || { id: state.createId(), name, isGuest: true }),
      ];
      document.getElementById('setupMessage').textContent = 'Meeting setup saved.';
    }
  });
}
