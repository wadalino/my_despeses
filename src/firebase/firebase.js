import { firebaseConfig } from "./config"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore, addDoc, collection, getDocs, onSnapshot, doc, deleteDoc } from "firebase/firestore"
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from 'firebase/auth'; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export const saveDespesa = async (despesa) => {
  console.log(despesa);
  const docRef = await addDoc(collection(db, "despeses"), despesa);

  return docRef.id;   
}

export const saveCollection = async (collectionName, document) => {
  console.log(document);
  const docRef = await addDoc(collection(db, collectionName), document);

  return docRef.id;   
}


export const getDespeses = () => 
  getDocs(collection(db, "despeses"));

export const onGetCollection = (collectionName, callback) =>
  onSnapshot(collection(db, collectionName), callback);

export const onGetDespesa = (id, callback) =>
  onSnapshot(doc(db, "despeses", id), callback);

export const deleteDespesa = async (id) => {
  deleteDoc(doc(db, "despeses", id));
}


/* Auth funcions */
export const registerUser = async (email, password) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  }
  catch (error) {
    console.error("Error registering user:", error.code, error.message);

    if (error.code === 'auth/email-already-in-use') {
      alert("This email is already in use. Please try another one.");
    }

    if (error.code === 'auth/invalid-email') {
      alert("The email address is not valid. Please enter a valid email.");
    }
    
    if (error.code === 'auth/weak-password') {
      alert("The password is too weak. Please enter a stronger password.");
    }

    throw error;
  }
}

export const loginUser = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  }
  catch (error) {
    console.error("Error logging in user:", error.code, error.message);

    if (error.code === 'auth/user-not-found') {
      alert("No user found with this email. Please register first.");
    }

    if (error.code === 'auth/wrong-password') {
      alert("Incorrect password. Please try again.");
    }

    if (error.code === 'auth/invalid-email') {
      alert("The email address is not valid. Please enter a valid email.");
    }
    
    if (error.code === 'auth/user-disabled') {
      alert("This user has been disabled. Please contact support.");
    }
    
    if (error.code === 'auth/too-many-requests') {
      alert("Too many login attempts. Please try again later.");
    } 

    throw error;
  }
}

export const logoutUser = async () => {
  try {
    await auth.signOut();
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
}


// crear metodo per comprovar si tenim un usuari autenticat
export const loginState = (callback) => {
  return auth.onAuthStateChanged(callback);
}




