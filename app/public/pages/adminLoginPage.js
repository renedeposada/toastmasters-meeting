// Admin Login Page
function renderAdminLoginPage() {
  return `
    <div class="center-screen">
      <div class="card" style="max-width: 24rem;">
        <h1 class="mb-6">Club administration</h1>
        <p class="text-muted mb-6">Sign in</p>

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
      </div>
    </div>

    <script>
      document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email && password) {
          localStorage.setItem('adminLoggedIn', 'true');
          router.navigate('admin-dashboard');
        }
      });
    </script>
  `;
}
