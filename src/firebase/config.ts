import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDLPjvJ1auvfpJo06X6WDkLZqhCufSpdAA",
    authDomain: "build-your-wolfpack-pm-game.firebaseapp.com",
    projectId: "build-your-wolfpack-pm-game",
    storageBucket: "build-your-wolfpack-pm-game.firebasestorage.app",
    messagingSenderId: "300190286441",
    appId: "1:300190286441:web:d332367c765c40ef0cd8f8",
    measurementId: "G-713CFGPDVB",
    databaseURL: "https://build-your-wolfpack-pm-game.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export services for the app to use
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);

export { analytics };
export default app;
