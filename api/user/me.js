import { db } from '../../../lib/firebase-admin';
import { verifyToken } from '../../../lib/verify-token';

export default async (req, res) => {
  try {
    const decoded = await verifyToken(req);
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    res.json({ name: userData.name || decoded.name, email: decoded.email });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};