// Admin Login Page
function renderAdminLoginPage() {
  return `
    <div class="center-screen">
      <div class="card" style="max-width: 24rem;">
        <h1 class="mb-6">Club administration</h1>
        <p class="text-muted mb-6">Demo sign-in only. Do not use real credentials.</p>

        <form id="adminLoginForm" class="space-y-4">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>

          <button type="submit" class="btn btn-primary btn-block">Sign in</button>
        </form>
        <p class="text-center mt-4"><a href="#home" class="nav-link">← Back to participant view</a></p>
      </div>
    </div>

  `;
}

function attachAdminLoginEvents() {
  const form = document.getElementById('adminLoginForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    localStorage.setItem('adminLoggedIn', 'true');
    window.location.hash = 'admin/dashboard';
  });
}
