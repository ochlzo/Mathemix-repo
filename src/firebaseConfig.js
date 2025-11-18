// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace this with your own config object from Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-2pa1BV9M6hnkVaurpun25dPB54xDq4A",
  authDomain: "mathemix-9c8ba.firebaseapp.com",
  projectId: "mathemix-9c8ba",
  storageBucket: "mathemix-9c8ba.firebasestorage.app",
  messagingSenderId: "935229093991",
  appId: "1:935229093991:web:39c640add883cbf3a43cc2",
  measurementId: "G-0RMLEHK80H"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you'll need
export const auth = getAuth(app);
export const db = getFirestore(app);