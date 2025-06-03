import React, { useState, useEffect } from 'react';
import useCollection from '../../hooks/useCollection'; // ajusta la ruta si cal
import ParticipantSelector from '../participants/ParticipantSelector';
import IconParticipants from '../../icons/iconParticipants';
import './ProjecteParticipants.css';

export default function ProjecteParticipants({  
  user,
  projecte, 
  onUpdateParticipants 
}) {
  const [participants, setParticipants] = useState(projecte?.participants || [user?.uid]);
  const { documents: allUsers, loading } = useCollection('participants');

  useEffect(() => {
    setParticipants(projecte?.participants || [user?.uid]);
  }, [user, projecte]);

  const handleParticipantsChange = (participants) => {
    setParticipants(participants);
    //console.log("Participants actualitzats:", participants);
  };

  return (
    <div className="participants-modal">
      <label className='bordered'>
              <h4>Participants&nbsp;&nbsp;&nbsp;
                <small><IconParticipants/> {participants.length} &nbsp; &nbsp;
                        {/*<IconDespesa/> {((quantia/participantsDespesa.length).toFixed(2))}€*/}
                </small>
              </h4>
              <ParticipantSelector
                        participantsRef={allUsers}
                        projectParticipants={participants}
                        selected={participants}
                        onChange={handleParticipantsChange}
                      />
            </label>
    </div>
  );
}
