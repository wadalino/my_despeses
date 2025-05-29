import { useState, useEffect } from 'react';

import DespesesLlista from '../../components/despesesLlista/DespesesLlista';
import Modal from '../../components/modal/Modal';
import DespesaForm from '../../components/despesaForm/DespesaForm';

import { onGetCollection, deleteDespesa, saveDespesa } from '../../firebase/firebase';
import { useCollection } from '../../hooks/useCollection';

export default function Despeses() {
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
        // FIXME: una despesa ha de tenir un projecte associat
        console.log("afegirDespesa:", despesa);
        saveDespesa(despesa)
            .then((idDespesa) => {
                despesa.id = idDespesa;
                return [despesa];
            });
            /*
            .then((novesDespeses) => {
                setDespeses((despesesPrevies) => {
                    return [...despesesPrevies, ...novesDespeses];
                });
            });*/
        setMostraModal(false);
    };

    const eliminarDespesa = (id) => {
        deleteDespesa(id);
    }

    const handleTancar = () => {
        setMostraModal(false);
    }

    console.log("Despeses:", despeses);
    console.log("Username:", localStorage.getItem('user'));
    return (
        <div>
            <h1>Inici</h1>
            {despeses && <DespesesLlista despeses={despeses} eliminarDespesa={eliminarDespesa} />}
            {mostraModal && <Modal handleTancar={handleTancar} esVorera={"tancar"}>
                <DespesaForm afegirDespesa={afegirDespesa} />
            </Modal>}
            <div>
                <button onClick={() => setMostraModal(true)}>Afegir Despesa</button>
            </div>
        </div>
    )
}
