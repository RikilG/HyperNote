import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";

import "./Pomodoro.css";
import PomodoroPage from "./PomodoroPage";
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

const PomodoroTask = (props) => {
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
        props.handleDelete(props.taskItem);
    };

    const handleConfirm = (newName) => {
        props.handleEdit(props.taskItem, newName);
        setTextbox(false);
    };

    const handleCancel = (newName, type) => {
        if (type === "click") {
            handleConfirm(newName);
            return "";
        }
        return props.taskItem.name;
    };

    const handleTaskOpen = () => {
        if (textbox) return; // rename textbox is open
        const taskItem = props.taskItem;
        let id = `pomodoro/${taskItem.name}-${taskItem.id}`;
        let task = {
            // this task is the running task in window, not the pomodoro task!!
            addon: "pomodoro",
            id: id,
            page: undefined,
            taskItem: taskItem,
            running: false,
        };
        task.page = <PomodoroPage winObj={task} />;
        openWindow(task, true, async (winObj) => {
            if (winObj.id !== id) {
                // other than current open window
                if (winObj.running === true) {
                    // if pomodoro is running
                    toast("Pomodoro in progress, Reset to change");
                    return false;
                } else {
                    return true; // open new window
                }
            }
        });
        props.setOpenTask(task);
    };

    return (
        <>
            <div
                style={style.container}
                className="hover-item"
                onClick={handleTaskOpen}
                ref={setContextMenuRef}
            >
                {textbox ? (
                    <Textbox
                        initialValue={props.taskItem.name}
                        visible={textbox}
                        setVisible={setTextbox}
                        handleConfirm={handleConfirm}
                        handleCancel={handleCancel}
                    />
                ) : (
                    <div style={style.title}>{props.taskItem.name}</div>
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
            <ContextMenu bounds={bounds} menu={contextMenuOptions} />
        </>
    );
};

export default PomodoroTask;
