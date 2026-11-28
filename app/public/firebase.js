(function initializeFirebase() {
  const firebaseConfig = {
    apiKey: 'AIzaSyCtMjQxeNHSOyb5ChZgjPenqe8Hty85f2o',
    authDomain: 'tm-meeting-companion-dev.firebaseapp.com',
    projectId: 'tm-meeting-companion-dev',
    storageBucket: 'tm-meeting-companion-dev.firebasestorage.app',
    messagingSenderId: '308004092657',
    appId: '1:308004092657:web:102914c44e4f5086428750',
  };
  const services = window.firebaseServices || {
    projectId: firebaseConfig.projectId,
    clubId: 'doral',
    app: null,
    auth: null,
    firestore: null,
    status: {
      app: false,
      authentication: false,
      firestore: false,
    },
  };

  window.firebaseServices = services;
  services.clubId = services.clubId || 'doral';

  if (services.status.app && services.status.authentication && services.status.firestore) {
    console.info(`[Firebase] Services are already initialized for ${services.projectId}.`);
    return;
  }

  const logFailure = (service, error) => {
    console.error(
      `[Firebase] Could not initialize ${service}. The in-memory prototype remains available.`,
      error
    );
  };

  const firebaseSdk = window.firebase;
  if (!firebaseSdk || typeof firebaseSdk.initializeApp !== 'function') {
    logFailure('the SDK', new Error('Firebase SDK scripts did not load.'));
    return;
  }

  try {
    const defaultApp = firebaseSdk.apps.find((app) => app.name === '[DEFAULT]');
    services.app = defaultApp || firebaseSdk.initializeApp(firebaseConfig);
    if (services.app.options.projectId !== firebaseConfig.projectId) {
      throw new Error(`The default app is connected to ${services.app.options.projectId}.`);
    }
    services.projectId = services.app.options.projectId;
    services.status.app = true;
    console.info(`[Firebase] App initialized for project ${services.projectId}.`);
  } catch (error) {
    logFailure('the App', error);
    return;
  }

  try {
    services.auth = firebaseSdk.auth(services.app);
    services.status.authentication = true;
    console.info('[Firebase] Authentication initialized.');
  } catch (error) {
    logFailure('Authentication', error);
  }

  try {
    services.firestore = firebaseSdk.firestore(services.app);
    services.status.firestore = true;
    console.info('[Firebase] Cloud Firestore initialized; no documents were read or written.');
  } catch (error) {
    logFailure('Cloud Firestore', error);
  }
})();
