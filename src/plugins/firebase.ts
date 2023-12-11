// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4y_18uLHqLms5JJCy2fV7zIAPn3d5gYY",
  authDomain: "react-wedding-7e506.firebaseapp.com",
  projectId: "react-wedding-7e506",
  storageBucket: "react-wedding-7e506.appspot.com",
  messagingSenderId: "333968609876",
  appId: "1:333968609876:web:f66e923967e38dd57393c1",
  measurementId: "G-PCJKJL4KCH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
// const analytics = getAnalytics(app);
export default app