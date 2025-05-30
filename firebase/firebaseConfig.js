import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
apiKey: "AIzaSyA_LVJU09-kaAI2YYuMRy7IRXUhm-h5cRI",
authDomain: "userrandom-78630.firebaseapp.com",
projectId: "userrandom-78630",
storageBucket: "userrandom-78630.firebasestorage.app",
messagingSenderId: "524999153910",
appId: "1:524999153910:web:ec17e5fd4a8cd4228e34d7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 

export { auth, db };
