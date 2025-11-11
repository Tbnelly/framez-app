// src/services/posts.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

// Cloudinary info

const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_URL = process.env.EXPO_PUBLIC_CLOUDINARY_API_URL;


async function uploadImageToCloudinary(uri) {
  const formData = new FormData();
  formData.append('file', {
    uri,
    type: 'image/jpeg', // you can adjust based on actual type
    name: `${Date.now()}.jpg`,
  });
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Cloudinary upload failed');
  return data.secure_url;
}

export async function createPost({ user, text, imageUri }) {
  let imageUrl = null;
  if (imageUri) {
    imageUrl = await uploadImageToCloudinary(imageUri);
  }

  const postsRef = collection(db, 'posts');
  const docRef = await addDoc(postsRef, {
    authorId: user.uid,
    authorName: user.displayName || user.email,
    authorAvatar: user.photoURL || null,
    text: text || '',
    imageUrl,
    createdAt: serverTimestamp(),
  });

  return { id: docRef.id, authorId: user.uid, authorName: user.displayName, text, imageUrl };
}
