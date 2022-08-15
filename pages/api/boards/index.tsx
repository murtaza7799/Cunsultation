import { db } from '@/util/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const requestType = req.method;
  // console.log(requestType);
  switch (requestType) {
    // case 'POST': {
    //   const { _id, name, dateCreated, createdBy, backgroundImage } = req.body;
    //   const data = {
    //     _id,
    //     name,
    //     dateCreated,
    //     createdBy,
    //     backgroundImage,
    //     users: []
    //   };
    //   const board = await db.collection('boards').insertOne(data);
    //   res.send(board);
    //   return;
    // }
    case 'GET': {
      // const { userid } = req.query;
      // const boards = query(collection(db, 'boards'), where('_id', '==', 'A6avhUe5G'));
      // // const inviteBoards = query(
      // //   collection(db, 'boards'),
      // //   where('users', 'array-contains', userid)
      // // );
      // const querySnapshotBoards = await getDocs(boards);
      // console.log('querySnapshotBoards');
      // console.log(querySnapshotBoards);
      // res.send(querySnapshotBoards);
      // const querySnapshotInviteBoards = await getDocs(inviteBoards);

      // const { userid } = req.query;
      // const boards = await db.collection('boards').find({ createdBy: userid }).limit(30).toArray();
      // const invitedBoards = await db.collection('boards').find({ users: userid }).toArray();
      // const updatedBoards = boards.concat(invitedBoards);
      // res.send(updatedBoards);
      return;
    }
    default:
      break;
  }
}
