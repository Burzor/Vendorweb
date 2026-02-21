import { db } from '../../../lib/firebase-admin';
import { verifyToken } from '../../../lib/verify-token';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const decoded = await verifyToken(req);
    const { name } = req.body;
    await db.collection('users').doc(decoded.uid).set({
      name,
      email: decoded.email,
      status: 'active',
      createdAt: new Date().toISOString()
    });
    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};