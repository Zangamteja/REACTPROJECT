import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBfXjmqLY7AkLmfvYQpxBUR7ZxLASpTwDQ",
  authDomain: "scaler-meet.firebaseapp.com",
  projectId: "scaler-meet",
  storageBucket: "scaler-meet.appspot.com",
  messagingSenderId: "550089298307",
  appId: "1:550089298307:web:e1f65c3a2ce7569ad326b6",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
