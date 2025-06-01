import { useState, useEffect } from 'react';
import './DespesaForm.css';
import useCollection from '../../hooks/useCollection';
import ParticipantSelector from '../participants/ParticipantSelector';
import { getUserId } from '../../firebase/firebase.js';
import IconParticipants from '../../icons/iconParticipants.jsx';
import IconDespesa from '../../icons/iconDespesa.jsx';

export default function DespesaForm({ 
  usuariAutenticat, 
  afegirDespesa, 
  actualitzarDespesa,
  despesa,
  projecte
}) {
  //console.log("UsuariAutenticat: ", usuariAutenticat);
  const projecteId = projecte?.id || null;
  const { documents: allParticipants, loading } = useCollection('participants');
  const allParticipantsProject = projecte?.participants;

  // 🔹 Estados iniciales
  const [concepte, setConcepte] = useState('');
  const [quantia, setQuantia] = useState(despesa?.quantia ?? 0 );
  const [pagatPer, setPagatPer] = useState(usuariAutenticat?.owner || '');
  const [participantsDespesa, setParticipantsDespesa] = useState(despesa?.participants ?? [{id: usuariAutenticat?.owner}]);

  // 🔥 Solo actualizar campos si estamos editando
  useEffect(() => {
    console.log("handleSubmit executat", { concepte, quantia, pagatPer, participantsDespesa });
    if (despesa) {
      console.log("Despeses Form set despesa to update", despesa);
      setConcepte(despesa.concepte ?? '');
      setQuantia(despesa.quantia?.toString() ?? '');
      setPagatPer(despesa.pagatPer ?? usuariAutenticat?.owner ?? '');
      setParticipantsDespesa(despesa.participants ?? [usuariAutenticat?.owner]);
    } else {
      // 🔹 Solo para añadir, aseguramos que se inicialice correctamente
      setPagatPer(usuariAutenticat?.owner || '');
      setParticipantsDespesa([{id: usuariAutenticat?.owner}] || []);
    }
  }, [despesa, usuariAutenticat]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ProjecteForm handleSubmit", { e });
    console.log("REVISAR UPDATE!!!!!!!!! AÑADADIR OK!");

    if (!concepte.trim() || !quantia || !pagatPer || participantsDespesa.length === 0) {      
      alert('Tots els camps són obligatoris.');
      return;
    }

    console.log('DespesaForm', concepte, quantia, pagatPer, participantsDespesa);
    const uid = getUserId();
    const participantsFinal = 
      uid && !participantsDespesa.some(p => p.id === uid)
        ? [...participantsDespesa, {id: uid}]
        : participantsDespesa;
      

    const novaDespesa = {
      projecteId,
      concepte,
      quantia: Number(quantia) || 0,
      pagatPer,
      participants: participantsFinal,
      createdAt: new Date(),
    };

    
    if (despesa) {
      console.log("DespesaForm OLD despesa:", despesa.id);
      console.log("DespesaForm Actualitzam NOVA despesa:", novaDespesa);
      actualitzarDespesa({ despesa, novaDespesa });
      console.log("DespesaForm actualitzarDespesa ejecutado");
      if (typeof onSuccess === 'function') {
        onSuccess(); // ← afegeix això per avisar el pare
      }
    } else {
      console.log("DespesaForm NOT(old) despesa:", novaDespesa);
      
      afegirDespesa(novaDespesa);
      console.log("DespesaForm afegirDespesa ejecutado");
      // 🔥 Al añadir, reseteamos con el user actual como pagador
      setConcepte('');
      setQuantia('0');
      setPagatPer(usuariAutenticat?.owner || '');
      setParticipantsDespesa([{id: usuariAutenticat?.owner}] || []);
      // FIXME hay que hacer hande de onsubmit en el principal?
    }
  };

  const handleParticipantsChange = (nousParticipants) => {
    console.log("DespesaForm -> handleParticipantsChange: ", nousParticipants);
    setParticipantsDespesa(nousParticipants);
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
        <h4>Participants&nbsp;&nbsp;&nbsp;
          <small><IconParticipants/> {participantsDespesa.length} &nbsp; &nbsp;
                 <IconDespesa/> {((quantia/participantsDespesa.length).toFixed(2))}€</small>
        </h4>
        {console.log('Participants inline', participantsDespesa)}
        <ParticipantSelector
          participantsRef={allParticipants}
          projectParticipants={allParticipantsProject}
          selected={participantsDespesa}
          onChange={handleParticipantsChange}
          mostrarPagament={true}
        />
      </label>

      <button type="submit">
        {despesa ? (`Actualitzar`) : 'Afegir'}
      </button>
    </form>
  );
}
