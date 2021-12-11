import { FirebaseOptions, initializeApp } from 'firebase/app';
import './RbbCleaning.ts';

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyBkvTfAcVuKxT_uLc6wj66I4uWppK-hJYE',
  authDomain: 'rbb-cleaning.firebaseapp.com',
  databaseURL: 'https://rbb-cleaning-default-rtdb.firebaseio.com',
  projectId: 'rbb-cleaning',
  storageBucket: 'rbb-cleaning.appspot.com',
  messagingSenderId: '751365085821',
  appId: '1:751365085821:web:88bf4fd16ae090b1036f14',
};

globalThis.fbApp = initializeApp(firebaseConfig);
// const fbAuth = getAuth(globalThis.fbApp);
// const fbDb = getDatabase(globalThis.fbApp);
