import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  type Auth,
  type User as FirebaseUser
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyByHm_Zwo9NGZ3DyHtZ5_wCtHlLXcat23Q",
  authDomain: "darkwave-auth.firebaseapp.com",
  projectId: "darkwave-auth",
  storageBucket: "darkwave-auth.firebasestorage.app",
  messagingSenderId: "41307406912",
  appId: "1:41307406912:web:40d118431b0ee5cd2a55a5",
  measurementId: "G-5N184XP48W"
};

let app: FirebaseApp;
let auth: Auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { 
  auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  type FirebaseUser
};
