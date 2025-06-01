import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, deleteProjecte, saveProjecte } from '../../firebase/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { useCollection } from '../../hooks/useCollection.jsx';
import ProjectesLlista from '../../components/projectes/ProjectesLlista.jsx';
import ProjecteForm from '../../components/projectes/ProjecteForm.jsx';
import Modal from '../../components/modal/Modal';

import './Projectes.css';

export default function Projectes() { 
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mostraModal, setMostraModal] = useState(false);
  const { documents: projectes } = useCollection('projectes');

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

  if (!user) return navigate("/");

  // Filtrar projectes del usuario
  const projectesDelUsuari = Array.isArray(projectes)
    ? projectes.filter(p => p.owner === user.uid)
    : [];

  return (
    <div className="div-projectes">
      <h2>Els meus projectes</h2>

      {projectesDelUsuari.length === 0 ? (
        <h3>Encara no tens projectes!!</h3>
      ) : (
        <ProjectesLlista 
          eliminarProjecte={deleteProjecte} 
          projectes={projectesDelUsuari} 
        />
      )}

      <button onClick={() => setMostraModal(true)}>Afegir Projecte Nou</button>

      {mostraModal && (
        <Modal handleTancar={() => setMostraModal(false)} esVorera={""} title="Afegint un nou Projecte">
          <ProjecteForm 
            user={user}   
            afegirProjecte={saveProjecte}
            eliminarProjecte={deleteProjecte}
          />
        </Modal>
      )}
    </div>
  );
}
