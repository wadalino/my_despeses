import './Titol.css';

export default function Titol({titol, subtitol}) {

  return (
    <div className='titol-component'>
        <h1 className="titol">{titol}</h1>
        <br />
        <h2 className="subtitol">{subtitol}</h2>
    </div>
  )
}
