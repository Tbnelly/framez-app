import React, { createContext, useState, useEffect } from "react";
import { auth, isFirebaseInitialized } from "../../firebaseConfig";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);

  // Track auth state with error handling
  useEffect(() => {
    // Check if Firebase is properly initialized
    if (!auth || !isFirebaseInitialized()) {
      console.error("Firebase not initialized properly");
      setFirebaseError("Firebase initialization failed. Please check your configuration.");
      setInitializing(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (u) => {
          setUser(u);
          if (initializing) setInitializing(false);
        },
        (error) => {
          // Handle auth state change errors
          console.error("Auth state change error:", error);
          setFirebaseError(error.message);
          if (initializing) setInitializing(false);
        }
      );
      return unsubscribe;
    } catch (error) {
      console.error("Error setting up auth listener:", error);
      setFirebaseError(error.message);
      setInitializing(false);
    }
  }, []);

  // Sign up and auto-login with error handling
  const signUp = async ({ name, email, password }) => {
    if (!auth || !isFirebaseInitialized()) {
      throw new Error("Firebase is not initialized. Cannot sign up.");
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      setUser(cred.user); // ensure user is set
      return cred.user;
    } catch (err) {
      console.log("SignUp Error:", err);
      throw err;
    }
  };

  // Sign in existing user with error handling
  const signIn = async ({ email, password }) => {
    if (!auth || !isFirebaseInitialized()) {
      throw new Error("Firebase is not initialized. Cannot sign in.");
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      setUser(cred.user);
      return cred.user;
    } catch (err) {
      console.log("SignIn Error:", err);
      throw err;
    }
  };

  // Log out with error handling
  const logout = async () => {
    if (!auth || !isFirebaseInitialized()) {
      console.warn("Firebase not initialized, clearing user state only");
      setUser(null);
      return;
    }

    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.log("Logout Error:", err);
      // Still clear user state even if signOut fails
      setUser(null);
      throw err;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        initializing, 
        signUp, 
        signIn, 
        logout,
        firebaseError // expose error state for debugging
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};