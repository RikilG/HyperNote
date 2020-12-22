import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import Textbox from "../../ui/Textbox";

const style = {
    container: {
        width: "100%",
    },
};

const Searchbar = () => {
    return (
        <div style={style.container}>
            <FontAwesomeIcon icon={faSearch} style={{ margin: "5px" }} />
            <Textbox placeholder=" Search " />
        </div>
    );
};

export default Searchbar;
