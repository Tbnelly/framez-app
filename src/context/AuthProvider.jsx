import React, { createContext, useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
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

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  // Sign up and auto-login
  const signUp = async ({ name, email, password }) => {
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

  // Sign in existing user
  const signIn = async ({ email, password }) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      setUser(cred.user);
      return cred.user;
    } catch (err) {
      console.log("SignIn Error:", err);
      throw err;
    }
  };

  // Log out
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, initializing, signUp, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
