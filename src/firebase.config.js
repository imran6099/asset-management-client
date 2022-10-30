// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBprfpsS5Letw9SdmYLWs9a7quvmXrzKco',
  authDomain: 'local-asset-management.firebaseapp.com',
  projectId: 'local-asset-management',
  storageBucket: 'local-asset-management.appspot.com',
  messagingSenderId: '367236026811',
  appId: '1:367236026811:web:5e2a93de9a9a7b152d349e',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };
