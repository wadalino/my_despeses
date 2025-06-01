import { firebaseConfig } from "./config"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore, addDoc, collection, getDoc, getDocs, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from 'firebase/auth'; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);


  
export const saveCollection = async (collectionName, document) => {
  console.log(document);
  const docRef = await addDoc(collection(db, collectionName), document);

  return docRef.id;   
}

/* DESPESA FUNCTIONS */
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

export const updateDespesa = async (despesa, novaDespesa) => {
  const despesaId = despesa.id ?? null;
  if (!despesaId) return false;

  try {
    const docRef = doc(db, 'despesas', despesaId);
    await updateDoc(docRef, novaDespesa);
    return docRef.id;
  } catch (error) {
    console.error("Error actualitzant la despesa:", error);
    return false;
  }
};

export const deleteDespesa = async (id) => {
  deleteDoc(doc(db, "despeses", id));
}

/* PROJECT FUNCTIONS */
export const getProjectes = () => 
  getDocs(collection(db, "projectes"));

export const onGetProjecte = (id, callback) =>
  onSnapshot(doc(db, "projectes", id), callback);

export const saveProjecte = async (projecte) => {
  const projecteAmbTimestamp = {
    ...projecte,
    created: serverTimestamp(), // afegeix data i hora del servidor
  };

  const docRef = await addDoc(collection(db, "projectes"), projecteAmbTimestamp);
  return docRef.id;
};

export const updateProjecte = async (projecteOld, projecteNew) => {
  console.log("Firebase update project", projecteOld);
  const projecteId = projecteOld?.id || projecteOld || null;
  if (!projecteId) return false;

  try {
    const docRef = doc(db, 'projectes', projecteId);
    await updateDoc(docRef, projecteNew);
    console.log("Projecte actualitzat correctament: ", projecteId);
    //return docRef.id;
    return true;
  } catch (error) {
    console.error("Error actualitzant el projecte: ", error);
    return false;
  }

  
};

export const deleteProjecte = async (id) => {
  deleteDoc(doc(db, "projectes", id));
}

export const getProjectePerUID = async (uid) => {
  try {
    const q = query(collection(db, "projectes"), where("owner", "==", uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error obtenint projecte del uid:", error);
    throw error;
  }
}


export const getDespesesPerProjecte = async (projecteId) => {
  try {
    const q = query(collection(db, "despeses"), where("projecteId", "==", projecteId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error obtenint despeses per projecte:", error);
    throw error;
  }
}

export const updateProjecteParticipants = async (projecteId, newParticipants) => {
  try {
    const ref = doc(db, "projectes", projecteId);
    await updateDoc(ref, { participants: newParticipants });
    console.log("Participants actualitzats correctament per al projecte", projecteId);
  } catch (error) {
    console.error("Error actualitzant participants:", error);
    throw error;
  }
};


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

export const getCurrentUser = () => {
  return auth.currentUser;
}
export const getUserId = () => {
  const user = getCurrentUser();
  // console.log("From Firebase getUserId: ", user);
  return user ? user.uid : null;
}

export const getUserEmail = () => {
  const user = getCurrentUser();
  // console.log("From Firebase getUserId: ", user);
  return user ? user.email : null;
}

