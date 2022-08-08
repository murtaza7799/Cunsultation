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
  apiKey: 'AIzaSyDnR4jVplbcDuwkVW8mRptyRP42Z1vfxPA',
  authDomain: 'clientproject-6aeff.firebaseapp.com',
  projectId: 'clientproject-6aeff',
  storageBucket: 'clientproject-6aeff.appspot.com',
  messagingSenderId: '908410256076',
  appId: '1:908410256076:web:810ff56f02974656c36069',
  measurementId: 'G-7NXX8ELP86'
};
// if (initializeApp.apps.length === 0) {
//   initializeApp(firebaseConfig);
// }

// Initialize Firebase
// if (initializeApp.length === 0) {
//   initializeApp(firebaseConfig);
// }
initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
