import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateProjecteParticipants } from '../../firebase/firebase';
import { useCollection } from '../../hooks/useCollection';

import Modal from '../modal/Modal';
import ProjectesDetall from './ProjectesDetall';
import ProjecteForm from './ProjecteForm';
import ProjectesParticipants from './ProjecteParticipants';
import DespesesLlista from '../despesesLlista/DespesesLlista';
import Despeses from '../../pages/despeses/Despeses';


import estils from '../despesesLlista/DespesesLlista.module.css';
import '../despesesLlista/DespesesLlista.css';
import './ProjectesLlista.css';
import { getAuth } from 'firebase/auth';


function getRandomRGBA(alpha = 0.15) {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ProjectesLlista({ projectes, eliminarProjecte }) {
  const [projecteActiuDetalls, setProjecteActiuDetalls] = useState(null);
  const [projecteActiuParticipants, setProjecteActiuParticipants] = useState(null);
  const [projecteActiuEdit, setProjecteActiuEdit] = useState(null);
  const [projecteActiuDespeses, setProjecteActiuDespeses] = useState(null);
  const [projectesAmbDespeses, setProjectesAmbDespeses] = useState([]);
  const user = getAuth().currentUser;
  const { documents: despeses } = useCollection('despeses');

  // Assigna despeses a cada projecte
  useEffect(() => {
    if (projectes && despeses) {
      const actualitzats = projectes.map(projecte => {
        const despesesDelProjecte = despeses.filter(d => d.projecteId === projecte.id);
        return {
          ...projecte,
          despeses: despesesDelProjecte
        };
      });
      setProjectesAmbDespeses(actualitzats);
    }
  }, [projectes, despeses]);
  //console.log("ProjectesLlista projectesAmbDespeses (usuari):", getAuth().currentUser?.uid);
  //console.log("ProjectesLlista projectesAmbDespeses:", projectesAmbDespeses);
  return (
    <div>
      {projectesAmbDespeses.map((projecte, index) => (
        <div className={estils.targeta} key={projecte.id} style={{ backgroundColor: getRandomRGBA(0.1) }}>
          <Link to={`/projecte/${projecte.id}`}>
            <h2 style={{ color: '#a5a5a5' }}>{projecte.concepte}</h2>
          </Link>
          <p>{projecte.description}</p>

          <button onClick={() => setProjecteActiuDetalls(projecte.id)}
                  style={{ backgroundColor: 'rgba(146, 112, 209, 0.4)', color: '#c5c5c5' }}>
            Detalls
          </button>
          <button onClick={() => setProjecteActiuParticipants(projecte)}
                  style={{ backgroundColor: 'rgba(187, 62, 177, 0.49)', color: '#c5c5c5' }}>
            Participants
          </button>
          <button onClick={() => setProjecteActiuDespeses(projecte)}
                  style={{ backgroundColor: 'rgba(70, 130, 180, 0.4)', color: '#c5c5c5' }}>
            Despeses
          </button>
          <button onClick={() => setProjecteActiuEdit(projecte)}
                  style={{ backgroundColor: 'rgba(200, 255, 0, 0.3)', color: '#c5c5c5' }}>
            Editar
          </button>
          <button onClick={() => eliminarProjecte(projecte.id)}
                  style={{ backgroundColor: 'rgba(255, 69, 0, 0.4)', color: '#c5c5c5' }}>
            Eliminar
          </button>

          <hr />
          <p className='despesa-detall__item'>
            <strong>Participants:</strong> {projecte.participants?.length || 0} participants
          </p>
          <p className='despesa-detall__item'>
            <strong>Projecte ID:</strong> {projecte.id}
          </p>
          <p className='despesa-detall__item'>
            <strong>Despeses:</strong> {projecte.despeses?.length || 0} despeses
          </p>
          <hr />
        </div>
      ))}

      {projecteActiuDetalls && (
        <Modal handleTancar={() => setProjecteActiuDetalls(null)} esVorera={""}>
          <ProjectesDetall id={projecteActiuDetalls} />
        </Modal>
      )}

      {projecteActiuParticipants && (
        <Modal handleTancar={() => setProjecteActiuParticipants(null)} esVorera={""}>
          <ProjectesParticipants
            participants={projecteActiuParticipants.participants}
            onUpdateParticipants={async (newList) => {
              try {
                await updateProjecteParticipants(projecteActiuParticipants.id, newList);
                setProjecteActiuParticipants(prev => ({
                  ...prev,
                  participants: newList
                }));
                alert("Participants desats correctament!");
              } catch (error) {
                alert("Error en desar els participants.");
              }
            }}
          />
        </Modal>
      )}

      {projecteActiuEdit && (
        <Modal handleTancar={() => setProjecteActiuEdit(null)} esVorera={""}>
          <ProjecteForm projecte={projecteActiuEdit} />
        </Modal>
      )}
        
      {projecteActiuDespeses && (
        
        <Modal modalNameClass="modalDespeses" handleTancar={() => setProjecteActiuDespeses(null)} esVorera={""}>
          <div>
            <h2>Despeses del projecte: {projecteActiuDespeses.name}</h2>
            <Despeses
                projecte={projecteActiuDespeses}
                despeses={projecteActiuDespeses.despeses}
                eliminarDespesa={() => {}}
                usuariAutenticat={projecteActiuDespeses}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
