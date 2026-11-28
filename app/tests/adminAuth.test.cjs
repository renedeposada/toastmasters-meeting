const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function createAuthHarness({ snapshot, readError, signInError, signOutError } = {}) {
  let authStateListener;
  let authErrorListener;
  let providerUsed;
  let popupCount = 0;
  let signOutCount = 0;
  const reads = [];
  const logs = [];
  const auth = {
    onAuthStateChanged(onStateChanged, onError) {
      authStateListener = onStateChanged;
      authErrorListener = onError;
    },
    async signInWithPopup(provider) {
      popupCount += 1;
      providerUsed = provider;
      if (signInError) throw signInError;
    },
    async signOut() {
      signOutCount += 1;
      if (signOutError) throw signOutError;
    },
  };
  const firestore = {
    doc(documentPath) {
      reads.push(documentPath);
      return {
        async get() {
          if (readError) throw readError;
          return snapshot;
        },
      };
    },
  };
  class GoogleAuthProvider {}
  const firebase = { auth: { GoogleAuthProvider } };
  const context = vm.createContext({
    window: {
      firebase,
      firebaseServices: {
        clubId: 'doral',
        status: { authentication: true, firestore: true },
        auth,
        firestore,
      },
    },
    console: {
      info: (...args) => logs.push(['info', ...args]),
      error: (...args) => logs.push(['error', ...args]),
    },
  });

  vm.runInContext(
    fs.readFileSync(path.join(__dirname, '../public/adminAuth.js'), 'utf8'),
    context
  );

  return {
    service: context.window.adminAuth,
    emitAuthState: (user) => authStateListener(user),
    emitAuthError: (error) => authErrorListener(error),
    get providerUsed() { return providerUsed; },
    GoogleAuthProvider,
    get popupCount() { return popupCount; },
    get signOutCount() { return signOutCount; },
    reads,
    logs,
  };
}

test('Google sign-in uses Firebase popup authentication and the Google provider', async () => {
  const harness = createAuthHarness();

  await harness.service.signInWithGoogle();

  assert.equal(harness.popupCount, 1);
  assert.ok(harness.providerUsed instanceof harness.GoogleAuthProvider);
});

test('authorization checks only the current UID and grants only active admin documents', async () => {
  const cases = [
    { name: 'missing document', snapshot: { exists: false }, expected: 'unauthorized' },
    {
      name: 'inactive document',
      snapshot: { exists: true, data: () => ({ active: false, role: 'admin' }) },
      expected: 'unauthorized',
    },
    {
      name: 'invalid role',
      snapshot: { exists: true, data: () => ({ active: true, role: 'member' }) },
      expected: 'unauthorized',
    },
    {
      name: 'active admin',
      snapshot: { exists: true, data: () => ({ active: true, role: 'admin' }) },
      expected: 'authorized',
    },
  ];

  for (const item of cases) {
    const harness = createAuthHarness({ snapshot: item.snapshot });
    await harness.emitAuthState({ uid: 'firebase-user-123' });
    assert.equal(harness.service.status, item.expected, item.name);
    assert.deepEqual(harness.reads, ['clubs/doral/admins/firebase-user-123']);
  }
});

test('authorization waits for the document read before granting access', async () => {
  let resolveRead;
  const harness = createAuthHarness({
    snapshot: null,
  });
  harness.service.firestore.doc = () => ({
    get: () => new Promise((resolve) => { resolveRead = resolve; }),
  });

  const checking = harness.emitAuthState({ uid: 'firebase-user-123' });
  assert.equal(harness.service.status, 'checking');
  resolveRead({ exists: true, data: () => ({ active: true, role: 'admin' }) });
  await checking;
  assert.equal(harness.service.status, 'authorized');
});

test('successful Google authentication proceeds to the Admin authorization check', async () => {
  let resolveRead;
  const harness = createAuthHarness();
  harness.service.firestore.doc = (documentPath) => {
    harness.reads.push(documentPath);
    return { get: () => new Promise((resolve) => { resolveRead = resolve; }) };
  };

  await harness.service.signInWithGoogle();
  const checking = harness.emitAuthState({ uid: 'firebase-user-123' });

  assert.equal(harness.service.status, 'checking');
  assert.deepEqual(harness.reads, ['clubs/doral/admins/firebase-user-123']);
  resolveRead({ exists: false });
  await checking;
  assert.equal(harness.service.status, 'unauthorized');
});

test('unreadable Admin document denies access without exposing the Firebase error', async () => {
  const harness = createAuthHarness({ readError: new Error('permission denied') });

  await harness.emitAuthState({ uid: 'firebase-user-123' });

  assert.equal(harness.service.status, 'authorization-error');
  assert.equal(harness.service.user.uid, 'firebase-user-123');
  assert.ok(harness.logs.some(([level]) => level === 'error'));
});

test('authentication restoration errors invalidate pending authorization checks', async () => {
  let resolveRead;
  const harness = createAuthHarness();
  harness.service.firestore.doc = () => ({
    get: () => new Promise((resolve) => { resolveRead = resolve; }),
  });
  const checking = harness.emitAuthState({ uid: 'firebase-user-123' });

  harness.emitAuthError(new Error('session restore failed'));
  resolveRead({ exists: true, data: () => ({ active: true, role: 'admin' }) });
  await checking;

  assert.equal(harness.service.status, 'unavailable');
  assert.equal(harness.service.user, null);
});

test('sign-out clears in-memory authorization state', async () => {
  const harness = createAuthHarness({
    snapshot: { exists: true, data: () => ({ active: true, role: 'admin' }) },
  });
  await harness.emitAuthState({ uid: 'firebase-user-123' });

  await harness.service.signOut();

  assert.equal(harness.signOutCount, 1);
  assert.equal(harness.service.status, 'signed-out');
  assert.equal(harness.service.user, null);
});

test('failed sign-out denies protected access and reports a safe error', async () => {
  const harness = createAuthHarness({ signOutError: new Error('internal auth detail') });
  await harness.emitAuthState({ uid: 'firebase-user-123' });

  await assert.rejects(harness.service.signOut(), { message: 'Sign-out failed. Please try again.' });

  assert.equal(harness.service.status, 'authorization-error');
  assert.equal(harness.service.signOutError, 'Sign-out failed. Please try again.');
});

test('Google sign-in errors are converted to short user-facing messages', async () => {
  const cases = [
    ['auth/popup-closed-by-user', 'Sign-in was canceled.'],
    ['auth/popup-blocked', 'The sign-in window was blocked. Allow pop-ups and try again.'],
    ['auth/network-request-failed', 'Unable to connect. Check your internet connection and try again.'],
    ['auth/unauthorized-domain', 'This website is not authorized for Google sign-in.'],
  ];

  for (const [code, message] of cases) {
    const harness = createAuthHarness({ signInError: { code } });
    await assert.rejects(harness.service.signInWithGoogle(), { message });
  }
});
