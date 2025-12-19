import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0Qh58j2f6o5EMxc5wX3y0obNu2mKZ6Jw",
  authDomain: "indiancommunity-61fb9.firebaseapp.com",
  projectId: "indiancommunity-61fb9",
  storageBucket: "indiancommunity-61fb9.firebasestorage.app",
  messagingSenderId: "952444759681",
  appId: "1:952444759681:web:bb2972dfb1d4a81b62e780",
  measurementId: "G-LN770MP1WD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);