import { db } from '../../../lib/firebase-admin';
import { verifyToken } from '../../../lib/verify-token';

export default async (req, res) => {
  const { id } = req.query;
  if (req.method === 'PUT') {
    try {
      const decoded = await verifyToken(req);
      if (!decoded.admin) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      const updates = req.body; // expects JSON with fields
      updates.updatedAt = new Date().toISOString();
      await db.collection('products').doc(id).update(updates);
      const updated = await db.collection('products').doc(id).get();
      res.json({ id: updated.id, ...updated.data() });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const decoded = await verifyToken(req);
      if (!decoded.admin) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      await db.collection('products').doc(id).delete();
      res.json({ success: true });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};