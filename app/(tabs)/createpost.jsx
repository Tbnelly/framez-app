import React, { useState, useContext } from "react";
import { TextInput,  Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from "react-native";
import ImagePickerButton from "../../src/components/ImagePickerButton";
import { AuthContext } from "../../src/context/AuthProvider";
import { createPost } from "../../src/services/posts";

export default function CreatePost({ onPostCreated }) {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!text && !imageUri) {
      Alert.alert("Error", "Please add text or image to post");
      return;
    }

    try {
      setLoading(true);
      const newPost = await createPost({ user, text, imageUri });

      // Clear inputs
      setText("");
      setImageUri(null);

      // Optional: inform parent component to refresh feed
      if (onPostCreated) onPostCreated(newPost);

      Alert.alert("Success", "Your post has been published!");
    } catch (e) {
      console.warn("Create post error:", e);
      Alert.alert("Error", e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="What's happening?"
        style={styles.input}
        multiline
      />

      <ImagePickerButton onPick={setImageUri} />

      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}


      <TouchableOpacity
        onPress={handleCreate}
        disabled={loading || (!text && !imageUri)}
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
          {loading ? "Posting..." : "Post"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    minHeight: 80,
    textAlignVertical: "top",
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginVertical: 12,
  },
});
