import { auth } from '@/util/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method === 'POST') {
    const { email } = req.body;

    // Check any field is empty
    if (!email) res.status(400).send({ error: 'email or password is missing' });
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        res.status(200).send({ message: 'success' });
      })
      .catch((error) => {
        res.status(404).send({ err: error.message });
        // ..
      });
  }
}
