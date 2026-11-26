const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function appContext(signedIn) {
  const context = vm.createContext({
    structuredClone,
    localStorage: { getItem: () => signedIn ? 'true' : null },
    router: { currentPage: 'admin-dashboard', pageParams: {} },
  });
  for (const file of [
    'data.js', 'state.js', 'pages/attendeePage.js', 'pages/feedbackPage.js',
    'pages/votingPage.js', 'pages/adminLoginPage.js', 'pages/adminDashboardPage.js',
  ]) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../public', file), 'utf8'), context);
  }
  return context;
}

test('participant screens link to login or dashboard according to the admin session', () => {
  for (const signedIn of [false, true]) {
    const app = appContext(signedIn);
    const destination = signedIn ? '#admin/dashboard' : '#admin/login';
    for (const status of ['ready', 'active', 'finished']) {
      vm.runInContext(`state.meeting.status = '${status}'`, app);
      assert.ok(app.renderAttendeePage().includes(`href="${destination}"`));
    }
    vm.runInContext("state.meeting.status = 'active'; router.pageParams = { recipientId: 'member-1' }", app);
    assert.ok(app.renderFeedbackPage().includes(`href="${destination}"`));
    vm.runInContext("router.pageParams = { categoryId: 'best-speaker' }", app);
    assert.ok(app.renderVotingPage().includes(`href="${destination}"`));
    assert.ok(app.renderFeedbackConfirmationPage().includes(`href="${destination}"`));
    assert.ok(app.renderVoteConfirmationPage().includes(`href="${destination}"`));
  }
});

test('admin login and dashboard provide a participant link without replacing sign-out', () => {
  const app = appContext(true);
  assert.match(app.renderAdminLoginPage(), /href="#home"[^>]*>[^<]*participant view/i);
  const dashboard = app.renderAdminDashboard();
  assert.match(dashboard, /href="#home"[^>]*>Participant view/);
  assert.match(dashboard, /data-action="sign-out"/);
});
