import type { NextApiRequest, NextApiResponse } from 'next';
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/util/firebase';

const checkUser = async (email: string) => {
  const getId = {
    id: null
  };
  const user = await query(collection(db, 'Users'), where('email', '==', email));
  const querySnapshot = await getDocs(user);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // console.log(doc.id, ' => ', data);
    if (data.email === email) {
      getId.id = data._id;
      // console.log(data._id);
    }
  });
  return getId.id;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { email, boardId } = req.body;
  const getId = {
    id: null
  };
  const user = await checkUser(email);
  if (user === null) {
    res.send({ status: 400, message: "User doesn't exist" });
  } else {
    try {
      const q = query(collection(db, 'boards'), where('_id', '==', boardId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // console.log(doc.id, ' => ', data);
        if (data._id === boardId) {
          getId.id = doc.id;
          // console.log(getId.id);
        }
      });
      if (getId.id !== null) {
        await updateDoc(doc(db, 'boards', getId.id), {
          users: arrayUnion(user)
        });
        res.send({ status: 200, message: 'Successfully Invited' });
        // return docRef;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // await sendMail();
  // const { db, client } = await connectToDatabase();
  // if (client.isConnected()) {
  //   const requestType = req.method;
  //   switch (requestType) {
  //     case 'POST': {
  //       const { email, boardId } = req.body;
  //       const token = uniqid();
  //       const id = shortId.generate();
  //       const emailData = {
  //         id,
  //         token,
  //         boardId
  //       };
  //       await db
  //         .collection('token')
  //         .insertOne({ token, userId: id, status: 'valid', email, boardId });
  //       const user = await db.collection('users').findOne({ email });
  //       await sendMail(email, res, emailData, user);
  //       res.status(200);
  //       return;
  //     }
  //     default:
  //       res.send({ message: 'DB error' });
  //       break;
  //   }
  // } else {
  //   res.send({ msg: 'DB connection error', status: 400 });
  // }
}
