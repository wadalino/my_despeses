import { useState, useEffect } from 'react';
import './DespesaForm.css';
import useCollection from '../../hooks/useCollection';
import ParticipantSelector from '../participants/ParticipantSelector';
import { getUserId } from '../../firebase/firebase.js';

export default function DespesaForm({ 
  usuariAutenticat, 
  afegirDespesa, 
  actualitzarDespesa,
  despesa,
  projecte
}) {
  console.log("UsuariAutenticat: ", usuariAutenticat);
  const projecteId = projecte?.id || null;
  const { documents: allParticipants, loading } = useCollection('participants');
  const allParticipantsProject = projecte?.participants;

  // 🔹 Estados iniciales
  const [concepte, setConcepte] = useState('');
  const [quantia, setQuantia] = useState('');
  const [pagatPer, setPagatPer] = useState(usuariAutenticat?.owner || '');
  const [participants, setParticipants] = useState([usuariAutenticat?.owner] || []);

  // 🔥 Solo actualizar campos si estamos editando
  useEffect(() => {
    console.log("handleSubmit executat", { concepte, quantia, pagatPer, participants });

    if (despesa) {
      setConcepte(despesa.concepte ?? '');
      setQuantia(despesa.quantia?.toString() ?? '');
      setPagatPer(despesa.pagatPer ?? usuariAutenticat?.owner ?? '');
      setParticipants(despesa.participants ?? []);
    } else {
      // 🔹 Solo para añadir, aseguramos que se inicialice correctamente
      setPagatPer(usuariAutenticat?.owner || '');
      setParticipants([usuariAutenticat?.owner] || []);
    }
  }, [despesa, usuariAutenticat]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!concepte.trim() || !quantia || !pagatPer || participants.length === 0) {
      alert('Tots els camps són obligatoris.');
      return;
    }

    const uid = getUserId();
    const participantsFinal = uid && !participants.includes(uid)
      ? [...participants, uid]
      : participants;

    const novaDespesa = {
      projecteId,
      concepte,
      quantia: Number(quantia) || 0,
      pagatPer,
      participants: participantsFinal,
      createdAt: new Date(),
    };

    if (despesa) {
      actualitzarDespesa({ despesa, novaDespesa });
    } else {
      afegirDespesa(novaDespesa);
      // 🔥 Al añadir, reseteamos con el user actual como pagador
      setConcepte('');
      setQuantia('');
      setPagatPer(usuariAutenticat?.owner || '');
      setParticipants([usuariAutenticat?.owner] || []);
    }
  };

  const handleParticipantsChange = (nousParticipants) => {
    setParticipants(nousParticipants);
  };

  if (loading) return <p>Carregant participants...</p>;

  return (
    <form className='despesa-form' onSubmit={handleSubmit}>
      <label>
        <span>Concepte</span>
        <input
          type='text'
          onChange={(e) => setConcepte(e.target.value)}
          value={concepte}
          required
        />
      </label>

      <label>
        <span>Quantia (€)</span>
        <input
          type='number'
          step='0.01'
          onChange={(e) => setQuantia(e.target.value)}
          value={quantia}
          required
        />
      </label>

      <label>
        <span>Pagat per</span>
        <select 
          onChange={(e) => setPagatPer(e.target.value)} 
          value={pagatPer || usuariAutenticat?.owner || ''}
          required
        >
          {allParticipantsProject
            ?.filter(pId => allParticipants?.some(p => p.uid === pId))
            .map((uid, idx) => {
              const match = allParticipants.find(p => p.uid === uid);
              return (
                <option key={idx} value={uid}>
                  {match?.username || uid}
                </option>
              );
            })}
        </select>
      </label>

      <label className='bordered'>
        <h4>Participants</h4>
        {console.log('Participants inline', participants)}
        <ParticipantSelector
          participantsRef={allParticipants}
          projectParticipants={allParticipantsProject}
          selected={participants}
          onChange={handleParticipantsChange}
        />
      </label>

      <button type="submit">
        {despesa ? 'Actualitzar' : 'Afegir'}
      </button>
    </form>
  );
}
