import { View, Text, Image, StyleSheet } from "react-native";

export default function PostItem({ post }) {
  return (
    <View style={styles.card}>
      {/* Author info */}
      <View style={styles.header}>
        {post.authorAvatar ? (
          <Image source={{ uri: post.authorAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {post.authorName?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
        )}
        <Text style={styles.author}>{post.authorName}</Text>
      </View>

      {/* Post content */}
      {post.text ? <Text style={styles.text}>{post.text}</Text> : null}
      {post.imageUrl ? (
        <Image source={{ uri: post.imageUrl }} style={styles.image} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: { color: "#fff", fontWeight: "bold" },
  author: { fontWeight: "600", fontSize: 16 },
  text: { fontSize: 15, marginBottom: 8, color: "#333" },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 6,
  },
});
