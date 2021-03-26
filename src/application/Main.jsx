import React, { useState } from "react";
import SplitPane from "react-split-pane";
import Pane from "react-split-pane/lib/Pane";

import Navbar, { navbarWidth } from "./navspace/Navbar";
import Navspace from "./navspace/Navspace";
import Workspace from "./workspace/Workspace";

import "react-toastify/dist/ReactToastify.css";
import "./css/AppStyle.css";
import "./css/SplitPane.css";
import { WindowContextWrapper } from "./WindowContext";

const Main = () => {
    let [activeAddon, setActiveAddon] = useState("search");
    let [navbarActive, setNavbarActive] = useState(true);

    const handleAddonChange = (addon) => {
        if (!navbarActive) {
            setNavbarActive(true);
        }
        setActiveAddon(addon);
    };

    return (
        <WindowContextWrapper>
            <div
                style={{
                    display: "flex",
                    flexFlow: "row nowrap",
                    height: "100%",
                }}
            >
                <div style={{ width: `${navbarWidth}px` }}>
                    <Navbar
                        navbarActive={navbarActive}
                        setNavbarActive={setNavbarActive}
                        changeSelection={handleAddonChange}
                    />
                </div>
                <SplitPane split="vertical">
                    {navbarActive && (
                        <Pane minSize="120px" maxSize="50%" initialSize="180px">
                            <Navspace addon={activeAddon} />
                        </Pane>
                    )}
                    <Pane minSize="50px">
                        <Workspace />
                    </Pane>
                </SplitPane>
            </div>
        </WindowContextWrapper>
    );
};

export default Main;
