import React, { useState, useEffect } from 'react';
import './ParticipantSelector.css';
import { useCollection } from '../../hooks/useCollection';

export default function ParticipantSelector({
  participantsRef_old = [],
  projectParticipants = [],
  selected = [],
  onChange = () => {}
}) {
  const [participants, setParticipants] = useState([]);
  const [inputParticipant, setInputParticipant] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { documents: participantsRef = participantsRef_old } = useCollection('participants');

  useEffect(() => {
    if (participants.length === 0) {
      const combinats = Array.from(new Set([...selected, ...projectParticipants]));
      const combinatsFiltrats = combinats.filter(p => p && p.trim() !== '');
      setParticipants(combinatsFiltrats);
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
      const resultats = participantsRef
        .filter(p => p.username.toLowerCase().includes(valor) && !participants.includes(p.uid))
        .map(p => p.uid);
      setSuggestions(resultats);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="participants-wrapper">
      <div>Posibles participants</div>
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
      <div style={{position: 'relative'}}>
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((pid, idx) => (
            <li key={idx} onClick={() => afegirParticipant(pid)}>
              {obtenirNom(pid)}
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}
