import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import Despeses from '../despeses/Despeses.jsx';
import DespesesLlista from '../../components/despesesLlista/DespesesLlista.jsx';
import { useCollection } from '../../hooks/useCollection.jsx';
import ProjectesLlista from '../../components/projectes/ProjectesLlista.jsx';
import ProjecteForm from '../../components/projectes/ProjecteForm.jsx';

export default function Projectes() {
  const [user, setUser] = useState(null);
  const [projecte, setProjecte] = useState(null);
  const [nomProjecte, setNomProjecte] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [editMode, setEditMode] = useState(false);
  const {documents: projectes} = useCollection('projectes');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && Array.isArray(projectes)) {
      const propis = projectes.filter(p => p.owner === user.uid);
      if (propis.length > 0) {
        setProjecte(propis[0]);
        setNomProjecte(propis[0].name);
        setDescripcio(propis[0].description || "");
      }
    }
  }, [user, projectes]);

  const crearProjecte = async () => {
    const newProjecte = {
      name: nomProjecte,
      description: descripcio,
      created: serverTimestamp(),
      modified: serverTimestamp(),
      owner: user.uid,
      participants: [user.uid],
    };
    await addDoc(collection(db, "projectes"), newProjecte);
  };

  const updateProjecte = async () => {
    if (!projecte) return;
    const ref = doc(db, "projectes", projecte.id);
    await updateDoc(ref, {
      name: nomProjecte,
      description: descripcio,
      modified: serverTimestamp(),
    });
    setEditMode(false);
  };

  if (!user) return <div>Carregant...</div>;

  return (
    <div>
      <h2>Els meus projectes</h2>
      {Array.isArray(projectes) && projectes.length > 0 && (
        <ProjectesLlista projectes={projectes.filter(p => p.owner === user.uid)} />
      )}
      { /*
      {projecte ? (
        <div>
          <ProjecteForm idProjecte={projecte.id} />
        </div>
      ) : (
        <div>
          <label>
            Nom del projecte:
            <input
              type="text"
              value={nomProjecte}
              onChange={(e) => setNomProjecte(e.target.value)}
            />
          </label>
          <label>
            Descripció:
            <textarea
              value={descripcio}
              onChange={(e) => setDescripcio(e.target.value)}
            />
          </label>
          <button onClick={crearProjecte}>Crear projecte</button>
        </div>
      )} 
      */ }
    </div>
  );
}
