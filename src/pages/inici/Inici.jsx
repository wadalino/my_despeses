import { useState, useEffect } from 'react';

import DespesesLlista from '../../components/despesesLlista/DespesesLlista';
import Modal from '../../components/modal/Modal';
import DespesaForm from '../../components/despesaForm/DespesaForm';

import { onGetCollection, deleteDespesa, saveDespesa } from '../../firebase/firebase';
import { useCollection } from '../../hooks/useCollection';

export default function Inici() {
    const [mostraModal, setMostraModal] = useState(false);
    // const [despeses, setDespeses] = useState(null);

    const { documents: despeses } = useCollection('despeses');

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
        console.log("afegirDespesa:", despesa);
        // setDespeses((despesesPrevies) => {

             saveDespesa(despesa)
                 .then((idDespesa) => {
                     despesa.id = idDespesa;

        //             if (!despesesPrevies) {
                         return [despesa];
        //             } else {
        //                 return [...despesesPrevies, despesa];
        //             }
                 })
        // }
        // );
        setMostraModal(false);
    };

    const eliminarDespesa = (id) => {
         //setDespeses((despesesPrevies) => {

             deleteDespesa(id)

         //})
    }

    const handleTancar = () => {
        setMostraModal(false);
    }

    return (
        <div>
            <h1>Inici</h1>
            {despeses && <DespesesLlista despeses={despeses} eliminarDespesa={eliminarDespesa} />}
            {mostraModal && <Modal handleTancar={handleTancar} >
                <DespesaForm afegirDespesa={afegirDespesa} />
            </Modal>}
            <div>
                <button onClick={() => setMostraModal(true)}>Afegir Despesa</button>
            </div>
        </div>
    )
}
