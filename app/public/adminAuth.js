class AdminAuthService {
  constructor(firebaseServices, firebaseSdk) {
    this.auth = firebaseServices?.status?.authentication ? firebaseServices.auth : null;
    this.firestore = firebaseServices?.status?.firestore ? firebaseServices.firestore : null;
    this.firebaseSdk = firebaseSdk;
    this.clubId = firebaseServices?.clubId;
    this.status = this.auth && this.firestore ? 'checking' : 'unavailable';
    this.user = null;
    this.signOutError = '';
    this.listeners = [];
    this.started = false;
    this.checkId = 0;
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener());
  }

  start() {
    if (this.started) return;
    this.started = true;
    if (!this.auth || !this.firestore
        || typeof this.auth.onAuthStateChanged !== 'function'
        || typeof this.firebaseSdk?.auth?.GoogleAuthProvider !== 'function') {
      this.status = 'unavailable';
      this.notify();
      return;
    }

    try {
      this.auth.onAuthStateChanged(
        (user) => this.updateForUser(user),
        (error) => {
          this.checkId += 1;
          this.status = 'unavailable';
          this.user = null;
          console.error('[Admin auth] Could not restore the Firebase session.', error);
          this.notify();
        }
      );
    } catch (error) {
      this.checkId += 1;
      this.status = 'unavailable';
      this.user = null;
      console.error('[Admin auth] Could not listen for Firebase session changes.', error);
      this.notify();
    }
  }

  async updateForUser(user) {
    const checkId = ++this.checkId;
    this.user = user || null;
    this.signOutError = '';

    if (!user) {
      this.status = 'signed-out';
      this.notify();
      return;
    }

    this.status = 'checking';
    this.notify();

    try {
      const path = `clubs/${this.clubId}/admins/${user.uid}`;
      const snapshot = await this.firestore.doc(path).get();
      if (checkId !== this.checkId || this.user?.uid !== user.uid) return;

      const admin = snapshot.exists ? snapshot.data() : null;
      this.status = admin?.active === true && admin?.role === 'admin'
        ? 'authorized'
        : 'unauthorized';
    } catch (error) {
      if (checkId !== this.checkId || this.user?.uid !== user.uid) return;
      this.status = 'authorization-error';
      console.error('[Admin auth] Could not verify club Admin access.', error);
    }

    this.notify();
  }

  async signInWithGoogle() {
    if (!this.auth || typeof this.auth.signInWithPopup !== 'function'
        || typeof this.firebaseSdk?.auth?.GoogleAuthProvider !== 'function') {
      throw new Error('Google sign-in is temporarily unavailable.');
    }

    try {
      const provider = new this.firebaseSdk.auth.GoogleAuthProvider();
      await this.auth.signInWithPopup(provider);
    } catch (error) {
      console.error('[Admin auth] Google sign-in failed.', error);
      const messages = {
        'auth/popup-closed-by-user': 'Sign-in was canceled.',
        'auth/cancelled-popup-request': 'Sign-in was canceled.',
        'auth/popup-blocked': 'The sign-in window was blocked. Allow pop-ups and try again.',
        'auth/network-request-failed': 'Unable to connect. Check your internet connection and try again.',
        'auth/unauthorized-domain': 'This website is not authorized for Google sign-in.',
      };
      throw new Error(messages[error.code] || 'Google sign-in is temporarily unavailable.');
    }
  }

  async signOut() {
    if (!this.auth || typeof this.auth.signOut !== 'function') {
      throw new Error('Sign-out is temporarily unavailable.');
    }

    const previousUser = this.user;
    this.checkId += 1;
    this.status = 'checking';
    this.signOutError = '';
    this.notify();

    try {
      await this.auth.signOut();
      this.user = null;
      this.status = 'signed-out';
      this.notify();
    } catch (error) {
      console.error('[Admin auth] Firebase sign-out failed.', error);
      this.user = previousUser;
      this.status = 'authorization-error';
      this.signOutError = 'Sign-out failed. Please try again.';
      this.notify();
      throw new Error(this.signOutError);
    }
  }
}

const adminAuth = new AdminAuthService(window.firebaseServices, window.firebase);
window.adminAuth = adminAuth;
adminAuth.start();
