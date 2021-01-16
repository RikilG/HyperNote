import { useEffect, useState } from "react";
import WindowBar from "../../workspace/WindowBar";
import Tooltip from "../../ui/Tooltip";
import Tile from "./Tile";

const style = {
    container: {
        // background: "#FF4030",
        background: "var(--backgroundColor)",
        height: "100%",
        padding: "0 0.5rem",
    },
    title: {
        margin: "0.2rem",
        fontSize: "1.5rem",
        fontWeight: "bold",
        textAlign: "center",
    },
    description: {
        height: "25%",
        maxHeight: "25%",
        fontSize: "1.1rem",
        textAlign: "center",
    },
};

const ProjectPage = (props) => {
    const projectItem = props.winObj.projectItem;
    let [showModal, setShowModal] = useState(false);
    return (
        <div style={style.container}>
            <WindowBar winObj={props.winObj} title={"Project"} />
            <div style={style.title}>{projectItem.name}</div>
            <button onClick={() => setShowModal(true)} />
            {showModal && (
                <Tile onExit={() => setShowModal((prev) => !prev)} tileID={2} />
            )}
        </div>
    );
};

export default ProjectPage;
