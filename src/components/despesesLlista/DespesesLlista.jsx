import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Modal from '../modal/Modal'
import DespesesDetall from '../despesesDetall/DespesesDetall'
import DespesaForm from '../despesaForm/DespesaForm'

import estils from './DespesesLlista.module.css'

function getRandomRGBA(alpha = 0.15) {
  const r = Math.floor(Math.random() * 256);   // 0-255
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;   // alpha = transparència
}

export default function DespesesLlista({ despeses, eliminarDespesa }) {
    const [despesaActiva, setDespesaActiva] = useState(null);
    const [despesaActivaEdit, setDespesaActivaEdit] = useState(null);

    return (
        <div>
            {
                despeses.map((despesa, index) => (
                    <div className={estils.targeta} key={despesa.id} style={{backgroundColor: getRandomRGBA(0.1)}}>
                        <Link to={`/despesa/${despesa.id}`}>
                            <h2 style={{color: '#a5a5a5'}}>{despesa.concepte}</h2>
                        </Link>
                        <p>{despesa.description}</p>
                        <button onClick={() => setDespesaActiva(despesa.id)} style={{backgroundColor: 'rgba(146, 112, 209, 0.4)', color: '#c5c5c5'}}>
                            Detalls</button>
                        <button onClick={() => setDespesaActivaEdit(despesa)} style={{backgroundColor: 'rgba(200, 255, 0, 0.3)', color: '#c5c5c5'}}>
                            Editar</button>
                        <button onClick={() => eliminarDespesa(despesa.id)} style={{backgroundColor: 'rgba(255, 69, 0, 0.4)', color: '#c5c5c5'}}>
                            Eliminar</button>
                    </div>
                ))
            }

            {despesaActiva && (
                <Modal handleTancar={() => setDespesaActiva(null)} esVorera={""}>
                    <DespesesDetall id={despesaActiva} />
                </Modal>
            )}
            {despesaActivaEdit && (
                <Modal handleTancar={() => setDespesaActivaEdit(null)} esVorera={""}>
                    <DespesaForm despesa={despesaActivaEdit} />
                </Modal>
            )}
        </div>
    );
}

