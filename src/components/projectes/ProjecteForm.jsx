import { useState, useEffect } from 'react';
import '../despesaForm/DespesaForm.css';
import useCollection from '../../hooks/useCollection'; // ajusta la ruta si cal
import ParticipantSelector from '../participants/ParticipantSelector';
// import ProjectesParticipants from './ProjecteParticipants';
import IconParticipants from '../../icons/iconParticipants';
import IconDespesa from '../../icons/iconDespesa';

export default function ProjecteForm({ 
  user, 
  afegirProjecte, 
  actualitzarProjecte, // actualitzarProjecte no s'utilitza
  projecte,
  onSuccess,
  //onUpdate,
}) {
  // Si no hi ha projecte, per defecte posem un objecte buit
  const [name, setName] = useState(projecte?.name || '');
  // Descripció inicial:
  const [description, setDescription] = useState(projecte?.description || '');
  // Owner inicial:
  const [owner, setOwner] = useState(projecte?.owner || user?.uid || ''); // per defecte posem el user?.uid
  // Participants inicials:
  // si no hi ha projecte, per defecte posem el user?.uid
  const [participants, setParticipants] = useState(projecte?.participants || [user?.uid]);
  // Participants del projecte
  const allParticipantsProject = projecte?.participants;
  const { documents: allParticipants, loading } = useCollection('participants');

  // Si hi ha projecte, carrega les dades per editar
  useEffect(() => {
    if (projecte) {
      setName(projecte.name || '');
      setDescription(projecte.description || '');
      setOwner(projecte.owner || user?.uid || '');
      setParticipants(projecte?.participants || [user?.uid]);
    } else {
      resetForm();
    }
  }, [projecte, user]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setOwner(user?.uid ?? ''); // per defecte posem el user?.uid
    setParticipants([user?.uid] ?? []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProjecte = {
      name,
      description,
      owner,
      participants,
      // modified in set in firebase.js
    };
    if (projecte?.id) {
      // Actualitza projecte existent
      actualitzarProjecte(projecte.id, newProjecte);
      
    } else {
      // Afegeix un nou projecte
      afegirProjecte(newProjecte);
    }
    resetForm();
    onSuccess();
    
  };


  const handleParticipantsChange = (participants) => {
    setParticipants();
  };

  return (
    <form className='despesa-form' onSubmit={handleSubmit}>
      <label>
        <span>Nom del projecte</span>
        <input
          type='text'
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
      </label>

      <label>
        <span>Descripció</span>
        <input
          type='text'
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
      </label>

      <label>
        <span>Owner</span>
        <select onChange={(e) => setOwner(e.target.value)} value={owner} required>
          <option value="">-- Selecciona --</option>
          {allParticipants?.map(p => (
            <option key={p.uid} value={p.uid}>{p.username}</option>
          ))}
        </select>
      </label>
      
      {/*
      <label>
        <span>Participants</span>
        <select multiple value={participants} onChange={handleParticipantsChange}>
          {allParticipants?.map(p => (
            <option key={p.uid} value={p.uid}>{p.username}</option>
          ))}
        </select>
      </label>
      */}
      <label className='bordered'>
        <h4>Participants&nbsp;&nbsp;&nbsp;
          <small><IconParticipants/> {allParticipantsProject?.length} &nbsp; &nbsp;
                  {/*<IconDespesa/> {((quantia/participantsDespesa.length).toFixed(2))}€*/}
          </small>
        </h4>
        <ParticipantSelector
                  participantsRef={allParticipants}
                  projectParticipants={allParticipantsProject}
                  selected={participants}
                  onChange={handleParticipantsChange}
                />
      </label>
      
      {/*
      <ProjectesParticipants
                  participants={participants}
                  onUpdateParticipants={async (newList) => {
                    participants = newList;
                  }}
                />        
      */}
      <button type='submit' disabled={loading}>
        {projecte?.id ? 'Actualitzar' : 'Afegir nou projecte'}
      </button>
    </form>
  );
}
