import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Modal from '../modal/Modal'
import ProjectesDetall from './ProjectesDetall'
import ProjecteForm from '../projectes/ProjecteForm'

import estils from '../despesesLlista/DespesesLlista.module.css'
import '../despesesLlista/DespesesLlista.css';

function getRandomRGBA(alpha = 0.15) {
  const r = Math.floor(Math.random() * 256);   // 0-255
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;   // alpha = transparència
}

export default function ProjectesLlista({ 
    projectes, eliminarProjecte }) 
    {
    const [projecteActiu, setProjecteActiu] = useState(null);
    const [projecteActiuEdit, setProjecteActiuEdit] = useState(null);

    console.log("ProjectesLlista projectes:", projectes);
    return (
        <div>
            {
                projectes.map((projecte, index) => (
                    <div className={estils.targeta} key={projecte.id} style={{backgroundColor: getRandomRGBA(0.1)}}>
                        <Link to={`/projecte/${projecte.id}`}>
                            <h2 style={{color: '#a5a5a5'}}>{projecte.concepte}</h2>
                        </Link>
                        <p>{projecte.description}</p>
                        <button onClick={() => setProjecteActiu(projecte.id)} style={{backgroundColor: 'rgba(146, 112, 209, 0.4)', color: '#c5c5c5'}}>
                            Detalls</button>
                        <button onClick={() => setProjecteActiuEdit(projecte)} style={{backgroundColor: 'rgba(200, 255, 0, 0.3)', color: '#c5c5c5'}}>
                            Editar</button>
                        <button onClick={() => eliminarProjecte(projecte.id)} style={{backgroundColor: 'rgba(255, 69, 0, 0.4)', color: '#c5c5c5'}}>
                            Eliminar</button>
                    </div>
                ))
            }

            {projecteActiu && (
                <Modal handleTancar={() => setProjecteActiu(null)} esVorera={""}>
                    <ProjectesDetall id={projecteActiu} />
                </Modal>
            )}
            {projecteActiuEdit && (
                <Modal handleTancar={() => setProjecteActiuEdit(null)} esVorera={""}>
                    <ProjecteForm projecte={projecteActiuEdit} />
                </Modal>
            )}
        </div>
    );
}

