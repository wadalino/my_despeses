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
        const despesesDelProjecte = despeses
          .filter(d => d.projecteId === projecte.id)
          .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
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
          
          <h2 style={{ color: '#a5a5a5' }}>{projecte.name}</h2>
          
          <p>{projecte.description}</p>

          <div>
          <button onClick={() => setProjecteActiuParticipants(projecte)}
                  style={{ backgroundColor: 'rgba(187, 62, 177, 0.49)', color: '#c5c5c5' }}>
            Participants <small>({projecte.participants.length})</small>
          </button>
          <button onClick={() => setProjecteActiuDespeses(projecte)}
                  style={{ backgroundColor: 'rgba(70, 130, 180, 0.4)', color: '#c5c5c5' }}>
            Despeses <small>({projecte.despeses.length})</small>
          </button>
          </div>
          <div>
          <button onClick={() => setProjecteActiuDetalls(projecte.id)}
                  style={{ backgroundColor: 'rgba(146, 112, 209, 0.4)', color: '#c5c5c5' }}>
            Detalls
          </button>
          <button onClick={() => setProjecteActiuEdit(projecte)}
                  style={{ backgroundColor: 'rgba(200, 255, 0, 0.3)', color: '#c5c5c5' }}>
            Editar
          </button>
          <button onClick={() => eliminarProjecte(projecte.id)}
                  style={{ backgroundColor: 'rgba(255, 69, 0, 0.4)', color: '#c5c5c5' }}>
            Eliminar
          </button>
          </div>

          <hr />
          
          <p className='projecte-detall__item'>
            <strong>Projecte ID:</strong> {projecte.id}
          </p>
          <p className='projecte-detall__item'>
            <strong>Total de despeses:</strong> { 
                projecte.despeses?.reduce((total, despesa) => total + despesa.quantia, 0).toFixed(2) || 0 
              } €
          </p>
          <hr />
        </div>
      ))}
      
      {projecteActiuDetalls && (
        <Modal handleTancar={() => setProjecteActiuDetalls(null)} esVorera={""} title={`detalls del projecte '${projectesAmbDespeses[0].name}'`}>
          <ProjectesDetall id={projecteActiuDetalls} />
        </Modal>
      )}
      
      {projecteActiuParticipants && (
        <Modal handleTancar={() => setProjecteActiuParticipants(null)} esVorera={""} title={`participants del projecte '${projecteActiuParticipants.name}'`}>
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
        <Modal handleTancar={() => setProjecteActiuEdit(null)} esVorera={""} title={`editant projecte '${projecteActiuEdit.name}'`}>
          <ProjecteForm projecte={projecteActiuEdit} />
        </Modal>
      )}
        
      {projecteActiuDespeses && (
        
        <Modal modalNameClass="modalDespeses" handleTancar={() => setProjecteActiuDespeses(null)} esVorera={""} title={`despeses del projecte '${projecteActiuDespeses.name}'`}>
          <div>
            
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
