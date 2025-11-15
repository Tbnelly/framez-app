// src/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// Get config from Expo Constants (loaded from app.json during build)
const getConfigValue = (key) => {
  const value = Constants.expoConfig?.extra?.[key];
  if (!value) {
    console.error(`Missing Firebase config: ${key}`);
  }
  return value || "";
};

const firebaseConfig = {
  apiKey: getConfigValue(
    "EXPO_PUBLIC_FIREBASE_API_KEY",
    "AIzaSyCQbV-Ju3s6b6QNhnoTHo8uo0Reh8zQq9M"
  ),
  authDomain: getConfigValue(
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "framez-7bee6.firebaseapp.com"
  ),
  projectId: getConfigValue(
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
    "framez-7bee6"
  ),
  storageBucket: getConfigValue(
    "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "framez-7bee6.appspot.com"
  ),
  messagingSenderId: getConfigValue(
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "71506393699"
  ),
  appId: getConfigValue(
    "EXPO_PUBLIC_FIREBASE_APP_ID",
    "1:71506393699:web:e34a133b8aac82ce9c5656"
  ),
};

// Validate that we have required config values
const validateConfig = (config) => {
  const requiredFields = ["apiKey", "authDomain", "projectId", "appId"];
  const missingFields = requiredFields.filter(
    (field) => !config[field] || config[field] === ""
  );

  if (missingFields.length > 0) {
    console.error(
      "Missing Firebase configuration fields:",
      missingFields.join(", ")
    );
    return false;
  }
  return true;
};

let app = null;
let auth = null;
let db = null;
let storage = null;

try {
  if (!validateConfig(firebaseConfig)) {
    throw new Error("Invalid Firebase configuration");
  }

  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (authError) {
    console.warn("Auth initialization warning:", authError.message);
    const { getAuth } = require("firebase/auth");
    auth = getAuth(app);
  }

  try {
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
      useFetchStreams: false,
    });
  } catch (firestoreError) {
    console.warn("Firestore initialization warning:", firestoreError.message);
    const { getFirestore } = require("firebase/firestore");
    db = getFirestore(app);
  }

  storage = getStorage(app);

  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
  
  // Create mock objects to prevent app crashes
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {};
    },
  };

  db = null;
  storage = null;
}

export { auth, db, storage, app };

export const isFirebaseInitialized = () => {
  return app !== null && auth !== null;
};