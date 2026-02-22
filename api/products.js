import admin from 'firebase-admin';

// Initialize Firebase Admin (with error handling)
let db;
try {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
  db = admin.firestore();
} catch (error) {
  console.error('Firebase init error:', error);
  // We'll handle this in the API route
}

export default async (req, res) => {
  try {
    if (!db) {
      throw new Error('Firestore not initialized. Check FIREBASE_SERVICE_ACCOUNT environment variable.');
    }
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: error.message,
      // Include the environment variable status (without exposing the whole key)
      env: process.env.FIREBASE_SERVICE_ACCOUNT ? 'FIREBASE_SERVICE_ACCOUNT is set' : 'FIREBASE_SERVICE_ACCOUNT is MISSING'
    });
  }
};