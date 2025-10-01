// firebase.js


// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
const firebaseConfig = {
  apiKey: "AIzaSyA6KzPAIqHweWUXhmvcxlunwG7jdteigUY",
  authDomain: "udonate-f9d59.firebaseapp.com",
  databaseURL: "https://udonate-f9d59-default-rtdb.firebaseio.com",
  projectId: "udonate-f9d59",
  storageBucket: "udonate-f9d59.firebasestorage.app",
  messagingSenderId: "1070190810521",
  appId: "1:1070190810521:web:8808be36442b849e39af08"
};


const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); // This now points to Realtime Database