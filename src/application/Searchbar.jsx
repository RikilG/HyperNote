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
        display: "inline",
        flex: "1",
        minWidth: "20px",
    },
}

export default class Searchbar extends React.Component {
    render() {
        return (
            <div style={style.container}>
                <FontAwesomeIcon icon={faSearch} style={{marginTop: "2px", marginRight: "5px"}} />
                <input type="text" style={style.bar} placeholder="Search" />
            </div>
        );
    }
}