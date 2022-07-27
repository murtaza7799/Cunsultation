import cookie from 'cookie';
import { verify } from 'jsonwebtoken';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/util/firebase';
import { setOrGetStore } from '@/util/initialise-store';
import user, { updateUserData, fetchUser } from '@/src/slices/user';
import useEffect from 'react';
import useState from 'react';

const KEY = process.env.JWT_SECRET_KEY;

type UserValidProps = {
  isValid: boolean;
  id?: string;
};
async function useAuth() {
  console.log('Checking auth');
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('User is authenticated with id' + user.uid);
      return user;
    } else {
      return null;
    }
  });

  return null;
}

const isValidUser = (): UserValidProps => {
  console.log('Check User Validation');

  // Is code running on the server

  // console.log('Running on server');
  // const test = useAuth();
  // console.log('id: ', test);
  // if (test) {
  //   console.log('User is authenticated');
  //   return {
  //     // id: id,
  //     isValid: true
  //   };
  // } else {
  //   console.log('User is not authenticated');
  //   return {
  //     isValid: false
  //   };
  // const userAuth = useAuth();
  // if (userAuth !== null) {
  //   console.log('User is authenticated with ' + userAuth.uid + ' id');
  //   return {
  //     // id: userAuth.uid,
  //     isValid: true
  //   };
  // } else {
  //   return { isValid: false };
  //}

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log('User is authenticated with id' + user.uid);
      await fetchUser();
      return {
        id: user.uid,
        isValid: true
      };
    } else {
      console.log('User is not authenticated');
      return { isValid: false };
    }
  });
  return { isValid: false };

  // Check if cookie is present
  // if (ctx.req && ctx.req.headers && ctx.req.headers.cookie) {
  //   const cookies = cookie.parse(ctx.req.headers.cookie);
  //   const token = cookies.token;
  //   try {
  //     isAuthenticated = verify(token, KEY);
  //   } catch (e) {
  //     console.log('Invalid user');
  //   }
  //   // Use !isAuthenticated for error cases
  //   // If it is a valid token then let them in else redirect to the login page
  //   if (isAuthenticated?.user) {
  //     return { id: isAuthenticated?.user.id, isValid: true };
  //   } else {
  //     return { isValid: false };
  //   }
  // } else {
  //   return { isValid: false };
  // }
};

export default isValidUser;
