import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { slug } = req.query;

  const { db, client } = await connectToDatabase();

  if (client.isConnected()) {
    const requestType = req.method;

    switch (requestType) {
      case 'GET': {
        // const user = await db.collection('users').findOne({ _id: slug });
        const q = query(collection(db, 'Users'), where('_id', '==', slug));
        const data = {
          _id: '',
          email: '',
          fullName: ''
        };
        const querySnapshot = await getDocs(q);
        try {
          querySnapshot.forEach((doc) => {
            const docs = doc.data();
            const check = { ...docs };
            data._id = check._id;
            data.email = check.email;
            data.fullName = check.fullName;
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, ' => ', doc.data());
          });
          // console.log('fech user Test data new ');
          // console.log(data);
          res.send(data);
        } catch (error) {
          console.log(error);
          return error;
        }

        break;
      }

      case 'PATCH': {
        break;
      }

      case 'DELETE': {
        break;
      }

      default:
        res.send({ message: 'DB error' });
        break;
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 });
  }
}
