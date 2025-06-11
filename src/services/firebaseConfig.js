import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA9szN7cz3aaekk83JSMhg_SIMQ-jaYAUM',
  authDomain: 'listafacilapp-a0949.firebaseapp.com',
  projectId: 'listafacilapp-a0949',
  storageBucket: 'listafacilapp-a0949.appspot.com',
  messagingSenderId: '884364349083',
  appId: '1:884364349083:web:d0d7e8fe8152b17ce3003e',
};

let app;
let auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApps()[0];
  auth = getAuth(app);
}

export { app, auth };
