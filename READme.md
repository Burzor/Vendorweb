/
├── public/
│   ├── index.html
│   ├── purchases.html
│   ├── payment-process.html
│   ├── payment-return.html
│   ├── admin.html
│   ├── admin-login.html
│   └── firebase-config.js
├── api/
│   ├── products.js
│   ├── products/
│   │   └── [id].js
│   ├── admin/
│   │   ├── login.js
│   │   ├── users.js
│   │   ├── users/
│   │   │   └── [id].js
│   │   ├── transactions.js
│   │   └── stats.js
│   ├── user/
│   │   ├── purchases.js
│   │   └── me.js
│   ├── auth/
│   │   ├── login.js
│   │   ├── register.js
│   │   └── logout.js
│   └── paystack-webhook.js
├── lib/
│   ├── firebase-admin.js
│   └── verify-token.js
├── .env.local          (not committed)
├── vercel.json
└── package.json