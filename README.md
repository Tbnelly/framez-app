# Framez - Personalized Social Feed App

Framez is a social media-style mobile app built with **React Native** and **Expo**, integrated with **Firebase** for authentication, storage, and real-time database features. Users can create posts with text and images, view a feed, and manage their profile.

---

## **Table of Contents**

1. [Features](#features)  
2. [Technology Stack](#technology-stack)  
3. [Setup Instructions](#setup-instructions)  
4. [Environment Variables](#environment-variables)  
5. [Project Structure](#project-structure)  
6. [Usage](#usage)  
7. [Screenshots](#screenshots)  
8. [Hosting](#hosting)  

---

## **Features**

- User Authentication: Sign in and sign out using Firebase Auth  
- Profile Management: Display name, email, and profile picture  
- Create Post: Users can add posts with text and optional image  
- Feed: Real-time updates of all posts  
- User Posts: Profile screen displays all posts created by the logged-in user  
- Cloud Image Upload: Images are uploaded to Cloudinary  
- Responsive & Consistent UI: Posts and profile components share a uniform design  

---

## **Technology Stack**

- **Frontend:** React Native, Expo, React Navigation, Expo Router  
- **Backend:** Firebase (Auth, Firestore, Storage)  
- **Image Hosting:** Cloudinary  
- **State Management:** React Context (AuthProvider)  
- **Styling:** React Native Stylesheet  

---

## **Setup Instructions**

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd framez
2. Install dependencies:

   npm install
   # or
   yarn install


3. Create a .env file in the project root with the following keys:

   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   EXPO_PUBLIC_CLOUDINARY_API_URL=your_cloudinary_url
   EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset


4. Run the app:

   npx expo start


   Scan the QR code using Expo Go on your device, or run on an emulator.

   Environment Variables

   EXPO_PUBLIC_FIREBASE_* → Firebase project configuration

   EXPO_PUBLIC_CLOUDINARY_API_URL → Cloudinary API endpoint

   EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET → Cloudinary upload preset for anonymous uploads

   Note: Prefixing with EXPO_PUBLIC_ makes variables available on the frontend in Expo.

5. Project Structure
   src/
   ├─ components/        # Reusable UI components (PostItem, ImagePickerButton)
   ├─ context/           # AuthProvider for user authentication
   ├─ hooks/             # Custom hooks (useUserPosts, useFeedPosts)
   ├─ services/          # Firebase/Cloudinary services (posts.js)
   ├─ screens/           # App screens (Profile, Feed, CreatePost)
   └─ firebaseConfig.js  # Firebase initialization
   app/
   └─ (tabs)/            # Expo Router tab navigation screens
   .env                   # Environment variables

5. Usage

   Sign in or create an account (Firebase Auth).

   View the Feed tab to see all posts.

   Go to Profile tab to see your posts and profile info.

   Create a new post by navigating to Create Post screen.

   Log out using the Logout button in the Profile tab.
   
6. ScreenShot