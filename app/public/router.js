// Router for client-side navigation
class Router {
  constructor() {
    this.routes = new Map();
    this.currentPage = 'home';
    this.pageParams = {};
    this.listeners = [];
  }

  register(path, handler) {
    this.routes.set(path, handler);
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  navigate(path, params = {}) {
    this.currentPage = path;
    this.pageParams = params;
    this.notifyListeners();
  }

  navigateTo(path) {
    const parts = path.split('/').filter(Boolean);
    const route = parts[0] || 'home';
    const param = parts[1];

    if (route === 'feedback' && param) {
      this.navigate('feedback', { recipientId: param });
    } else if (route === 'vote' && param) {
      this.navigate('vote', { categoryId: param });
    } else if (route === 'admin') {
      const adminRoute = parts[1] || 'dashboard';
      this.navigate('admin-' + adminRoute, { section: adminRoute });
    } else {
      this.navigate(route);
    }
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  getCurrentHandler() {
    return this.routes.get(this.currentPage);
  }

  back() {
    if (this.currentPage.startsWith('admin')) {
      this.navigate('admin-dashboard');
    } else if (this.currentPage === 'feedback' || this.currentPage === 'vote') {
      this.navigate('home');
    } else if (this.currentPage === 'admin-login') {
      this.navigate('home');
    } else {
      this.navigate('home');
    }
  }
}

const router = new Router();

// Listen for hash changes (for browser back/forward)
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1) || 'home';
  router.navigateTo(hash);
});

// Initial navigation
window.addEventListener('load', () => {
  const initialHash = window.location.hash.slice(1) || 'home';
  router.navigateTo(initialHash);
});
