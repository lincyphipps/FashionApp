import { initializeApp } from "firebase/app";
import { getAuth, signInWithCredential, OAuthProvider, UserCredential, User } from "firebase/auth";  // Import User type here
import * as AppleAuthentication from 'expo-apple-authentication';
import { useState } from "react";

// Firebase configuration for your app
const firebaseConfig = {
  apiKey: "AIzaSyB7SoLfIhgmDCn3XLkq9fQQqX_oFlAOEu0",
  authDomain: "fashionapp-b2111.firebaseapp.com",
  projectId: "fashionapp-b2111",
  storageBucket: "fashionapp-b2111.appspot.com",
  messagingSenderId: "956692125681",
  appId: "1:956692125681:web:f74dbda5478e91228fd650",
  measurementId: "G-ZSQZHNLK34"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Custom Hook for Apple Authentication
const useAppleAuth = () => {
  const [user, setUser] = useState<User | null>(null);  // Corrected to use User from firebase/auth
  const [error, setError] = useState<any>(null);

  const signInWithApple = async () => {
    try {
      // Trigger the Apple Authentication flow
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Check if the identityToken exists
      if (!credential.identityToken) {
        throw new Error("Apple authentication failed - no identity token found");
      }

      // Create an OAuthProvider credential with the identityToken
      const appleCredential = new OAuthProvider('apple.com').credential({
        idToken: credential.identityToken,  // Pass identityToken from Apple
      });

      // Sign in to Firebase with the created Apple credential
      const userCredential: UserCredential = await signInWithCredential(auth, appleCredential);
      
      // Log and set the user data
      console.log(userCredential);  // Check the full structure of userCredential
      setUser(userCredential.user);  // Set user data in state

    } catch (error) {
      // Catch and display any errors during the sign-in process
      setError(error);
      console.error("❌ Error signing in with Apple:", error);
    }
  };

  return { user, error, signInWithApple };
};

// Export for use in components
export { auth, useAppleAuth };
