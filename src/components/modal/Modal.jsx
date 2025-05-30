import ReactDOM from 'react-dom';
import './Modal.css';

export default function Modal({children, handleTancar, esVorera, modalNameClass, title}) {
  return ReactDOM.createPortal((
    <div className={`modal-fons ${modalNameClass}-fons`}>
        <div className={`modal ${modalNameClass}`} style={
            {
                border: "4px solid",
                borderColor: esVorera ? "#ff4500" : "#555",
                textAlign: "center"
            }
        }>
         {/* Capçalera amb títol i botó de tancar */}
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          <button className="modal-close" onClick={handleTancar}>×</button>
        </div>
 
            {children}

        </div>
    </div>
  ), document.body)
}
