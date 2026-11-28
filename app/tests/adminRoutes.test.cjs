const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function createApp(status, currentPage) {
  const appElement = { innerHTML: '' };
  const routes = new Map();
  const router = {
    currentPage,
    register: (page, handler) => routes.set(page, handler),
    subscribe() {},
    getCurrentHandler: () => routes.get(router.currentPage),
  };
  const calls = { loginEvents: 0 };
  const adminAuth = {
    status,
    subscribe() {},
  };
  const window = { location: { hash: '' } };
  const context = vm.createContext({
    document: { getElementById: () => appElement, addEventListener() {} },
    window,
    router,
    adminAuth,
    renderAttendeePage: () => 'attendee',
    renderFeedbackPage: () => 'feedback',
    renderFeedbackConfirmationPage: () => 'feedback-confirmation',
    renderVotingPage: () => 'vote',
    renderVoteConfirmationPage: () => 'vote-confirmation',
    renderAdminLoginPage: () => 'login',
    renderAdminCheckingPage: () => 'checking',
    renderAdminDashboard: () => 'protected-admin-content',
    attachFeedbackEvents() {},
    attachVotingEvents() {},
    attachAdminLoginEvents: () => { calls.loginEvents += 1; },
    attachAdminEventListeners() {},
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../public/app.js'), 'utf8'), context);
  const app = new (vm.runInContext('ToastmastersApp', context))();

  return { adminAuth, app, appElement, calls, router, window };
}

test('Admin routes wait for Firebase authentication and authorization checks', () => {
  const { app, appElement } = createApp('checking', 'admin-dashboard');

  app.render();

  assert.equal(appElement.innerHTML, 'checking');
});

test('only authorized Firebase users can render protected Admin routes', () => {
  const authorized = createApp('authorized', 'admin-results');
  authorized.app.render();
  assert.equal(authorized.appElement.innerHTML, 'protected-admin-content');
  assert.equal(authorized.window.location.hash, '');

  for (const status of ['signed-out', 'unauthorized', 'authorization-error', 'unavailable']) {
    const denied = createApp(status, 'admin-results');
    denied.app.render();
    assert.equal(denied.window.location.hash, 'admin/login');
    assert.equal(denied.appElement.innerHTML, 'login');
    assert.equal(denied.calls.loginEvents, 1);
  }
});

test('authorized user visiting the login route is redirected to the dashboard', () => {
  const { app, appElement, window } = createApp('authorized', 'admin-login');

  app.render();

  assert.equal(window.location.hash, 'admin/dashboard');
  assert.equal(appElement.innerHTML, 'checking');
});

test('attendee routes remain available while Firebase authentication is checking', () => {
  const { app, appElement, window } = createApp('checking', 'home');

  app.render();

  assert.equal(appElement.innerHTML, 'attendee');
  assert.equal(window.location.hash, '');
});

test('signing out redirects a protected Admin route to the login screen', () => {
  const { app, appElement, adminAuth, window } = createApp('authorized', 'admin-dashboard');
  adminAuth.status = 'signed-out';

  app.render();

  assert.equal(window.location.hash, 'admin/login');
  assert.equal(appElement.innerHTML, 'login');
});
