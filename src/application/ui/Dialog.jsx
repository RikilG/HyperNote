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

/*
props.config:
- onAccept: func
- onReject: func
- onCancel: func
- visible: boolean
- message: text
- accept: text to show on accept button
- reject: text to show on reject button

props.setDialog: for visible and invisible setting
*/

const Dialog = (props) => {
    let accept = props.accept || props.config.accept || "Yes";
    let reject = props.reject || props.config.reject || "No";

    const noAction = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const acceptHandler = () => {
        if (props.config.onAccept) props.config.onAccept();
        props.setDialog({ ...props.config, visible: false });
    };

    const rejectHandler = () => {
        if (props.config.onReject) props.config.onReject();
        props.setDialog({ ...props.config, visible: false });
    };

    const cancelHandler = () => {
        if (props.config.onCancel) props.config.onCancel();
        props.setDialog({ ...props.config, visible: false });
    };

    return (
        <div>
            {props.config.visible && (
                <div style={style.backDrop} onClick={cancelHandler}>
                    <div style={style.dialogBox} onClick={noAction}>
                        <div style={style.header}>
                            {props.config.message || props.children}
                        </div>
                        <div style={style.buttons}>
                            <Button onClick={acceptHandler}>{accept}</Button>
                            <Button onClick={rejectHandler}>{reject}</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dialog;
