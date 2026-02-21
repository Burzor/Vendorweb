import { db } from '../../lib/firebase-admin';
import crypto from 'crypto';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export default async (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  if (!signature) return res.status(400).send('Missing signature');

  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');
  if (hash !== signature) return res.status(401).send('Invalid signature');

  const event = req.body;
  if (event.event === 'storefront.charge.success') {
    const data = event.data;
    const customerEmail = data.customer.email;
    const orderItems = data.order;

    try {
      const usersSnapshot = await db.collection('users').where('email', '==', customerEmail).limit(1).get();
      if (usersSnapshot.empty) {
        console.log('User not found for email:', customerEmail);
        return res.sendStatus(200);
      }
      const user = { id: usersSnapshot.docs[0].id, ...usersSnapshot.docs[0].data() };

      const products = await db.collection('products').get();
      const productsMap = {};
      products.docs.forEach(doc => { productsMap[doc.id] = { id: doc.id, ...doc.data() }; });

      for (const item of orderItems) {
        const product = Object.values(productsMap).find(p => p.paystackProductId === item.id);
        if (!product) continue;

        for (let i = 0; i < item.quantity; i++) {
          await db.collection('purchases').add({
            userId: user.id,
            productId: product.id,
            productTitle: product.title,
            amount: item.amount / 100,
            secretDetails: product.secretDetails,
            transactionReference: data.reference,
            purchasedAt: new Date().toISOString()
          });

          if (product.qtyAvailable > 0) {
            product.qtyAvailable -= 1;
            if (product.qtyAvailable === 0) product.soldOut = true;
            await db.collection('products').doc(product.id).update({
              qtyAvailable: product.qtyAvailable,
              soldOut: product.soldOut
            });
          }
        }
      }
    } catch (err) {
      console.error('Webhook error:', err);
    }
  }
  res.sendStatus(200);
};