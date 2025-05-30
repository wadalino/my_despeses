import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onGetProjecte, deleteProjecte } from '../../firebase/firebase';
import useUsernameByUid from '../../hooks/useUsernameByUid';
import useParticipantsMap from '../../hooks/useParticipantsMap';

import '../despesesDetall/DespesesDetall.css';

export default function ProjectesDetall({ id: propId }) {
  const { id: paramId } = useParams();
  const id = propId || paramId;

  const [projecte, setProjecte] = useState(null);

  useEffect(() => {
    const unsubscribe = onGetProjecte(id, (docSnap) => {
      if (docSnap.exists()) {
        setProjecte({ ...docSnap.data(), id: docSnap.id });
      } else {
        setProjecte(null);
      }
    });
    return () => unsubscribe();
  }, [id]);

  // Crida dels hooks SEMPRE, independentment de l'estat de projecte
  const { username: usernameOwner, loading: loadingOwner } = useUsernameByUid(projecte?.owner);
  const { participantsMap, loading: loadingParticipants } = useParticipantsMap();

  const nomsParticipants = projecte?.participants
    ?.map(uid => participantsMap.get(uid) || uid)
    .join(', ');

  if (!projecte) return <p>Projecte no trobat...</p>;

  return (
    <div className='despesa-detall'>
      <h2 className='despesa-detall__title'>Detall del projecte</h2>

      <p className='despesa-detall__item'>
        <strong>Nom del projecte:</strong> {projecte.name}
      </p>

      <p className='despesa-detall__item'>
        <strong>Descripció:</strong> {projecte.description}
      </p>

      <p className='despesa-detall__item'>
        <strong>Propietari:</strong> {loadingOwner ? 'Carregant...' : usernameOwner || usernameOwner}
      </p>
      <p className='despesa-detall__item'>
        <strong>Participants:</strong> {loadingParticipants ? 'Carregant...' : nomsParticipants || 'Cap'}
      </p>
      <p className='despesa-detall__item'>
        <strong>Participants:</strong> {projecte.participants?.length || 0 } participants
      </p>



    </div>
  );
}
