import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";

// import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js/auth";

import {
  getDatabase,
  set,
  ref,
  onValue,
  push,
  remove,
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNdhpT6NZBuApH9Lm5m8uhjYp74fX1Tic",
  authDomain: "book-store-c95c7.firebaseapp.com",
  projectId: "book-store-c95c7",
  storageBucket: "book-store-c95c7.appspot.com",
  messagingSenderId: "1003711320941",
  appId: "1:1003711320941:web:7cac771de2698474dd4064",
  measurementId: "G-DPRXNT0TED"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

export { db, set, ref, onValue, push, remove };
