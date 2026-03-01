import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDI8LAnDWsqiMybdIBTIVqI5U6nOhgC7Tk",
    authDomain: "unlink-93d93.firebaseapp.com",
    projectId: "unlink-93d93",
    storageBucket: "unlink-93d93.firebasestorage.app",
    messagingSenderId: "852536999408",
    appId: "1:852536999408:web:3a16a4767ab2b57ebf7135",
    measurementId: "G-P0L9X2GY67"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);