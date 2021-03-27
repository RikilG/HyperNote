import { toast } from "react-toastify";
import { useState } from "react";

import Button from "../ui/Button";
import Textbox from "../ui/Textbox";
import UserPreferences from "../storage/UserPreferences";
import FileSystem from "../storage/FileSystem";

const style = {
    container: {
        fontSize: "1.2rem",
    },
    header: {
        fontSize: "1.7rem",
        padding: "0.4rem 0",
    },
    subheader: {
        fontSize: "1.5rem",
        padding: "0.3rem 0",
    },
    button: {
        margin: "1% 3%",
        display: "inline-block",
        background: "var(--primaryColor)",
    },
    textbox: {
        background: "var(--backgroundColor)",
        margin: "0.6rem 1.2rem",
        padding: "0.2rem 1rem",
    },
};

const Core = (props) => {
    let [noteStorage, setNoteStorage] = useState(
        UserPreferences.get("noteStorage")
    );

    const handleStorageChange = () => {
        FileSystem.browseFolder()
            .then((response) => {
                if (response.cancelled) return noteStorage; // the old path
                return response.filePaths[0];
            })
            .then((path) => {
                if (typeof path === "undefined") return;
                else if (typeof path !== "string") {
                    toast.error("Invalid path encountered. Please try again!");
                } else if (path !== noteStorage) {
                    // new path selected
                    setNoteStorage(path);
                    UserPreferences.set("noteStorage", path);
                    toast("Storage path updated");
                    toast.warning(
                        "Application restart required ('Reload App' from settings)",
                        { autoClose: false }
                    );
                }
            });
    };

    return (
        <div style={style.container}>
            <div style={style.header}>Core</div>
            <div style={style.subheader}>Storage</div>
            <div style={{ display: "flex" }}>
                <Textbox
                    initialValue={noteStorage}
                    style={style.textbox}
                    disabled={true}
                />
                <Button style={style.button} onClick={handleStorageChange}>
                    Change
                </Button>
            </div>
        </div>
    );
};

export default Core;
