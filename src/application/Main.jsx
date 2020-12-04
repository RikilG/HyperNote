import React, { useState } from "react";
import SplitPane from "react-split-pane";
import Pane from "react-split-pane/lib/Pane";

import Navbar from "./navspace/Navbar";
import Navspace from "./navspace/Navspace";
import Workspace from "./workspace/Workspace";

import "react-toastify/dist/ReactToastify.css";
import "./css/AppStyle.css";
import "./css/SplitPane.css";
import { WindowContextWrapper } from "./WindowContext";

const Main = () => {
    let [activeAddon, setActiveAddon] = useState("explorer");

    return (
        <WindowContextWrapper>
            <div
                style={{
                    display: "flex",
                    flexFlow: "row nowrap",
                    height: "100%",
                }}
            >
                <div style={{ width: "35px" }}>
                    <Navbar changeSelection={setActiveAddon} />
                </div>
                <SplitPane split="vertical">
                    <Pane
                        minSize="120px"
                        maxSize="50%"
                        initialSize="180px"
                    >
                        <Navspace addon={activeAddon} />
                    </Pane>
                    <Pane minSize="50px">
                        <Workspace />
                    </Pane>
                </SplitPane>
            </div>
        </WindowContextWrapper>
    );
};

export default Main;
