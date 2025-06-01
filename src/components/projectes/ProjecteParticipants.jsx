import React, { useState, useEffect } from 'react';
import useCollection from '../../hooks/useCollection';
import ParticipantSelector from '../participants/ParticipantSelector';

import './ProjecteParticipants.css';

export default function ProjecteParticipants({ participants: propParticipants = [], onUpdateParticipants }) {
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState('');
  const [selectedUid, setSelectedUid] = useState('');
  const { documents: allUsers, loading } = useCollection('participants');

  useEffect(() => {
    setParticipants(propParticipants);
  }, [propParticipants]);

  const afegirParticipantManual = () => {
    const trimmed = newParticipant.trim();
    if (trimmed && !participants.includes(trimmed)) {
      setParticipants(prev => [...prev, trimmed]);
      setNewParticipant('');
    }
  };

  const afegirParticipantUid = () => {
    if (selectedUid && !participants.includes(selectedUid)) {
      setParticipants(prev => [...prev, selectedUid]);
      setSelectedUid('');
    }
  };

  const eliminarParticipant = (participant) => {
    setParticipants(prev => prev.filter(p => p !== participant));
  };

  const obtenirNom = (uidOrName) => {
    const usuari = allUsers?.find(u => u.uid === uidOrName);
    return usuari ? usuari.username : uidOrName;
  };

  const handleGuardar = () => {
    if (onUpdateParticipants) {
      onUpdateParticipants(participants);
    }
  };

  return (
    <div className="participants-modal">
      <h2>Participants del projecte</h2>

      <div className="participants-labels">
        {participants.map((p, idx) => (
          <span className="participant-label" key={idx}>
            {obtenirNom(p)}
            <button onClick={() => eliminarParticipant(p)}>&times;</button>
          </span>
        ))}
      </div>

      <div className="participant-inputs">
        <label>
          Afegeix participant nou:
          <input
            type="text"
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            placeholder="Nom del participant"
          />
          <button onClick={afegirParticipantManual}>Afegir</button>
        </label>

        <label>
          Afegeix participant existent:
          <select value={selectedUid} onChange={(e) => setSelectedUid(e.target.value)}>
            <option value="">-- Selecciona --</option>
            {allUsers?.map(user => (
              <option key={user.uid} value={user.uid}>{user.username}</option>
            ))}
          </select>
          <button onClick={afegirParticipantUid}>Afegir</button>
        </label>
      </div>
      
      <div className="guardar-container">
        <button onClick={handleGuardar} className="guardar-button">
          Desar participants
        </button>
      </div>
    </div>
  );
}
