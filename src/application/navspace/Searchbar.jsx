import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import Textbox from '../ui/Textbox';

let style = {
    container: {
        margin: "5px 5px",
        display: "flex",
        flexFlow: "row nowrap",
    },
}

const Searchbar = () => {
    return (
        <div style={style.container}>
            <FontAwesomeIcon icon={faSearch} style={{marginTop: "2px", marginRight: "5px"}} />
            <Textbox placeholder=" Search " />
        </div>
    );
}

export default Searchbar;