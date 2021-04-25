import { useContext } from "react";

import Textbox from "../ui/Textbox";
import StorageContext from "../storage/StorageContext";
import { ExplorerContext } from "../explorer/Explorer";
import { toast } from "react-toastify";

const style = {
    container: {
        margin: "0 5px 0 22px",
        display: "flex",
        flexFlow: "row nowrap",
    },
};

/*
Passable props:
- visible
- setVisible
- clickEvent
- path
*/

const TreeTextbox = (props) => {
    const { fileSystem } = useContext(StorageContext);
    const { refreshTree } = useContext(ExplorerContext);
    const path = props.path;

    const handleConfirm = (newName) => {
        if (newName && newName !== "") {
            if (props.clickEvent === "file") {
                fileSystem
                    .newFile(fileSystem.join(path, newName))
                    .then((data) => {
                        if (data && data.status !== 200) {
                            toast.error("Unable to create file");
                        } else {
                            toast("File created");
                            refreshTree(); // TODO: edit file tree, don't refresh
                        }
                    });
            } else {
                fileSystem
                    .newDirectory(fileSystem.join(path, newName))
                    .then((data) => {
                        if (data && data.status !== 200) {
                            toast.error("Unable to create directory");
                        } else {
                            toast("Directory created");
                            refreshTree(); // TODO: edit file tree, don't refresh
                        }
                    });
            }
        }
    };

    const handleCancel = (name) => {
        if (name !== "") {
            handleConfirm(name);
        }
    };

    const handleChange = (newName) => {
        if (props.clickEvent === "file" && newName.includes(".")) {
            let filename = newName;
            let splitstring = filename.split(".");
            let substring = splitstring[splitstring.length - 1];
            switch (substring) {
                case "txt":
                case "md":
                case "rtf":
                case "tex":
                case "csv":
                case "svg":
                case "rst":
                case "xml":
                case "ini":
                case "json":
                case "yml":
                case "asciidoc":
                    props.setVisible(false);
                    handleConfirm(filename);
                    // FileSystem.newFile(FileSystem.join(path, filename));
                    break;
                default:
            }
        }
    };

    //TODO: Bugfix to follow file naming conventions
    return (
        <Textbox
            containerStyle={style.container}
            visible={props.visible}
            setVisible={props.setVisible}
            handleChange={handleChange}
            handleConfirm={handleConfirm}
            handleCancel={handleCancel}
            placeholder={
                props.clickEvent === "file" ? "file name" : "folder name"
            }
        />
    );
};

export default TreeTextbox;
