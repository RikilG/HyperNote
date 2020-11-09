import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

import Appearance from './Appearance';
import Modal from '../ui/Modal';

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
}

const Settings = (props) => {
    let categories = ['Appearance', 'Editor', 'About'];
    let [currentCategory, setCurrentCategory] = useState(categories[0]);

    const setCategory = (e) => {
        setCurrentCategory(e.target.getAttribute('value'));
    }

    const loadCurrentCategory = () => {
        switch (currentCategory) {
            case "Appearance": return <Appearance />;
            default: return <div>Comming Soon!</div>;
        }
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
                </div>
                <div style={style.categoryOptions}>{loadCurrentCategory()}</div>
            </div>
            <FontAwesomeIcon style={style.closeButton} icon={faTimes} onClick={props.onExit} />
        </Modal>
    );
}

export default Settings;