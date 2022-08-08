import { auth } from '@/util/firebase';
import { signOut } from 'firebase/auth';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';

const provider = new GoogleAuthProvider();

export const signIn = (email, pass) => {
  return signInWithEmailAndPassword(auth, email, pass);
};

export const signUp = (email, pass) => {
  return createUserWithEmailAndPassword(auth, email, pass);
};

export const googleAuth = () => {
  return signInWithPopup(auth, provider);
};

export const logout = () => {
  signOut(auth)
    .then(() => {
      console.log('logged out');
    })
    .catch(() => {
      console.log('logout error');
    });
};
