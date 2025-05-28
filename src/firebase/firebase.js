import { firebaseConfig } from "./config"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore, addDoc, collection, getDocs, onSnapshot, doc, deleteDoc } from "firebase/firestore"
import { } from 'firebase/auth'; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const saveDespesa = async (despesa) => {
  console.log(despesa);
  const docRef = await addDoc(collection(db, "despeses"), despesa);

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
