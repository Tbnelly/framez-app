import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';


export function useFeedPosts() {
const [posts, setPosts] = useState([]);
useEffect(() => {
const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
const unsub = onSnapshot(q, (snap) => {
const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
setPosts(list);
});
return () => unsub();
}, []);
return posts;
}