import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain:import.meta.env.VITE_AUTHDOM,
  projectId: import.meta.env.VITE_PROJ_ID,
  storageBucket: import.meta.env.VITE_STOR_BUCK,
  messagingSenderId: import.meta.env.VITE_MESSAGE_ID,
  appId: import.meta.env.VITE_APP_ID
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const store = firebase.storage();
const db = firebase.firestore();

export { auth, store, db };