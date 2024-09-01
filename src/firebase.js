import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Importa getStorage

const firebaseConfig = {
  apiKey: "AIzaSyAPWs08IX2h6fcDJVA-83cOvV1NPXUuNbE",
  authDomain: "flatfinder-590f2.firebaseapp.com",
  projectId: "flatfinder-590f2",
  storageBucket: "flatfinder-590f2.appspot.com",
  messagingSenderId: "70084225025",
  appId: "1:70084225025:web:bed9fab45352d9772af800"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app); // Exporta storage correctamente


    
