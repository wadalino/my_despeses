import { useState, useEffect } from 'react';
import '../despesaForm/DespesaForm.css';
import useCollection from '../../hooks/useCollection'; // ajusta la ruta

export default function ProjecteForm({ 
  user, 
  afegirProjecte, 
  actualitzarProjecte,
  projecte 
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [participants, setParticipants] = useState([]);

  const { documents: allParticipants, loading } = useCollection('participants');

  // com empram es mateix form per afegir i actualitzar,
  // si hi ha una despesa, carregam ses dades
  useEffect(() => {
    if (projecte) {
      setName(projecte.name || 'no especificat');
      setDescription(projecte.description || 'no especificat');
      setOwner(projecte.owner || user?.uid);
      setParticipants(projecte.participants || [user?.uid]);
    } else {
      resetForm();
    }
  }, [projecte, user]);


  const resetForm = () => {
    setName('');
    setDescription('');
    setOwner('');
    setParticipants([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const projecte = {
      name,
      description,
      owner,
      participants,
      modified: new Date(),
    };

    afegirProjecte(projecte);
    resetForm();
  };

  const handleParticipantsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setParticipants(selected);
  };

  console.log("ProjecteForm projecte: ", projecte);
  return (
    <form className='despesa-form' onSubmit={handleSubmit}>
      <label>
        <span>Nom del projecte</span>
        <input
          type='text'
          onChange={(e) => setName(e.target.value)}
          value={name}
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
        <select onChange={(e) => setOwner(e.target.value)} value={owner}>
          <option value="">-- Selecciona --</option>
          {allParticipants?.map(p => (
            <option key={p.uid} value={p.uid}>{p.username}</option>
          ))}
        </select>
      </label>

      <label>
        <span>Participants</span>
        <select multiple value={participants} onChange={handleParticipantsChange}>
          {allParticipants?.map(p => (
            <option key={p.uid} value={p.uid}>{p.username}</option>
          ))}
        </select>
      </label>

      <button disabled={loading}>
        {projecte ? 'Actualitzar' : 'Afegir'}
      </button>
    </form>
  );
}
