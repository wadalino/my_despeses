import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { onGetDespesa } from '../../firebase/firebase'

export default function DespesesDetall() {

    const { id } = useParams();
    const [despesa, setDespesa] = useState(null);

    useEffect(()=> {
        const unsubscribe = onGetDespesa(id, (docSnap)=> {
            if(docSnap.exists()) {
                setDespesa({...docSnap.data(), id:docSnap.id})
            } else {
                setDespesa(null);
            }
        });
        return ()=> unsubscribe();
    }, [id]);

    if(!despesa) return <p>Despesa no trobada...</p>

  return (
    <div>
        <h2>Detall de la despesa</h2>
        <p><strong>Concepte:</strong>{despesa.concepte}</p>
        <p><strong>Quantia:</strong>{despesa.quantia}€</p>
        <p><strong>Pagar per:</strong>{despesa.pagatPer}</p>
    </div>
  )
}
