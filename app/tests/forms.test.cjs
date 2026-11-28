const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function element(properties = {}) {
  const listeners = {};
  return {
    ...properties,
    addEventListener(type, handler) { listeners[type] = handler; },
    dispatch(type) { return listeners[type]({ preventDefault() {} }); },
  };
}

function loadPage(file, elements, extra = {}) {
  const context = vm.createContext({
    document: {
      getElementById: (id) => elements[id] || null,
      querySelector: (selector) => {
        const action = selector.match(/data-action="([^"]+)"/)?.[1];
        return Object.values(elements).find((item) => item.dataset?.action === action) || null;
      },
    },
    window: { location: { hash: '' } },
    ...extra,
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../public/pages', file), 'utf8'), context);
  return context;
}

test('feedback form attaches handlers, records named feedback, and navigates', () => {
  const elements = {
    feedbackForm: element(),
    includeName: element({ checked: true }),
    nameField: element({ style: {} }),
    senderName: element({ value: 'Guest', required: false }),
    wellWorked: element({ value: 'Clear' }),
    improve: element({ value: 'Slower' }),
  };
  let submitted;
  const context = loadPage('feedbackPage.js', elements, {
    state: { meeting: { status: 'active' }, submitFeedback: (...args) => { submitted = args; } },
    router: { pageParams: { recipientId: 'member-1' } },
  });
  context.attachFeedbackEvents();
  elements.includeName.dispatch('change');
  assert.equal(elements.nameField.style.display, 'block');
  assert.equal(elements.senderName.required, true);
  elements.feedbackForm.dispatch('submit');
  assert.deepEqual(submitted, ['member-1', 'Clear', 'Slower', 'Guest']);
  assert.equal(context.window.location.hash, 'feedback-confirmation');
});

test('voting form enables submission and records the selected candidate', () => {
  const selected = { value: 'member-1' };
  const elements = {
    votingForm: element({ querySelector: () => selected }),
    submitBtn: element({ disabled: true }),
  };
  let submitted;
  const context = loadPage('votingPage.js', elements, {
    state: { meeting: { status: 'active' }, submitVote: (...args) => { submitted = args; } },
    router: { pageParams: { categoryId: 'best-speaker' } },
  });
  context.attachVotingEvents();
  elements.votingForm.dispatch('change');
  assert.equal(elements.submitBtn.disabled, false);
  elements.votingForm.dispatch('submit');
  assert.deepEqual(submitted, ['best-speaker', 'member-1']);
  assert.equal(context.window.location.hash, 'vote-confirmation');
});

test('Google sign-in button invokes Firebase authentication', async () => {
  const googleButton = element({ dataset: { action: 'google-sign-in' }, disabled: false });
  const elements = { googleButton, adminAuthMessage: element({ textContent: '' }) };
  let signInCalled = false;
  const context = loadPage('adminLoginPage.js', elements, {
    adminAuth: { signInWithGoogle: async () => { signInCalled = true; } },
  });
  context.attachAdminLoginEvents();
  await googleButton.dispatch('click');
  assert.equal(signInCalled, true);
  assert.equal(googleButton.disabled, true);
});
