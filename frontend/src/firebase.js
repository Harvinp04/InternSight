import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBj2op_rvgMPz29AX1F1Y0mUHa6D4gl1IQ",
  authDomain: "internsight.firebaseapp.com",
  projectId: "internsight",
  storageBucket: "internsight.firebasestorage.app",
  messagingSenderId: "818277357760",
  appId: "1:818277357760:web:b65371ef98715ac2d3b525",
  measurementId: "G-VCEFZWWR0R"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 