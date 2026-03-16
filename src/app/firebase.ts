import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyDpBT8h6k8esF-96FsIGtwZ5oSi4lOG5C0',
  authDomain: 'kakeibo-app-54921.firebaseapp.com',
  projectId: 'kakeibo-app-54921',
  storageBucket: 'kakeibo-app-54921.firebasestorage.app',
  messagingSenderId: '604104453174',
  appId: '1:604104453174:web:edfb5be76d16afa647fc97'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
