import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { serverTimestamp } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCqCvKzOOVv7cKExw0ko_rTg4RiZ3Ep-Us",
    authDomain: "muso-ninjas-e0399.firebaseapp.com",
    projectId: "muso-ninjas-e0399",
    storageBucket: "muso-ninjas-e0399.appspot.com",
    messagingSenderId: "323562231861",
    appId: "1:323562231861:web:ffce1a608065d3a925b97c"
  };

// Initialize firebase
const firebaseApp = initializeApp(firebaseConfig); //config

// Initialize auth && firestore &&timestamp variables with the 'firebaseApp' property

const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const timestamp = serverTimestamp();
const storage = getStorage(firebaseApp);

export { firestore, auth, timestamp, storage };