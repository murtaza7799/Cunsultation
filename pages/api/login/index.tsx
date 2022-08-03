import type { NextApiRequest, NextApiResponse } from 'next';

import { serialize } from 'cookie';

import { sign } from 'jsonwebtoken';
import * as auth from '../../../src/components/services/auth';

const KEY = process.env.JWT_SECRET_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Check any field is empty
    if (!email || !password) res.status(400).send({ error: 'email or password is missing' });

    await auth
      .signIn(email, password)
      .then((userCredential) => {
        const claim = { id: userCredential.user.uid, email: userCredential.user.email };
        const token = sign({ user: claim }, KEY, { expiresIn: '1h' });
        res.setHeader(
          'Set-Cookie',
          serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 60 * 60 * 24 * 1000,
            sameSite: 'strict',
            path: '/'
          })
        );
        res.send({ message: 'success', token, id: userCredential.user.uid, status: 200 });
      })
      .catch((err) => {
        console.log('login error', err);
        res.status(404).send({ error: 'Invalid username or password' });
      });
  }
}
