import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import { collection, addDoc, updateDoc, doc, 
         serverTimestamp, } from 'firebase/firestore';
import { auth, db, 
         deleteProjecte, saveProjecte, getProjectes } from '../../firebase/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { useCollection } from '../../hooks/useCollection.jsx';
import ProjectesLlista from '../../components/projectes/ProjectesLlista.jsx';
import ProjecteForm from '../../components/projectes/ProjecteForm.jsx';
import Modal from '../../components/modal/Modal';

import './Projectes.css';

export default function Projectes() { 
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projecte, setProjecte] = useState(null);
  const [nomProjecte, setNomProjecte] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [editMode, setEditMode] = useState(false);
  const {documents: projectes} = useCollection('projectes');
  const [mostraModal, setMostraModal] = useState(false);
  const handleTancar = () => { setMostraModal(false); };

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


  if (!user) return navigate("/");

  return (
    <div className="div-projectes">
      <h2>Els meus projectes</h2>
      {Array.isArray(projectes) && 0 <= projectes.length && (
        <h3>Encara no tens projectes!!</h3>
      )}
      <button onClick={crearProjecte}>Crea un nou projecte</button>
      <button onClick={() => setMostraModal(true)}>Afegir Projecte Nou</button>
      {Array.isArray(projectes) && projectes.length > 0 && (
        <ProjectesLlista 
            eliminarProjecte={deleteProjecte} 
            projectes={
              projectes.filter(p => p.owner === user.uid)} />
      )}

      {mostraModal && <Modal handleTancar={handleTancar} esVorera={""} title="afegint un nou Projecte">
                      <ProjecteForm 
                        user={user}   
                        afegirProjecte={saveProjecte}
                        eliminarProjecte={deleteProjecte}
                        projecte={projecte} 
                        />

                  </Modal>}

    </div>
  );
}
