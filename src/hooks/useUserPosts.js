import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useIsFocused } from '@react-navigation/native';

export default function useUserPosts(uid) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused(); // 👈 detects when Profile tab is active

  useEffect(() => {
    if (!uid || !isFocused) return;

    const q = query(
      collection(db, 'posts'),
      where('authorId', '==', uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.text || '',
            imageUrl: data.imageUrl || null,
            authorId: data.authorId,
            authorName: data.authorName,
            authorAvatar: data.authorAvatar || null,
            createdAt: data.createdAt?.toDate?.() || new Date(),
          };
        });
        setPosts(list);
        setLoading(false);
      },
      (err) => {
        console.warn('Firestore snapshot error:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [uid, isFocused]); // 👈 depend on focus state

  return { posts, loading };
}
