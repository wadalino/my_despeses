import { useState, useEffect } from 'react';
import '../despesaForm/DespesaForm.css';
import useCollection from '../../hooks/useCollection'; // ajusta la ruta si cal
import ParticipantSelector from '../participants/ParticipantSelector';

export default function ProjecteForm({ 
  user, 
  afegirProjecte, 
  actualitzarProjecte, // actualitzarProjecte no s'utilitza
  projecte 
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [participants, setParticipants] = useState([]);
  const allParticipantsProject = projecte?.participants;

  const { documents: allParticipants, loading } = useCollection('participants');

  // Si hi ha projecte, carrega les dades per editar
  useEffect(() => {
    if (projecte) {
      setName(projecte.name || '');
      setDescription(projecte.description || '');
      setOwner(projecte.owner || user?.uid || '');
      setParticipants(projecte.participants || [user?.uid] || []);
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

    if (projecte?.id) {
      // Si el projecte existeix, actualitza
      actualitzarProjecte(projecte.id, newProjecte);
    } else {
      // Si no, crea un de nou
      afegirProjecte(newProjecte);
    }
    resetForm();
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

      <ParticipantSelector
                participantsRef={allParticipants}
                projectParticipants={allParticipantsProject}
                selected={participants}
                onChange={handleParticipantsChange}
              />
      <button type='submit' disabled={loading}>
        {projecte?.id ? 'Actualitzar' : 'Afegir'}
      </button>
    </form>
  );
}
