import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const style = {
    backDrop: {
        display: "flex",
        background: "var(--backgroundColor)",
        opacity: "0.7",
        backdropFilter: "blur(8px)",
        position: "absolute",
        right: "0",
        left: "0",
        bottom: "0",
        top: "0",
        zIndex: "10",
    },
    modalBox: {
        width: "75%",
        height: "70%",
        transform: "translateY(2.5%)",
        background: "var(--backgroundAccent)",
        borderRadius: "0.4rem",
        padding: "0.5rem",
        zIndex: "11",
        position: "fixed",
        right: "0",
        left: "0",
        bottom: "0",
        top: "0",
        margin: "auto",
    },
    closeButton: {
        position: "absolute",
        top: "0.4rem",
        right: "0.5rem",
        cursor: "pointer",
        padding: "0.5rem",
    },
};

const Modal = ({ children, onExit }) => {
    return (
        <div>
            <div style={style.backDrop}></div>
            <div style={style.modalBox}>
                {children}
                <div onClick={onExit} style={style.closeButton}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
            </div>
        </div>
    );
};

export default Modal;
