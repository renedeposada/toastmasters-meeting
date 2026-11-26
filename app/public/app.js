// Main App Controller
class ToastmastersApp {
  constructor() {
    this.appElement = document.getElementById('app');
    this.registerRoutes();
    this.setupRouter();
  }

  registerRoutes() {
    // Attendee routes
    router.register('home', () => renderAttendeePage());
    router.register('feedback', () => renderFeedbackPage());
    router.register('feedback-confirmation', () => renderFeedbackConfirmationPage());
    router.register('vote', () => renderVotingPage());
    router.register('vote-confirmation', () => renderVoteConfirmationPage());

    // Admin routes
    router.register('admin-login', () => renderAdminLoginPage());
    router.register('admin-dashboard', () => renderAdminDashboard());
    router.register('admin-members', () => renderAdminDashboard());
    router.register('admin-meeting-setup', () => renderAdminDashboard());
    router.register('admin-results', () => renderAdminDashboard());
  }

  setupRouter() {
    router.subscribe(() => {
      this.render();
    });
  }

  render() {
    if (router.currentPage.startsWith('admin-') && router.currentPage !== 'admin-login'
        && !localStorage.getItem('adminLoggedIn')) {
      window.location.hash = 'admin/login';
      return;
    }
    const handler = router.getCurrentHandler();
    if (handler) {
      this.appElement.innerHTML = handler();
    } else {
      this.appElement.innerHTML = renderAttendeePage();
    }
    attachFeedbackEvents();
    attachVotingEvents();
    attachAdminLoginEvents();
    attachAdminEventListeners();
  }

  start() {
    // Initial render
    this.render();
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new ToastmastersApp();
  app.start();
});
