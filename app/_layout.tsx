import { Slot, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { AuthProvider, AuthContext } from "../src/context/AuthProvider";
import { useContext, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
      <Toast />
    </AuthProvider>
  );
}

function AuthGate() {
  const { user, initializing, firebaseError } = useContext(AuthContext);
  const router = useRouter();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (initializing) return;

    if (!redirectedRef.current) {
      redirectedRef.current = true;
      
      // If there's a Firebase error, still allow navigation to sign in
      if (firebaseError) {
        console.warn("Firebase error detected, redirecting to sign in:", firebaseError);
        router.replace("/(auth)/signIn");
        return;
      }

      if (!user) {
        router.replace("/(auth)/signIn");
      } else {
        router.replace("/(tabs)"); // main app tabs
      }
    }
  }, [user, initializing, firebaseError, router]);

  if (initializing) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading…</Text>
      </View>
    );
  }

  // Show error state if Firebase failed to initialize
  if (firebaseError && !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>⚠️ Firebase Connection Error</Text>
        <Text style={styles.subText}>
          The app is having trouble connecting to Firebase.
        </Text>
        <Text style={styles.debugText}>{firebaseError}</Text>
      </View>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    fontFamily: "monospace",
  },
});