import { db } from '../../../lib/firebase-admin';
import { verifyToken } from '../../../lib/verify-token';

export default async (req, res) => {
  try {
    const decoded = await verifyToken(req);
    const snapshot = await db.collection('purchases')
      .where('userId', '==', decoded.uid)
      .orderBy('purchasedAt', 'desc')
      .get();
    const purchases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(purchases);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};