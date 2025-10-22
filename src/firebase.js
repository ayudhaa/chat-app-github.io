import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, off, remove } from 'firebase/database';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlKWmqmC4Rqt0gbTISjp0FQ0Rwdo5er1M",
  authDomain: "chat-app-ayudharachman.firebaseapp.com",
  databaseURL: "https://chat-app-ayudharachman-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-app-ayudharachman",
  storageBucket: "chat-app-ayudharachman.firebasestorage.app",
  messagingSenderId: "1025809995755",
  appId: "1:1025809995755:web:31a823477897202a88ebae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);