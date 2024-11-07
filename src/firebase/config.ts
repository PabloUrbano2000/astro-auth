// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBonfHZw-meYXO6TLdYg0NPUFY1ekY10BM',
  authDomain: 'astro-authentication-375a3.firebaseapp.com',
  projectId: 'astro-authentication-375a3',
  storageBucket: 'astro-authentication-375a3.appspot.com',
  messagingSenderId: '956556703280',
  appId: '1:956556703280:web:a62536162dae7adf7e9ff5'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

auth.languageCode = 'es'

export const firebase = {
  app,
  auth
}
