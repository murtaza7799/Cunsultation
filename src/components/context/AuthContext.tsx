import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from '@/util/firebase';
import { setOrGetStore } from '@/util/initialise-store';
import { fetchUser, updateUserData } from '@/src/slices/user';

const AuthContext = createContext<any>({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  console.log('AuthContextProvider', user);
  const reduxStore = setOrGetStore();
  const { dispatch } = reduxStore;
  // if (user !== null) {
  //   console.log('User is not null');
  //   dispatch(updateUserData({ type: 'isValid', value: true }));
  //   dispatch(updateUserData({ type: 'id', value: user['uid'] }));
  //   dispatch(fetchUser());
  // } else {
  //   dispatch(updateUserData({ type: 'isValid', value: false }));
  //   dispatch(fetchUser());
  // }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        });
        console.log('redux updated', reduxStore.getState().user.isValid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
