import React, { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../src/context/AuthProvider";
import { useRouter } from "expo-router";

type SignInFormData = {
  email: string;
  password: string;
};

const schema = Yup.object().shape({
  email: Yup.string().trim().email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function SignIn() {
  const { signIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    try {
      await signIn({ email: data.email.trim(), password: data.password });
      Toast.show({ type: "success", text1: "Signed in successfully!" });
      router.replace("/"); // go to main tabs
    } catch (e: any) {
      console.log("SignIn Error:", e);
      Toast.show({
        type: "error",
        text1: "Sign in failed",
        text2: e?.message || "Check your credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center", backgroundColor: "white" }}>
      <Text style={{ fontSize: 50, fontWeight: "bold", marginBottom: 20, color: "blue" }}>Login</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <>
            <Text style={{ fontFamily: "Arial", fontWeight: "bold", color: "blue" }}>Your Email</Text>
            <TextInput
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <>
            <Text style={{ fontFamily: "Arial", fontWeight: "bold", color: "blue" }}>Password</Text>
            <TextInput
              placeholder="Password"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              style={styles.input}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
          </>
        )}
      />

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#aaa" : "#007bff",
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: "center",
          opacity: loading ? 0.7 : 1,
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          {loading ? "Signing in..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <View style={{ marginBottom: 10, alignItems: "center" }}>
        <Text style={{ fontFamily: "Arial", fontWeight: "bold", color: "blue" }}>
          Don&apos;t have an account?
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/signUp")}
        style={{
          backgroundColor: "white",
          paddingVertical: 12,
          borderWidth: 3,
          borderColor: "blue",
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "blue", justifyContent: "center", fontSize: 16, fontWeight: "bold" }}>
          Create Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 3,
    padding: 12,
    marginBottom: 6,
    borderRadius: 8,
    width: "100%",
    borderColor: "blue",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    marginTop: 2,
  },
});