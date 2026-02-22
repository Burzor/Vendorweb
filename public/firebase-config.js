// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDeLmKaFakiLaKBrHYQRFd0UdWnMlpb1o",
  authDomain: "vendor-stotage.firebaseapp.com",
  projectId: "vendor-stotage",
  storageBucket: "vendor-stotage.firebasestorage.app",
  messagingSenderId: "55194709986",
  appId: "1:55194709986:web:83dce757d245ec129793bb",
  measurementId: "G-4X4V8V3JWZ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();