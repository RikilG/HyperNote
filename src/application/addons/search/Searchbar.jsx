import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import Textbox from '../../ui/Textbox';

const Searchbar = () => {
    return (
        <div>
            <FontAwesomeIcon icon={faSearch} style={{margin: "5px"}} />
            <Textbox placeholder=" Search " />
        </div>
    );
}

export default Searchbar;