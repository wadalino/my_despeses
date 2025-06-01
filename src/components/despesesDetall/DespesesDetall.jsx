import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onGetDespesa } from '../../firebase/firebase';
import './DespesesDetall.css';
import useUsernameByUid from '../../hooks/useUsernameByUid';
import useParticipantsMap from '../../hooks/useParticipantsMap';

export default function DespesesDetall({ id: propId }) {
  const { id: paramId } = useParams();
  const id = propId || paramId;

  const [despesa, setDespesa] = useState(null);

  useEffect(() => {
    const unsubscribe = onGetDespesa(id, (docSnap) => {
      if (docSnap.exists()) {
        setDespesa({ ...docSnap.data(), id: docSnap.id });
      } else {
        setDespesa(null);
      }
    });
    return () => unsubscribe();
  }, [id]);

  // Crida dels hooks SEMPRE, independentment de l'estat de despesa
  const { username: usernamePagador, loading: loadingPagador } = useUsernameByUid(despesa?.pagatPer);
  const { participantsMap, loading: loadingParticipants } = useParticipantsMap();

  const nomsParticipants = despesa?.participants
    ?.map(uid => participantsMap.get(id) || id)
    .join(', ');

  if (!despesa) return <p>Despesa no trobada...</p>;

  return (
    <div className='despesa-detall'>
      

      <p className='despesa-detall__item'>
        <strong>Concepte:</strong> {despesa.concepte}
      </p>

      <p className='despesa-detall__item'>
        <strong>Quantia:</strong> {despesa.quantia}€
      </p>

      <p className='despesa-detall__item'>
        <strong>Pagar per:</strong> {loadingPagador ? 'Carregant...' : usernamePagador || despesa.pagatPer}
      </p>

      <p className='despesa-detall__item'>
        <strong>Participants:</strong> {loadingParticipants ? 'Carregant...' : nomsParticipants || 'Cap'}
      </p>

      <p className='despesa-detall__item'>
        <strong>Preu per participant:</strong> {
          despesa.participants?.length
            ? (despesa.quantia / despesa.participants.length).toFixed(2)
            : despesa.quantia
        }
      </p>
    </div>
  );
}
