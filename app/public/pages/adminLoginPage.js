// Admin Login Page
function renderAdminCheckingPage() {
  return `
    <div class="center-screen">
      <div class="card" style="max-width: 24rem;">
        <h1 class="mb-6">Club administration</h1>
        <p class="text-muted" role="status">Checking Admin access...</p>
      </div>
    </div>
  `;
}

function renderAdminLoginPage() {
  const denied = adminAuth.status === 'unauthorized' || adminAuth.status === 'authorization-error';
  const message = adminAuth.status === 'unauthorized'
    ? `This Google account is not authorized to administer ${escapeHtml(state.club.name)}.`
    : adminAuth.status === 'authorization-error'
      ? 'Unable to verify Admin access. Please contact the club administrator.'
      : 'Sign in with your Google account to continue.';
  const email = denied && adminAuth.user?.email
    ? `<p class="text-muted">${escapeHtml(adminAuth.user.email)}</p>`
    : '';
  const button = denied
    ? '<button type="button" data-action="admin-sign-out" class="btn btn-primary btn-block">Sign out</button>'
    : `<button type="button" data-action="google-sign-in" class="btn btn-primary btn-block" ${adminAuth.status === 'unavailable' ? 'disabled' : ''}>Sign in with Google</button>`;

  return `
    <div class="center-screen">
      <div class="card" style="max-width: 24rem;">
        <h1 class="mb-6">Club administration</h1>
        <p class="text-muted mb-6">${message}</p>
        ${email}
        ${adminAuth.status === 'unavailable' && !denied
          ? '<p class="text-muted mb-4">Google sign-in is temporarily unavailable.</p>'
          : ''}
        <div id="adminAuthMessage" role="alert" class="text-muted mb-4">${escapeHtml(adminAuth.signOutError)}</div>
        ${button}
        <p class="text-center mt-4"><a href="#home" class="nav-link">← Back to participant view</a></p>
      </div>
    </div>
  `;
}

function attachAdminLoginEvents() {
  const signInButton = document.querySelector('[data-action="google-sign-in"]');
  if (signInButton) {
    signInButton.addEventListener('click', async () => {
      signInButton.disabled = true;
      const message = document.getElementById('adminAuthMessage');
      if (message) message.textContent = 'Opening Google sign-in...';
      try {
        await adminAuth.signInWithGoogle();
      } catch (error) {
        if (message) message.textContent = error.message;
        signInButton.disabled = false;
      }
    });
  }

  const signOutButton = document.querySelector('[data-action="admin-sign-out"]');
  if (signOutButton) {
    signOutButton.addEventListener('click', async () => {
      signOutButton.disabled = true;
      try {
        await adminAuth.signOut();
      } catch (error) {
        const message = document.getElementById('adminAuthMessage');
        if (message) message.textContent = error.message;
        signOutButton.disabled = false;
      }
    });
  }
}
