import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/util/firebase';
const KEY = process.env.JWT_SECRET_KEY;

type UserValidProps = {
  isValid: boolean;
  id?: string;
};
function isValidUser(): UserValidProps {
  if (typeof window !== 'undefined') {
    const isUser = localStorage.getItem('isUser');
    const id = localStorage.getItem('id');
    if (isUser === 'true' && id) {
      return {
        isValid: true,
        id
      };
    } else {
      return {
        isValid: false
      };
    }
  }
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/firebase.User
  //     const uid = user.uid;
  //     return {
  //       isValid: true,
  //       id: uid
  //     };
  //     // ...
  //   } else {
  //     // User is signed out
  //     // ...
  //   }
  // });
  // return {
  //   isValid: false
  // };
  // const user = isUserAuth();
  // if (user) {
  //   console.log('User is authenticated with id ' + user['uid']);
  //   return {
  //     isValid: true,
  //     id: user['uid']
  //   };
  // } else {
  //   return {
  //     isValid: false
  //   };
  // }
}
export default isValidUser;
