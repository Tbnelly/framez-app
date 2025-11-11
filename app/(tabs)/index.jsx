import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useFeedPosts } from "../../src/hooks/useFeedPost";
import PostItem from "../../src/components/PostItem";

export default function FeedScreen() {
  const posts = useFeedPosts();
  const loading = !posts.length;

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9", paddingVertical: 16 }}>
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
              No posts yet. Be the first to post!
            </Text>
          )}
        />
      )}
    </View>
  );
}
