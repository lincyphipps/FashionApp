// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7SoLfIhgmDCn3XLkq9fQQqX_oFlAOEu0",
  authDomain: "fashionapp-b2111.firebaseapp.com",
  projectId: "fashionapp-b2111",
  storageBucket: "fashionapp-b2111.firebasestorage.app",
  messagingSenderId: "956692125681",
  appId: "1:956692125681:web:f74dbda5478e91228fd650",
  measurementId: "G-ZSQZHNLK34"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in:", result.user);
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

export { auth, signInWithGoogle };