import './css/modal.css';

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div style={{ display: "flex", justifyContent: 'center' }}>
        {children}
        </div>
        <br/>
        <br/>
        <div style={{ display: "flex", justifyContent: 'center' }}>
        <button color="primary" outline type="button" onClick={handleClose}> Close </button>
        </div>
      </section>
    </div>
  );
};

export default Modal;