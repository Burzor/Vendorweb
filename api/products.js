import { db } from '../../lib/firebase-admin';

export default async (req, res) => {
  try {
    // Test if Firestore is accessible
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error) {
    console.error('Firestore error:', error);
    res.status(500).json({ 
      error: error.message,
      // Helpful for debugging – remove in production
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};