import { Slot, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { AuthProvider, AuthContext } from "../src/context/AuthProvider";
import { useContext, useEffect, useRef } from "react";
import { View, Text } from "react-native";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
      <Toast />
    </AuthProvider>
  );
}

function AuthGate() {
  const { user, initializing } = useContext(AuthContext);
  const router = useRouter();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (initializing) return;

    if (!redirectedRef.current) {
      redirectedRef.current = true;
      if (!user) {
        router.replace("/(auth)/signIn");
      } else {
        router.replace("/(tabs)"); // main app tabs
      }
    }
  }, [user, initializing, router]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading…</Text>
      </View>
    );
  }

  return <Slot />;
}
