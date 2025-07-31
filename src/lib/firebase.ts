import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpSfRN2QKnijZZeaEJD73w5x2FJdXV450",
  authDomain: "tracker-job-c8374.firebaseapp.com",
  projectId: "tracker-job-c8374",
  storageBucket: "tracker-job-c8374.firebasestorage.app",
  messagingSenderId: "160455990557",
  appId: "1:160455990557:web:327a9d7db67b96227455f4",
  measurementId: "G-NCDS33LE08"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;