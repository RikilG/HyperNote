import { useContext, useState } from "react";

import Dialog from "../ui/Dialog";
import Modal from "../ui/Modal";
import StorageContext from "../storage/StorageContext";

const style = {
    container: {
        display: "flex",
        flexFlow: "column nowrap",
        height: "100%",
    },
    subContainer: {
        padding: "0 1rem",
    },
    header: {
        fontSize: "1.5rem",
        padding: "0.5rem",
    },
    subheader: {
        fontSize: "1.2rem",
        padding: "0.2rem",
    },
    table: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        flex: "1",
    },
};

const Settings = (props) => {
    const { fileSystem, userPreferences } = useContext(StorageContext);
    const [dialog, setDialog] = useState({});

    const toggleDropboxConn = () => {
        setDialog({
            onAccept: () => {
                userPreferences.set("dropboxIntegration", true);
                fileSystem.dropboxInit();
            },
            onCancel: () => {},
            onReject: () => {},
            visible: true,
            message:
                "Connect to dropbox? You may be redirected to sign-in page to authorize Hypernote to connect to your cloud storage.",
        });
    };

    return (
        <Modal onExit={props.onExit}>
            <div style={style.container}>
                <div style={style.header}>Cloud Connections</div>
                <div style={style.subContainer}>
                    <div style={style.subheader}>Dropbox</div>
                    <div style={style.table}>
                        <div>Status</div>
                        <div onClick={toggleDropboxConn}>Not Connected</div>
                        <div>Sync</div>
                        <div>Inactive</div>
                    </div>
                </div>
                <div style={style.subContainer}>
                    <div style={style.subheader}>Google Drive</div>
                    <div style={style.table}>
                        <div>Status</div>
                        <div>Not Connected</div>
                        <div>Sync</div>
                        <div>Inactive</div>
                    </div>
                </div>
            </div>
            <Dialog config={dialog} setDialog={setDialog}>
                Reset defaults?
            </Dialog>
        </Modal>
    );
};

export default Settings;
