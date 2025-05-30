import { useState, useEffect } from 'react';
import './DespesaForm.css';
import useCollection from '../../hooks/useCollection'; // ajusta la ruta
import ParticipantSelector from '../participants/ParticipantSelector';



export default function DespesaForm({ 
  usuariAutenticat, 
  afegirDespesa, 
  actualitzarDespesa,
  despesa,
  projecte
}) {
  const projecteId = projecte?.id || null; // si no té projecte, es deixa a null
  const [concepte, setConcepte] = useState('');
  const [quantia, setQuantia] = useState('');
  const [pagatPer, setPagatPer] = useState('');
  const [participants, setParticipants] = useState([]);

  const { documents: allParticipants, loading } = useCollection('participants');
  const allParticipantsProject = projecte?.participants; 
  //console.log("DespesaForm AllParticipants:", allParticipants);
  //console.log("DespesaForm despesa props : ", afegirDespesa, user, actualitzarDespesa, despesa);  
  //console.log("DespesaForm despesa afegirDespesa: ", afegirDespesa);  
  //console.log("DespesaForm projecte: ", projecte);  
  //console.log("DespesaForm allParticipants: ", allParticipants);   
  

  // com empram es mateix form per afegir i actualitzar,
  // si hi ha una despesa, carregam ses dades 
  useEffect(() => { 
    if (despesa) {
      setConcepte(despesa.concepte || 'no especificat');
      setQuantia(despesa.quantia.toString() || 0);
      setPagatPer(despesa.pagatPer || usuariAutenticat?.uid);
      setParticipants(despesa.participants || [usuariAutenticat?.uid]);
    } else {
      resetForm();
    }
  }, [despesa, usuariAutenticat]);


  const resetForm = () => {
    setConcepte('');
    setQuantia('');
    setPagatPer('');
    setParticipants([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const despesa = {
      projecteId,
      concepte,
      quantia: parseFloat(quantia),
      pagatPer: pagatPer || usuariAutenticat?.uid,
      participants,
      createdAt: new Date(),
    };
    //console.log("DespesaForm despesa: ", despesa);
    //console.log("DespesaForm projectId: ", projecteId);
    //console.log("DespesaForm e: ", e);
    afegirDespesa(despesa);
    resetForm();
  };

  const handleParticipantsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setParticipants(selected);
  };

  // console.log("DespesaForm AllParticipants:", allParticipants);
  return (
    <form className='despesa-form' onSubmit={handleSubmit}>
      <label>
        <span>Concepte</span>
        <input
          type='text'
          onChange={(e) => setConcepte(e.target.value)}
          value={concepte}
        />
      </label>
      <label>
        <span>Quantia (€)</span>
        <input
          type='number'
          step='0.01'
          onChange={(e) => setQuantia(e.target.value)}
          value={quantia}
        />
      </label> 

      <label>
        <span>Pagat per</span>
        {/* 
        /// INFO not enabled because can't be paid by others that not in participants collection
        <select onChange={(e) => setPagatPer(e.target.value)} value={pagatPer}>
          <option value="">-- Selecciona --</option>
          {allParticipantsProject?.map((pIdOrName, idx) => {
            // Comprova si aquest participant està a la llista oficial (té username)
            const match = allParticipants?.find(p => p.uid === pIdOrName);

            // Mostra username si hi ha coincidència, o el nom literal
            return (
              <option key={idx} value={pIdOrName}>
                {match ? match.username : pIdOrName}
              </option>
            );
          })}
        </select> */}
        
        <select onChange={(e) => setPagatPer(e.target.value)} value={pagatPer}>
          <option value="">-- Selecciona --</option>
          {allParticipantsProject
            ?.filter(pId => allParticipants?.some(p => p.uid === pId)) // només els que són uids vàlids
            .map((uid, idx) => {
              const match = allParticipants.find(p => p.uid === uid);
              return (
                <option key={idx} value={uid}>
                  {match?.username}
                </option>
              );
            })}
        </select>
      </label>

      <label className='bordered'>
        <span>Participants</span>
        <ParticipantSelector
          participantsRef={allParticipants}
          projectParticipants={allParticipantsProject}          // array amb { uid, username }
          selected={participants}                           // array amb valors seleccionats
          onChange={(nousParticipants) => setParticipants(nousParticipants)} // callback per actualitzar participants
        />
      </label>

      <button >
        {despesa ? 'Actualitzar' : 'Afegir'}
      </button>
    </form>
  );
}
