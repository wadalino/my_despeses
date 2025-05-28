import ReactDOM from 'react-dom';
import './Modal.css';

export default function Modal({children, handleTancar, esVorera}) {
  return ReactDOM.createPortal((
    <div className="modal-fons">
        <div className="modal" style={
            {
                border: "4px solid",
                borderColor: esVorera ? "#ff4500" : "#555",
                textAlign: "center"
            }
        }>
            {children}
            <button onClick={handleTancar} className={esVorera ? "boto-vorera" : ""}>Tancar</button>
        </div>
    </div>
  ), document.body)
}
