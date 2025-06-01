import React, { useState, useEffect } from 'react';
import './ParticipantSelector.css';
import { useCollection } from '../../hooks/useCollection';
import IconParticipantRemove from '../../icons/iconParticipantRemove';
import IconDespesa from '../../icons/iconDespesa';

export default function ParticipantSelector({
  participantsRef_old = [],       // [{ uid, username }]
  projectParticipants = [],       // ["uid", "nomLliure", ...]
  selected = [],                  // ["uid", ...] => els inicials que han participat
  onChange = () => { },
  mostrarPagament = false         // nova prop opcional
}) {
  const { documents: fetchedParticipants } = useCollection('participants');
  const participantsRef = Array.isArray(fetchedParticipants) ? fetchedParticipants : participantsRef_old;

  const normalitza = (entrada) =>
    Array.isArray(entrada)
      ? entrada.map(p => {
        if (!p) return null;
        return typeof p === 'string' ? { id: p, haPagat: false } : p;
      }).filter(Boolean)
      : [];

  const [participants, setParticipants] = useState(() => normalitza(selected));
  const [inputParticipant, setInputParticipant] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const obtenirNom = (uidOrName) => {
    const match = participantsRef.find(p => p.uid === uidOrName);
    return match ? match.username : uidOrName;
  };

  const afegirParticipant = (nouId) => {
    if (!participants.some(p => p.id === nouId)) {
      const actualitzats = [...participants, { id: nouId, haPagat: false }];
      setParticipants(actualitzats);
      onChange(actualitzats);
    }
    setInputParticipant('');
    setSuggestions([]);
  };

  const eliminarParticipant = (id) => {
    const actualitzats = participants.filter(p => p.id !== id);
    setParticipants(actualitzats);
    onChange(actualitzats);
  };

  const togglePagament = (id) => {
    const actualitzats = participants.map(p =>
      p.id === id ? { ...p, haPagat: !p.haPagat } : p
    );
    setParticipants(actualitzats);
    onChange(actualitzats);
  };

  const handleInputChange = (e) => {
    const valor = e.target.value.toLowerCase();
    setInputParticipant(valor);

    if (valor.length > 0) {
      const coneguts = Array.from(new Set([...projectParticipants, ...participantsRef.map(p => p.uid)]));
      const resultats = coneguts.filter(pid => {
        const match = participantsRef.find(p => p.uid === pid);
        const nom = match ? match.username : pid;
        return nom.toLowerCase().includes(valor) && !participants.some(p => p.id === pid);
      });
      setSuggestions(resultats);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="participants-whole">
    <div className="participants-wrapper">
      {participants.map((p, idx) => {
        const esManual = !participantsRef.some(ap => ap.uid === p.id);
        return (
          <div key={idx} className={`participant-tag ${esManual ? 'manual' : ''}`}>
            {obtenirNom(p.id)}
            {mostrarPagament ? (
              <>
                <button onClick={() => togglePagament(p.id)} 
                        style={{ border: 'none', 
                                 background: 'transparent', 
                                 cursor: 'pointer' }}>
                  <IconDespesa width="25" height="25" 
                               color={p.haPagat ? "rgba(172, 250, 121, 0.7)" : "rgba(211, 143, 143, 0.9)"} />
                </button>
              </>
            ) : (
              <span></span>
            )}
            <>
              <button type="button" onClick={() => eliminarParticipant(p.id)}>
                <IconParticipantRemove width="25" height="25" color="rgba(125,20,20,0.7)"/>
              </button>
            </>
          </div>
        );
      })}
      </div>
      <div style={{position :"relative"}}>
        <input
          type="text"
          placeholder="Afegeix participant..."
          value={inputParticipant}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputParticipant.trim() !== '') {
              afegirParticipant(inputParticipant.trim());
              e.preventDefault();
            }
          }}
        />

        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((pid, idx) => (
              <li key={idx} onMouseDown={() => afegirParticipant(pid)}>
                {obtenirNom(pid)}
              </li>
            ))}
          </ul>
        )}
      </div>
    
    </div>
  );
}
