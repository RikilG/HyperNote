const style = {
    container: {
        display: "flex",
    },
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
        borderRadius: "0.3rem",
        padding: "0.5rem",
        zIndex: "11",
        position: "fixed",
        right: "0",
        left: "0",
        bottom: "0",
        top: "0",
        margin: "auto",
    },
    header: {
        textAlign: "center",
        paddingBottom: "1rem",
    },
}

const Modal = (props) => {

    // const noAction = (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    // }

    return (
        <div style={style.container}>
            <div style={style.backDrop}></div>
            <div style={style.modalBox}>
                {props.children}
            </div>
        </div>
    );
}

export default Modal;