import React, { useContext } from "react";
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator, Image } from "react-native";
import { AuthContext } from "../../src/context/AuthProvider";
import useUserPosts from "../../src/hooks/useUserPosts";
import PostItem from "../../src/components/PostItem";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const { posts, loading } = useUserPosts(user?.uid); // FIX: destructure correctly
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/signIn");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      {/* Header */}
      <View style={styles.header}>
        {user?.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
              {user?.displayName?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
        )}
        <Text style={styles.name}>{user?.displayName || user?.email}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Button title="Logout" onPress={handleLogout} color="#d9534f" />
      </View>

      {/* Posts */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostItem post={item} />}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={() => (
            <Text style={{ padding: 16, textAlign: "center", color: "#666" }}>
              You haven’t posted anything yet
            </Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
    alignItems: "center",
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ccc",
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  email: { color: "#666", marginBottom: 8 },
});
