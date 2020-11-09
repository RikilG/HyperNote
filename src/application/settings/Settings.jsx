import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useState } from 'react';

import Dialog, { showDialog, hideDialog } from '../ui/Dialog';
import Appearance from './Appearance';
import Core from './Core';
import Modal from '../ui/Modal';
import UserPreferences from './UserPreferences';

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
    category: {
        padding: "0.4rem 0.2rem",
        fontSize: "1.2rem",
        borderBottom: "1px solid var(--primaryColor)",
        cursor: "pointer",
    },
    activeCategory: {
        background: "var(--primaryColor)",
    },
    categoryOptions: {
        padding: "0.5rem",
        flex: "1",
    },
    resetDefaults: {
        color: "red",
        fontSize: "1rem",
        padding: "0.4rem 1rem",
        fontWeight: "bold",
        cursor: "pointer",
        borderTop: "1px solid var(--primaryColor)",
    }
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
        toast.warning('Application restart required', { autoClose: false });
    }

    return (
        <Modal>
            <div style={style.container}>
                <div style={style.categories}>
                    {categories.map((category, ind) => {
                        let customStyle;
                        if (category === currentCategory) customStyle = {...style.category, ...style.activeCategory};
                        else customStyle = style.category;
                        return <div key={ind} value={category} style={customStyle} onClick={setCategory}>
                        {category}
                        </div>;
                    })}
                    <div style={{display: "flex", flexFlow: "column", justifyContent: "flex-end", flex: "1"}}>
                        <div style={style.resetDefaults} onClick={handleDialog}>Reset Defaults</div>
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