import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyA9szN7cz3aaekk83JSMhg_SIMQ-jaYAUM",
  authDomain: "listafacilapp-a0949.firebaseapp.com",
  projectId: "listafacilapp-a0949",
  storageBucket: "listafacilapp-a0949.appspot.com", // corrigido para o padrão
  messagingSenderId: "884364349083",
  appId: "1:884364349083:web:d0d7e8fe8152b17ce3003e"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, app, firebaseConfig };
