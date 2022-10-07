// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCL3a4pqYF0b4SI7v3oSwTcxvWLkw-O7Z4',
  authDomain: 'rooks-360015.firebaseapp.com',
  projectId: 'rooks-360015',
  storageBucket: 'rooks-360015.appspot.com',
  messagingSenderId: '550849078903',
  appId: '1:550849078903:web:498020646e1a82fb2a4872',
  measurementId: 'G-X7WKD94QR8'
};

initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
