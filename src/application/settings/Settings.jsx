import { toast } from "react-toastify";
import { useContext, useState } from "react";

import Dialog from "../ui/Dialog";
import Appearance from "./Appearance";
import Core from "./Core";
import Modal from "../ui/Modal";
import StorageContext from "../storage/StorageContext";
import "../css/Settings.css";

const style = {
    container: {
        fontSize: "1.5rem",
        display: "flex",
        flexFlow: "row, nowrap",
        height: "100%",
    },
    categories: {
        display: "flex",
        flexFlow: "column",
        width: "25%",
        height: "100%",
        borderRight: "3px solid var(--primaryColor)",
    },
    categoryOptions: {
        padding: "0.5rem",
        flex: "1",
    },
};

const Settings = (props) => {
    const { userPreferences } = useContext(StorageContext);
    let categories = ["Appearance", "Core", "Editor", "About"];
    let [currentCategory, setCurrentCategory] = useState(categories[0]);
    const [dialog, setDialog] = useState({
        visible: false,
        onAccept: () => {},
        onReject: () => {},
        onCancel: () => {},
    });

    const handleDialog = () => {
        setDialog({
            visible: true,
            onAccept: () => {
                handleResetDefaults();
            },
            onReject: () => {},
            onCancel: () => {},
        });
    };

    const setCategory = (e) => {
        setCurrentCategory(e.target.getAttribute("value"));
    };

    const loadCurrentCategory = () => {
        switch (currentCategory) {
            case "Appearance":
                return <Appearance />;
            case "Core":
                return <Core />;
            default:
                return <div>Comming Soon!</div>;
        }
    };

    const handleResetDefaults = () => {
        userPreferences.resetDefaults();
        props.onExit();
        toast.warning(
            'Application restart required ("Reload App" from settings)',
            { autoClose: false }
        );
    };

    const handleReload = () => {
        if (window.isElectron) {
            window.require("electron").remote.getCurrentWindow().reload();
        }
    };

    return (
        <Modal onExit={props.onExit}>
            <div style={style.container}>
                <div style={style.categories}>
                    {categories.map((category, ind) => {
                        let customStyle = "category";
                        if (category === currentCategory)
                            customStyle += " active";
                        return (
                            <div
                                key={ind}
                                value={category}
                                className={customStyle}
                                onClick={setCategory}
                            >
                                {category}
                            </div>
                        );
                    })}
                    <div
                        style={{
                            display: "flex",
                            flexFlow: "column",
                            justifyContent: "flex-end",
                            flex: "1",
                        }}
                    >
                        <div className="warnCategory" onClick={handleDialog}>
                            Reset Defaults
                        </div>
                        <div className="warnCategory" onClick={handleReload}>
                            Reload App
                        </div>
                    </div>
                </div>
                <div style={style.categoryOptions}>{loadCurrentCategory()}</div>
            </div>
            <Dialog config={dialog} setDialog={setDialog}>
                Reset defaults?
            </Dialog>
        </Modal>
    );
};

export default Settings;
