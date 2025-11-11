import React, { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { AuthContext } from "../../src/context/AuthProvider";
import { useRouter } from "expo-router";

const schema = Yup.object().shape({
  name: Yup.string().trim().required("Full name is required"),
  email: Yup.string().trim().email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
});

export default function SignUpScreen() {
  const { signUp } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signUp({ name: data.name.trim(), email: data.email.trim(), password: data.password });
      Toast.show({ type: "success", text1: "Account created successfully!", });
      // Send user to sign-in so they can explicitly login (as requested)
      router.replace("/(auth)/signIn");
    } catch (error) {
      console.log("Sign-up error:", error);
      Toast.show({
        type: "error",
        text1: "Failed to sign up",
        text2: error?.message || "Try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", backgroundColor: "white", padding: 20 }}>
      <Text style={{ fontSize: 40, fontWeight: "bold", marginBottom: 20, color: "blue" }}>
        Sign Up
      </Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput placeholder="Full Name" value={value} onChangeText={onChange} style={styles.input} />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </>
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput placeholder="Email" value={value} onChangeText={onChange} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput placeholder="Password" value={value} onChangeText={onChange} style={styles.input} secureTextEntry />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
          </>
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput placeholder="Confirm Password" value={value} onChangeText={onChange} style={styles.input} secureTextEntry />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
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
          marginTop: 10,
          marginBottom: 20,
          opacity: loading ? 0.8 : 1,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          {loading ? "Registering..." : "REGISTER"}
        </Text>
      </TouchableOpacity>

      <View style={{ marginBottom: 10, alignItems: "center" }}>
        <Text style={{ fontFamily: "Arial", fontWeight: "bold", color: "blue" }}>
          Have an account?
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/signIn")}
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
          LOGIN
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
