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
  onUpdate,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [participants, setParticipants] = useState(projecte?.participants || [usuariAutenticat?.owner]);
  const allParticipantsProject = projecte?.participants;

  const { documents: allParticipants, loading } = useCollection('participants');

  // Si hi ha projecte, carrega les dades per editar
  useEffect(() => {
    if (projecte) {
      setName(projecte.name || '');
      setDescription(projecte.description || '');
      setOwner(projecte.owner || user?.uid || '');
      setParticipants(projecte?.participants || [user?.uid] || []);
    } else {
      resetForm();
    }
  }, [projecte, user]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setOwner(user?.uid || ''); // per defecte posem el user?.uid
    setParticipants(user?.uid ? [user.uid] : []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProjecte = {
      name,
      description,
      owner,
      participants,
      modified: new Date(),
    };
    console.log("hola");
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


  const handleParticipantsChange = (selected) => {
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
                  selected={allParticipantsProject}
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
        {projecte?.id ? 'Actualitzar' : 'Afegir'}
      </button>
    </form>
  );
}
