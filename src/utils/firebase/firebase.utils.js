// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// this config function enables use to attach this firebase instance to the instance we have created online
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIixH1vIvDegqJ64n5DtVHZNw3q40YqS0",
  authDomain: "gold-clothing-db.firebaseapp.com",
  projectId: "gold-clothing-db",
  storageBucket: "gold-clothing-db.appspot.com",
  messagingSenderId: "499942691299",
  appId: "1:499942691299:web:c4075b524146b40adc50d6",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// to use google authentication we need to first off initialze a google provider
// GoogleAuthProvider (providers in general) are instantiated as classes
// Just as there is google provider there is also facebook provider and many more
const googleProvider = new GoogleAuthProvider();

// setcustomparameters are primarily for google authentication providers
googleProvider.setCustomParameters({ prompt: "select_account" });

// authentication always has to be the same for different applications
export const auth = getAuth();

// Google popup Authentication
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

// Google redirect Authentication || to be exported
// export const signInWithGoogleRedirect = () =>
//   signInWithRedirect(auth, googleProvider);

// Setting up the database access implementation
export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth) => {
  if (!userAuth) return;

  // doc gets 3 params
  const userDocRef = doc(db, "users", userAuth.uid);

  console.log(userDocRef);

  const userSnapShot = await getDoc(userDocRef);
  // console.log(userSnapShot);
  // with exists method we can check if a document exists in database
  // console.log(userSnapShot.exists());

  if (!userSnapShot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
      });
    } catch (error) {
      console.error("error from creating user", error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};
