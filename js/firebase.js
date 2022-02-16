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
  apiKey: "AIzaSyBGu-1n5YB7rDMApzpLoD990eLnLUQpXCM",
  authDomain: "admin-panel-c56c3.firebaseapp.com",
  databaseURL: "https://admin-panel-c56c3-default-rtdb.firebaseio.com",
  projectId: "admin-panel-c56c3",
  storageBucket: "admin-panel-c56c3.appspot.com",
  messagingSenderId: "440643220813",
  appId: "1:440643220813:web:b456a2a01150e34ba97304",
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

export { db, set, ref, onValue, push, remove };
