const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadFirebaseBootstrap(firebase, logs = []) {
  const context = vm.createContext({
    firebase,
    window: { firebase },
    console: {
      info: (...args) => logs.push(['info', ...args]),
      error: (...args) => logs.push(['error', ...args]),
    },
  });

  const script = fs.readFileSync(path.join(__dirname, '../public/firebase.js'), 'utf8');
  vm.runInContext(script, context);
  return { context, script };
}

test('Firebase bootstrap initializes and exposes app, Auth, and Firestore', () => {
  const app = { name: 'default' };
  const auth = { service: 'auth' };
  const firestore = { service: 'firestore' };
  let initializedConfig;
  let initializeCount = 0;
  const firebase = {
    apps: [],
    initializeApp(config) {
      initializeCount += 1;
      initializedConfig = config;
      app.options = config;
      firebase.apps.push(app);
      return app;
    },
    auth: () => auth,
    firestore: () => firestore,
  };
  const { context, script } = loadFirebaseBootstrap(firebase);

  assert.equal(initializedConfig.projectId, 'tm-meeting-companion-dev');
  assert.equal(context.window.firebaseServices.app, app);
  assert.equal(context.window.firebaseServices.auth, auth);
  assert.equal(context.window.firebaseServices.firestore, firestore);
  assert.deepEqual(
    JSON.parse(JSON.stringify(context.window.firebaseServices.status)),
    { app: true, authentication: true, firestore: true }
  );

  vm.runInContext(script, context);
  assert.equal(initializeCount, 1);
});

test('Firebase bootstrap does not block the prototype when the SDK is unavailable', () => {
  const logs = [];
  const { context } = loadFirebaseBootstrap(undefined, logs);

  assert.equal(context.window.firebaseServices.status.app, false);
  assert.equal(logs.filter(([level]) => level === 'error').length, 1);
  assert.match(logs[0][1], /in-memory prototype remains available/);
});

test('Firebase bootstrap reuses the existing default app', () => {
  const app = { name: '[DEFAULT]', options: { projectId: 'tm-meeting-companion-dev' } };
  const firebase = {
    apps: [app],
    initializeApp() {
      assert.fail('Firebase should not initialize a second default app');
    },
    auth: () => ({ service: 'auth' }),
    firestore: () => ({ service: 'firestore' }),
  };
  const { context } = loadFirebaseBootstrap(firebase);

  assert.equal(context.window.firebaseServices.app, app);
  assert.equal(context.window.firebaseServices.status.app, true);
});
