import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useState } from 'react';

import Dialog, { showDialog, hideDialog } from '../ui/Dialog';
import Appearance from './Appearance';
import Core from './Core';
import Modal from '../ui/Modal';
import UserPreferences from './UserPreferences';
import '../css/Settings.css';

const style = {
    closeButton: {
        position: "absolute",
        top: "1rem",
        right: "1rem",
        cursor: "pointer",
    },
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
}

const Settings = (props) => {
    let categories = ['Appearance', 'Core', 'Editor', 'About'];
    let [currentCategory, setCurrentCategory] = useState(categories[0]);
    const [dialog, setDialog] = useState({
        visible: false,
        onAccept: () => {},
        onReject: () => {},
        onCancel: () => {},
    });

    const handleDialog = () => {
        showDialog(
            () => {handleResetDefaults(); hideDialog(setDialog);}, // onAccept
            () => {hideDialog(setDialog);}, // onReject
            () => { hideDialog(setDialog);}, // onCancel
            setDialog, // pass the function which changes the dialog properties
        );
    }

    const setCategory = (e) => {
        setCurrentCategory(e.target.getAttribute('value'));
    }

    const loadCurrentCategory = () => {
        switch (currentCategory) {
            case "Appearance": return <Appearance />;
            case "Core": return <Core />;
            default: return <div>Comming Soon!</div>;
        }
    }

    const handleResetDefaults = () => {
        UserPreferences.resetDefaults();
        props.onExit();
        toast.warning('Application restart required ("Reload App" from settings)', { autoClose: false });
    }

    const handleReload = () => {
        if (window.isElectron) {
            window.require('electron').remote.getCurrentWindow().reload();
        }
    }

    return (
        <Modal>
            <div style={style.container}>
                <div style={style.categories}>
                    {categories.map((category, ind) => {
                        let customStyle = "category";
                        if (category === currentCategory) customStyle += " active";
                        return <div key={ind} value={category} className={customStyle} onClick={setCategory}>
                        {category}
                        </div>;
                    })}
                    <div style={{display: "flex", flexFlow: "column", justifyContent: "flex-end", flex: "1"}}>
                        <div className="warnCategory" onClick={handleDialog}>Reset Defaults</div>
                        <div className="warnCategory" onClick={handleReload}>Reload App</div>
                    </div>
                </div>
                <div style={style.categoryOptions}>{loadCurrentCategory()}</div>
            </div>
            <FontAwesomeIcon style={style.closeButton} icon={faTimes} onClick={props.onExit} />
            <Dialog config={dialog}>Reset defaults?</Dialog>
        </Modal>
    );
}

export default Settings;