import React, { useState } from 'react';
import './ParticipantSelector.css';
import { useCollection } from '../../hooks/useCollection';
import IconParticipantRemove from '../../icons/iconParticipantRemove';
import IconDespesa from '../../icons/iconDespesa';
import IconParticipants from '../../icons/iconParticipants';

export const obtenirConeguts = (projectParticipants, participantsRef, excludeIds = []) => {
  return Array.from(new Set([
    ...projectParticipants,
    ...participantsRef.map(p => p.uid)
  ])).filter(id => !excludeIds.includes(id));
};

export default function ParticipantSelector({
  participantsRef_old = [],
  projectParticipants = [],
  selected = [],
  onChange = () => {},
  mostrarPagament = false
}) {
  const { documents: fetchedParticipants } = useCollection('participants');
  const participantsRef = Array.isArray(fetchedParticipants) ? fetchedParticipants : participantsRef_old;

  const normalitza = (entrada) =>
    Array.isArray(entrada)
      ? entrada
          .map(p => {
            if (!p) return null;
            return typeof p === 'string' ? { id: p, haPagat: false } : p;
          })
          .filter(Boolean)
      : [];

  const [participants, setParticipants] = useState(() => normalitza(selected));
  const [inputParticipant, setInputParticipant] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const obtenirNom = (uidOrName) => {
    const match = participantsRef.find(p => p.uid === uidOrName);
    return match ? match.username : uidOrName;
  };

  const getResultat = (arr) => {
    return mostrarPagament
      ? arr
      : arr.map(p => p.id);
  };

  const afegirParticipant = (nouId) => {
    if (!participants.some(p => p.id === nouId)) {
      const actualitzats = [...participants, { id: nouId, haPagat: false }];
      setParticipants(actualitzats);
      onChange(getResultat(actualitzats));
    }
    setInputParticipant('');
    setSuggestions([]);
  };

  const eliminarParticipant = (id) => {
    const actualitzats = participants.filter(p => p.id !== id);
    setParticipants(actualitzats);
    onChange(getResultat(actualitzats));
  };

  const togglePagament = (id) => {
    const actualitzats = participants.map(p =>
      p.id === id ? { ...p, haPagat: !p.haPagat } : p
    );
    setParticipants(actualitzats);
    onChange(getResultat(actualitzats));
  };

  const handleInputChange = (e) => {
    const valor = e.target.value.toLowerCase();
    setInputParticipant(valor);

    if (valor.length > 0) {
      const coneguts = obtenirConeguts(
        projectParticipants,
        participantsRef,
        participants.map(p => p.id)
      );

      const resultats = coneguts.filter(pid => {
        const match = participantsRef.find(p => p.uid === pid);
        const nomRaw = match?.username || match?.uid || match?.id || pid;

        if (typeof nomRaw === 'object' && nomRaw?.id) {
          return nomRaw.id.toLowerCase().includes(valor.toLowerCase());
        }

        const nom = String(nomRaw).toLowerCase();
        return nom.includes(valor.toLowerCase());
      });

      setSuggestions(resultats);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="participants-whole">
      <h4>Participants&nbsp;&nbsp;&nbsp;
        <small>
            <IconParticipants/>&nbsp;&nbsp;{participants?.length} &nbsp; 
        </small>
      </h4>
      <div className="participants-wrapper-posibles">
        <h4>possibles</h4>
        <div className="participants-wrapper-posibles-list">
          {obtenirConeguts(projectParticipants, participantsRef, participants.map(p => p.id)).map((pid, idx) => {
            const esManual = !participantsRef.some(ap => ap.uid === pid);
            return (
              <div key={idx} onClick={() => afegirParticipant(pid)} className={`participant-tag ${esManual ? 'manual' : ''}`}>
                {obtenirNom(pid)}
              </div>
            );
          })}
        </div>
      </div>
      <div className="participants-wrapper">
        <h4>sel·leccionats</h4>
        <div className="participants-wrapper-list">
        {participants.map((p, idx) => {
          const esManual = !participantsRef.some(ap => ap.uid === p.id);
          return (
            <div key={idx} className={`participant-tag ${esManual ? 'manual' : ''}`}>
              <span className="participant-name">{obtenirNom(p.id)}</span>
              {mostrarPagament && (
                <button
                  onClick={() => togglePagament(p.id)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  <IconDespesa
                    width="25"
                    height="25"
                    color={p.haPagat ? "rgba(172, 250, 121, 0.7)" : "rgba(211, 143, 143, 0.9)"}
                  />
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  eliminarParticipant(p.id);
                }}
              >
                <IconParticipantRemove width="25" height="25" color="rgba(125,20,20,0.7)" />
              </button>
            </div>
          );
        })}
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Afegeix participant ..."
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
