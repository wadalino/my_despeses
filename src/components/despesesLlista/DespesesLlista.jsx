
import { useRef, useState } from 'react';
import Modal from '../modal/Modal'
import DespesesDetall from '../despesesDetall/DespesesDetall.jsx'
import DespesaForm from '../despesaForm/DespesaForm'

import estils from './DespesesLlista.module.css'
import { getAuth } from 'firebase/auth';
import { updateDespesa } from '../../firebase/firebase.js'

function getRandomRGBA(alpha = 0.15) {
    const r = Math.floor(Math.random() * 256);   // 0-255
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;   // alpha = transparència
}
import IconDespesa from '../../icons/iconDespesa.jsx';
import IconParticipants from '../../icons/iconParticipants.jsx';
import Badge from '../utils/Badge.jsx';

export default function DespesesLlista({ despeses, eliminarDespesa, projecte }) {
    // console.log("DespesesLlista projecteId:", projecte?.id);
    const [despesaActiva, setDespesaActiva] = useState(null);
    const [despesaActivaEdit, setDespesaActivaEdit] = useState(null);
    // Filtra les despeses segons el projecteId (si es passa)
    const despesesFiltrades = projecte.id
        ? despeses.filter(d => d.projecteId === projecte.id)
        : despeses;

    // agafam ref i feim scroll, també efecte de flash    
    const refs = useRef({});
    const handleObrirDespesa = (id) => {
        const element = refs.current[id];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            let count = 0;
            const maxFlashes = 3;

            const flashInterval = setInterval(() => {
                element.classList.add('despesa-focus');

                setTimeout(() => {
                    element.classList.remove('despesa-focus');
                }, 300); // tiempo del efecto

                count++;
                if (count >= maxFlashes) {
                    clearInterval(flashInterval);
                }
            }, 400); // cada cuánto se repite
        }
    };

    const actualitzarDespesa = (despesa) => {
            // FIXME: una despesa ha de tenir un projecte associat
            console.log("actualitzarDespesa:", despesa);
            saveDespesa(despesa)
                .then((idDespesa) => {
                    despesa.id = idDespesa;
                    despesa.projecteId = projecteId || null; // si no té projecte, es deixa a null
                    return [despesa];
                });
            setMostraModal(false);
        };

    // ordenam la llista per data de cració
    despesesFiltrades.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

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
                <div
                    className={estils.targeta}

                    key={despesa.id}
                    ref={el => refs.current[despesa.id] = el}
                    style={{
                        backgroundColor: getRandomRGBA(0.1),
                        position: 'relative'
                    }}
                >
                    <div style={{
                        fontSize: '0.7em',
                        backgroundColor: '#888',
                        border: '3px solid #555',
                        borderRadius: '5px',
                        position: 'absolute',
                        left: '-20px',
                        width: '160px', index: '100'
                    }}>
                        📅&nbsp;&nbsp;{despesa.createdAt.toDate().toLocaleString('ca-ES')}
                    </div>
                    <div style={{
                        fontSize: '0.7em',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: '1em',
                        padding: '5px',
                        border: '3px solid #aaaa00',
                        borderRightWidth: '0px',
                        borderTopWidth: '0px',
                        borderTopLeftRadius: '0px',
                        borderBottomLeftRadius: '10px',
                        borderTopRightRadius: '0px',
                        borderBottomRightRadius: '0px',
                        backgroundColor: '#aaaa0090',
                        position: 'absolute',
                        right: '0px',
                        top: '0px',
                        width: '120px', index: '110'
                    }}>
                        <IconDespesa />&nbsp;
                        {despesa.quantia.toFixed(2)}
                        €
                    </div>


                    <h2 style={{ color: '#a5a5a5' }}>
                        {despesa.concepte}&nbsp;
                    </h2>

                    <div className="despesa-line" style={{ paddingTop: '20px' }}>
                        <span style={{
                            fontSize: '1em',
                            padding: '15px',
                            backgroundColor: '#888',
                            border: '3px solid #555',
                            borderRadius: '5px'
                        }}>
                            &nbsp;
                            <span style={{
                                fontSize: '1.1em',
                                color: '#000',
                                padding: '5px',
                                border: '1px solid #aaaa00',
                                borderRadius: '5px',
                            }}>
                                <IconParticipants />&nbsp;
                                {despesa.participants.length}
                            </span>x
                            <span style={{
                                fontSize: '1.1em',
                                color: '#000',
                                padding: '5px',
                                border: '1px solid #aaaa00',
                                borderRadius: '5px',
                            }}>
                                <IconDespesa />&nbsp;
                                {(despesa.quantia / despesa.participants.length).toFixed(2)}
                                €
                            </span>


                        </span>


                    </div>
                    <div className="despesa-line">
                        <button onClick={() => setDespesaActiva(despesa.id)} style={{ backgroundColor: 'rgba(146, 112, 209, 0.4)', color: '#c5c5c5' }}>
                            Detalls
                        </button>
                        <button onClick={() => setDespesaActivaEdit(despesa)} style={{ backgroundColor: 'rgba(200, 255, 0, 0.3)', color: '#c5c5c5' }}>
                            Editar
                        </button>
                        <button onClick={() => eliminarDespesa(despesa.id)} style={{ backgroundColor: 'rgba(255, 69, 0, 0.4)', color: '#c5c5c5' }}>
                            Eliminar
                        </button>
                    </div>
                </div>
            ))}

            {despesaActiva && (
                <Modal handleTancar={() => setDespesaActiva(null)}
                    esVorera={""}
                    title={`detalls de la despesa '${despesaActiva.concepte}'`}>
                    <DespesesDetall id={despesaActiva} />
                </Modal>
            )}
            {despesaActivaEdit && (
                <Modal handleTancar={() => setDespesaActivaEdit(null)}
                    esVorera={""}
                    title={`editant la despesa '${despesaActivaEdit.concepte}'`}>
                    {console.log(updateDespesa)}
                    <DespesaForm
                        despesa={despesaActivaEdit}
                        usuariAutenticat={getAuth().currentUser?.uid}
                        projecte={projecte}
                        actualitzarDespesa={updateDespesa} 
                        
                        onSuccess={() => setDespesaActivaEdit(null)} // ✅ tanca el modal correctament
                        />

                    {/*<DespesaForm 
                        afegirDespesa={afegirDespesa}  
                        
                        projecte={projecte} />*/}
                </Modal>
            )}




        </div>
    );
}

