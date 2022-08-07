import type { NextApiRequest, NextApiResponse } from 'next';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/util/firebase';
import { addDoc, collection } from 'firebase/firestore';

const addUserDetails = async (id, email, fullName) => {
  const docRef = await addDoc(collection(db, 'Users'), {
    _id: id,
    fullName: fullName,
    email: email
  });

  if (docRef) return true;
};
const createUser = async (body, res) => {
  const { email, password, id, fullName } = body;

  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const doc = addUserDetails(userCredential.user.uid, email, fullName);
      if (doc) {
        const data = {
          message: 'success'
        };

        res.status(200).send(data);
        return;
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('error', errorCode, errorMessage);
      const data = {
        message: errorCode
      };
      res.status(404).send(data);
      return;
      // ..
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method === 'POST') {
    createUser(req.body, res);

    return;
  } else {
    // Handle any other HTTP method
  }
}
