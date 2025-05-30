import React, { useState, useEffect } from 'react';
import './ParticipantSelector.css';
import { useCollection } from '../../hooks/useCollection';

export default function ParticipantSelector({
  participantsRef_old = [],          // [{ uid, username }]
  projectParticipants = [],      // ["uid", "pepito", ...]
  selected = [],                 // ["uid", "ana", ...] 
  onChange = () => {}
}) {
  const [participants, setParticipants] = useState([]);
  const [inputParticipant, setInputParticipant] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { documents: participantsRef } = useCollection('participants');
  // 👇 Només es fa una vegada a la càrrega
  useEffect(() => {
    const combinats = Array.from(new Set([...selected, ...projectParticipants]));
    
    // Només actualitzem si són diferents
    const iguals = combinats.length === participants.length &&
      combinats.every(p => participants.includes(p));

    if (!iguals) {
      setParticipants(combinats);
      onChange(combinats);
    }
  }, [selected, projectParticipants]);

  const obtenirNom = (uidOrName) => {
    const match = participantsRef?.find(p => p.uid === uidOrName);
    return match ? match.username : uidOrName;
  };

  const afegirParticipant = (nou) => {
    if (!participants.includes(nou)) {
      const actualitzats = [...participants, nou];
      setParticipants(actualitzats);
      onChange(actualitzats);
    }
    setInputParticipant('');
    setSuggestions([]);
  };

  const eliminarParticipant = (p) => {
    const actualitzats = participants.filter(x => x !== p);
    setParticipants(actualitzats);
    onChange(actualitzats);
  };

  const handleInputChange = (e) => {
    const valor = e.target.value.toLowerCase();
    setInputParticipant(valor);

    if (valor.length > 0) {
      const resultats = projectParticipants
        .filter(pId => {
          const match = participantsRef.find(p => p.uid === pId);
          const nom = match ? match.username : pId;
          return nom.toLowerCase().includes(valor) && !participants.includes(pId);
        });

      setSuggestions(resultats);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="participants-wrapper">
      {participants.map((p, idx) => {
        const esManual = !participantsRef?.some(ap => ap.uid === p);

        return (
          <span key={idx} className={`participant-tag ${esManual ? 'manual' : ''}`}>
            {obtenirNom(p)}
            <button type="button" onClick={() => eliminarParticipant(p)}>×</button>
          </span>
        );
      })}

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
  );
}
