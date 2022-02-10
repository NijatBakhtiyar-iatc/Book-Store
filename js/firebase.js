import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";

import {
  getDatabase,
  set,
  ref,
  onValue,
  push
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-database.js";

// import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js/auth";

// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut,
// } from "firebase/auth";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  getAuth
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-auth.js";




// const firebaseConfig = {
//   apiKey: "AIzaSyBGu-1n5YB7rDMApzpLoD990eLnLUQpXCM",
//   authDomain: "admin-panel-c56c3.firebaseapp.com",
//   databaseURL: "https://admin-panel-c56c3-default-rtdb.firebaseio.com",
//   projectId: "admin-panel-c56c3",
//   storageBucket: "admin-panel-c56c3.appspot.com",
//   messagingSenderId: "440643220813",
//   appId: "1:440643220813:web:b456a2a01150e34ba97304"
// };

const firebaseConfig = {
  apiKey: "AIzaSyDbnuogRcsXXb89D3QvfJyB728QbpzR8u4",
  authDomain: "fir-9-project-6eb86.firebaseapp.com",
  projectId: "fir-9-project-6eb86",
  storageBucket: "fir-9-project-6eb86.appspot.com",
  messagingSenderId: "629719105017",
  appId: "1:629719105017:web:21c052c06d97be72c19128"
};



const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const auth = getAuth(app);

export { db, set, ref, onValue, push, createUserWithEmailAndPassword, onAuthStateChanged, auth };
