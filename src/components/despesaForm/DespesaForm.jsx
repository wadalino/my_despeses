import { useState } from 'react';
import './DespesaForm.css'

export default function DespesaForm({ afegirDespesa }) {

  const [concepte, setConcepte] = useState("");
  const [quantia, setQuantia] = useState("");
  const [pagatPer, setPagatPer] = useState("");

  const resetForm = () => {
    setConcepte("");
    setQuantia("");
    setPagatPer("");
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // {concepte: "dinar", quantia: 30.55, pagatPer: "Pere", id: 1}

    const despesa = {
      concepte: concepte,
      quantia: quantia,
      pagatPer: pagatPer,
      id: Math.floor(Math.random() * 1000)
    }

    console.log(despesa);

    afegirDespesa(despesa);
    resetForm();
  };

  return (
    <form className='despesa-form' onSubmit={handleSubmit}>
        <label>
            <span>Concepte</span>
            <input type="text" onChange={(e) => setConcepte(e.target.value)} value={concepte} />
        </label>
        <label>
            <span>Quantia</span>
            <input type="text" onChange={(e) => setQuantia(e.target.value)} value={quantia} />
        </label>
        <label>
            <span>Pagat per</span>
            <select onChange={(e) => {setPagatPer(e.target.value)}}>
              <option value="joan">Joan</option>
              <option value="anna">Anna</option>
              <option value="pere">Pere</option>
              <option value="ines">Inés</option>
            </select>
        </label>
        <button>Afegir</button>
    </form>
  )
}
