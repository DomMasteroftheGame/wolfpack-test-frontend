# Firebase Client Setup Guide

## ⚠️ SECURITY WARNING
**NEVER** use the `firebase-adminsdk` service account keys in this frontend project. Those keys grant full administrative access and must only be used in your secure Node.js backend.

## Required Environment Variables
Create a `.env` file in the root directory (do not commit it to Git) with the following keys from your Firebase Console -> Project Settings -> General -> Your Apps -> SDK Setup and Configuration (Config):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend API URL (Node.js + MongoDB)
VITE_API_URL=https://your-backend-api.com/api
```

## Deployment to Shopify
1. Run `pnpm build`.
2. Upload the contents of `dist/assets` to your Shopify theme's `assets/` folder.
3. Ensure your Liquid template loads the main JS and CSS files.
