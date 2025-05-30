import React from 'react'
import { useRef } from 'react';
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Modal from '../modal/Modal'
import DespesesDetall from '../despesesDetall/DespesesDetall.jsx'
import DespesaForm from '../despesaForm/DespesaForm'

import estils from './DespesesLlista.module.css'
import { getAuth } from 'firebase/auth';

function getRandomRGBA(alpha = 0.15) {
  const r = Math.floor(Math.random() * 256);   // 0-255
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;   // alpha = transparència
}

export default function DespesesLlista({ despeses, eliminarDespesa, projecte }) {
    // console.log("DespesesLlista projecteId:", projecte?.id);
    const [despesaActiva, setDespesaActiva] = useState(null);
    const [despesaActivaEdit, setDespesaActivaEdit] = useState(null);
    // Filtra les despeses segons el projecteId (si es passa)
    const despesesFiltrades = projecte.id
        ? despeses.filter(d => d.projecteId === projecte.id)
        : despeses;
    const refs = useRef({}); 
    const handleObrirDespesa = (id) => {
    const element = refs.current[id];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Remarcar visualment la despesa seleccionada
            element.classList.add('despesa-focus');

            // Eliminar el remarcat després de 2 segons
            setTimeout(() => {
            element.classList.remove('despesa-focus');
            }, 2000);
        }
    };
    // console.log("DespesesLlista despesesFiltrades:", despesesFiltrades);

    return (
        <div>
            <ul className="despeses-llista">
                <ul className="despeses-labels">
                {despesesFiltrades.map(d => (
                    <li
                    key={d.id}
                    ref={el => refs.current[d.id] = el}
                    className="despesa-label"
                    onClick={() => handleObrirDespesa(d.id)}
                    >
                    {d.concepte} <span className="quantia">{d.quantia}€</span>
                    </li>
                ))}
                </ul>
            </ul>
            {despesesFiltrades.length === 0 && (
                <p>No hi ha despeses per aquest projecte.</p>
            )}
            {despesesFiltrades.map((despesa, index) => (
                <div className={estils.targeta} key={despesa.id} style={{backgroundColor: getRandomRGBA(0.1)}}>
                    {/*<Link to={`/despesa/${despesa.id}`}>*/}
                        <h2 style={{color: '#a5a5a5'}}>
                            {despesa.concepte}&nbsp; 
                            <span style={{color: '#c5c5c5', fontSize: '0.8em'}}>
                                - {despesa.participants.length}&nbsp;
                            </span>
                        </h2>
                    {/*</Link>*/}
                    <p></p>
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
                    <DespesaForm despesa={despesaActivaEdit} 
                        usuariAutenticat={getAuth().currentUser?.uid} 
                        projecte={projecte} />
                    
                    {/*<DespesaForm 
                        afegirDespesa={afegirDespesa}  
                        
                        projecte={projecte} />*/}
                </Modal>
            )}

            
                            
            
        </div>
    );
}

