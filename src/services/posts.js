// src/services/posts.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Constants from 'expo-constants';

// Helper to get config with fallback (same pattern as firebaseConfig.js)
const getConfigValue = (key, fallback) => {
  return Constants.expoConfig?.extra?.[key] || fallback || "";
};

const UPLOAD_PRESET = getConfigValue(
  "EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
  "Framez"
);

const CLOUDINARY_URL = getConfigValue(
  "EXPO_PUBLIC_CLOUDINARY_API_URL",
  "https://api.cloudinary.com/v1_1/djsirsymb/image/upload"
);

async function uploadImageToCloudinary(uri) {
  if (!UPLOAD_PRESET || !CLOUDINARY_URL) {
    throw new Error('Cloudinary is not configured properly');
  }

  const formData = new FormData();
  formData.append('file', {
    uri,
    type: 'image/jpeg',
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