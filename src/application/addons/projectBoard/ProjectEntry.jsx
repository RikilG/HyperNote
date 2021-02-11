import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState, useRef, useCallback } from "react";

import "./Project.css";
import ProjectPage from "./ProjectPage";
import Textbox from "../../ui/Textbox";
import ContextMenu from "../../ui/ContextMenu";
import WindowContext from "../../WindowContext";

const style = {
    container: {
        position: "relative",
        margin: "0.15rem",
        padding: "0.25rem",
        borderRadius: "0.3rem",
        cursor: "pointer",
    },
};

function useHookWithRefCallback() {
    // for the original useHookWIthRefCallback, go here:
    // https://gist.github.com/thebuilder/fb07c989093d4a82811625de361884e7
    const [bounds, setBounds] = useState({});
    const ref = useRef(null);
    const setRef = useCallback((node) => {
        if (node) {
            setBounds(node.getBoundingClientRect());
        }

        ref.current = node;
    }, []);

    return [setRef, bounds];
}

const ProjectEntry = (props) => {
    let [textbox, setTextbox] = useState(false);
    let [setContextMenuRef, bounds] = useHookWithRefCallback();
    const { openWindow } = useContext(WindowContext);

    const contextMenuOptions = [
        {
            name: "rename",
            icon: faPen,
            action: () => setTextbox(true),
        },
        {
            name: "delete",
            icon: faTrash,
            action: () => handleDelete(),
        },
    ];

    const handleDelete = (e) => {
        if (e) e.stopPropagation();
        props.handleDelete(props.projectItem);
    };

    const handleConfirm = (newName) => {
        props.handleEdit(props.projectItem, newName);
        setTextbox(false);
    };

    const handleCancel = (newName, type) => {
        if (type === "click") {
            handleConfirm(newName);
            return "";
        }
        return props.projectItem.name;
    };

    const handleProjectOpen = () => {
        if (textbox) return;
        const projectItem = props.projectItem;
        let id = `project/${projectItem.name}-${projectItem.id}`;
        let project = {
            addon: "project",
            id: id,
            page: undefined,
            projectItem: projectItem,
            running: false,
        };
        project.page = (
            <ProjectPage winObj={project} projectID={projectItem.id} />
        );
        openWindow(project, true, async (winObj) => {
            if (winObj.id !== id) {
                if (winObj.running === true) {
                    return false;
                } else {
                    return true; // open new window
                }
            }
        });
        props.setOpenProject(project);
    };

    return (
        <>
            <div
                style={style.container}
                className="hover-item"
                onClick={handleProjectOpen}
                ref={setContextMenuRef}
            >
                {textbox ? (
                    <Textbox
                        initialValue={props.projectItem.name}
                        visible={textbox}
                        setVisible={setTextbox}
                        handleConfirm={handleConfirm}
                        handleCancel={handleCancel}
                    />
                ) : (
                    <div style={style.title}>{props.projectItem.name}</div>
                )}
                {!textbox && (
                    <div className="hover-item-toolbar">
                        <div
                            className="hover-item-tool"
                            onClick={(e) => {
                                e.stopPropagation();
                                setTextbox(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faPen} />
                        </div>
                        <div className="hover-item-tool" onClick={handleDelete}>
                            <FontAwesomeIcon icon={faTrash} />
                        </div>
                    </div>
                )}
            </div>
            {<ContextMenu bounds={bounds} menu={contextMenuOptions} />}
        </>
    );
};

export default ProjectEntry;
