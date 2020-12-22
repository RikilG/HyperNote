import Button from "./Button";

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
    dialogBox: {
        display: "inline-block",
        background: "var(--backgroundAccent)",
        borderRadius: "0.3rem",
        padding: "1rem",
        margin: "auto",
        zIndex: "11",
    },
    header: {
        textAlign: "center",
        paddingBottom: "1rem",
    },
    buttons: {
        display: "flex",
        flexFlow: "row wrap",
        // justifyContent: "space-evenly",
        justifyContent: "flex-end",
    },
};

export const showDialog = (onAccept, onReject, onCancel, setDialog) => {
    setDialog({
        visible: true,
        onAccept: onAccept,
        onReject: onReject,
        onCancel: onCancel,
    });
};

export const hideDialog = (setDialog) => {
    setDialog({ visible: false });
};

const Dialog = (props) => {
    let accept = props.accept || props.config.accept || "Yes";
    let reject = props.reject || props.config.reject || "No";

    const noAction = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div>
            {props.config.visible && (
                <div style={style.backDrop} onClick={props.config.onCancel}>
                    <div style={style.dialogBox} onClick={noAction}>
                        <div style={style.header}>{props.children}</div>
                        <div style={style.buttons}>
                            <Button onClick={props.config.onAccept}>
                                {accept}
                            </Button>
                            <Button onClick={props.config.onReject}>
                                {reject}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dialog;
