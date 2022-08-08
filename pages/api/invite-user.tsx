import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const requestType = req.method;

  // switch (requestType) {
  //   case 'PATCH': {
  //     const { email, boardId } = req.body;
  //     const user = await db.collection('users').findOne({ email });
  //     const boardData = await db.collection('boards').findOne({ _id: boardId });

  //     const isExistingUser = boardData.users.indexOf(user._id);

  //     if (isExistingUser > -1) {
  //       res.status(400).send({ message: 'User is already added to the board' });
  //     } else {
  //       const board = await db
  //         .collection('boards')
  //         .updateOne({ _id: boardId }, { $push: { users: user?._id } });

  //       if (board) {
  //         res.send({ status: 200, message: 'Invited' });
  //       } else {
  //         res.send({ status: 404, message: 'Some issues' });
  //       }
  //     }

  //     break;
  //   }

  //   default:
  //     res.send({ message: 'DB error' });
  //     break;
  // }
}
