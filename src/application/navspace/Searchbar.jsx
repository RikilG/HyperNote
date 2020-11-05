import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';

let style = {
    container: {
        margin: "5px 5px",
        display: "flex",
        flexFlow: "row nowrap",
    },
    bar: {
        outline: "none",
        width: "20px",
        flex: "1",
        background: "var(--backgroundAccent)",
        padding: "2px",
        border: "0",
        borderRadius: "5px",
    },
}

const Searchbar = () => {
    return (
        <div style={style.container}>
            <FontAwesomeIcon icon={faSearch} style={{marginTop: "2px", marginRight: "5px"}} />
            <input type="text" style={style.bar} placeholder="Search" />
        </div>
    );
}

export default Searchbar;