// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZ4U4Q2X3hUtmFO-4DyQ7CJdfS93tMcp8",
  authDomain: "spck-bf296.firebaseapp.com",
  projectId: "spck-bf296",
  storageBucket: "spck-bf296.firebasestorage.app",
  messagingSenderId: "438852280303",
  appId: "1:438852280303:web:31e4e145abaeb303bc601a",
  measurementId: "G-GR2TESTXB8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log(app.name);