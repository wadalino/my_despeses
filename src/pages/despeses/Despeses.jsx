import { useState, useEffect } from 'react';

import DespesesLlista from '../../components/despesesLlista/DespesesLlista';
import Modal from '../../components/modal/Modal';
import DespesaForm from '../../components/despesaForm/DespesaForm';

import { onGetCollection, deleteDespesa, saveDespesa } from '../../firebase/firebase';
import { useCollection } from '../../hooks/useCollection';

export default function Despeses(props) {
    if (!props) {
        //console.log ("No hi ha projecte o usuari autenticat.", 
        //    "\nprojecte",props.projecte, 
        //    "usuariAutenticat", props.usuariAutenticat);
        return <div>No hi ha projecte o usuari autenticat.</div>;
    }
    const { projecte, usuariAutenticat } = props;
    //console.log("Despeses (usuari):", getAuth().currentUser?.uid);
    //console.log("Despeses (usuari):", usuariAutenticat); 
    // const [user, setUser] = useState(usuariAutenticat);
    const [mostraModal, setMostraModal] = useState(false);
    // const [despeses, setDespeses] = useState(null);

    const { documents: despeses } = useCollection('despeses');
    
    const projecteId = projecte?.id || null; // si no té projecte, es deixa a null
    // const projecte = projecte || null; // si no té projecte, es deixa a null

    // useEffect(() => {
    //     const unsubscribe = onGetCollection("despeses", (querySnapshot) => {
    //         let resultats = [];

    //         querySnapshot.forEach((doc) => {
    //             resultats.push({ ...doc.data(), id: doc.id });
    //         });

    //         console.log(resultats);
    //         setDespeses(resultats);
    //     });
    //     return () => unsubscribe();
    // }, []);

    const afegirDespesa = (despesa) => {
        // FIXME: una despesa ha de tenir un projecte associat
        console.log("afegirDespesa:", despesa);
        saveDespesa(despesa)
            .then((idDespesa) => {
                despesa.id = idDespesa;
                despesa.projecteId = projecteId || null; // si no té projecte, es deixa a null
                return [despesa];
            });
        setMostraModal(false);
    };

    const eliminarDespesa = (id) => {
        deleteDespesa(id);
    }

    const handleTancar = () => {
        setMostraModal(false);
    }

    
    //console.log("Despeses Projecte (nom):", projecte.name);
    //console.log("Despeses Projecte (id):", usuariAutenticat);
    return (
        <div>
            <div>
                <button onClick={() => setMostraModal(true)}>Afegir Despesa</button>
            </div>
            {despeses && <DespesesLlista despeses={despeses} eliminarDespesa={eliminarDespesa} projecte={projecte}/>}
            {mostraModal && <Modal handleTancar={handleTancar} esVorera={"tancar"}>
                <DespesaForm afegirDespesa={afegirDespesa} usuariAutenticat={usuariAutenticat} projecte={projecte} />
            </Modal>}
            
        </div>
    )
}
