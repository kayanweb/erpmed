export const auth = {};
export const signInWithEmailAndPassword = async (...args: any[]) => ({ user: { id: 'test', email: 'admin@hospital.com' } });
export const signInWithPhoneNumber = async (...args: any[]) => {};
export const RecaptchaVerifier = class {};
export const signOut = async () => {};
export const onAuthStateChanged = (auth: any, cb: any) => { cb(null); return () => {}; };
export const sendPasswordResetEmail = async (...args: any[]) => {};
export const GoogleAuthProvider = class {};
export const signInWithPopup = async (...args: any[]) => ({ user: { id: 'test', email: 'admin@hospital.com' } });
