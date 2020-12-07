import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faSync,
    faPen,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState, useEffect, useRef } from "react";

import Tooltip from "../../ui/Tooltip";
import Textbox from "../../ui/Textbox";
import PomodoroTask from "./PomodoroTask";
import WindowContext from "../../WindowContext";
import { openDatabase } from "../../Database";
import ContextMenu from "../../ui/ContextMenu";
import UserPreferences from "../../settings/UserPreferences";
import { createDb, listRows, addRow, deleteRow, editRow } from "./PomodoroDB";

const style = {
    container: {
        height: "100%",
        padding: "0.2rem",
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexFlow: "column",
    },
    header: {
        fontSize: "1.5rem",
        padding: "0.2rem 0.6rem",
        color: "var(--primaryColor)",
    },
    controls: {
        margin: "0 0.2rem",
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "space-evenly",
        borderTop: "2px solid var(--dividerColor)",
        borderBottom: "2px solid var(--dividerColor)",
    },
    controlItem: {
        padding: "0.3rem",
        cursor: "pointer",
    },
    pomodoroItems: {
        flex: "10",
    },
};

const PomodoroNav = () => {
    let [taskList, setTaskList] = useState([]);
    let [textbox, setTextbox] = useState(false);
    let [openTask, setOpenTask] = useState(null); // currently open pomo task
    const { closeWindow } = useContext(WindowContext);
    const contextMenuRef = useRef(null);
    const db = openDatabase(UserPreferences.get("pomoStorage"));

    const contextMenuOptions = [
        {
            name: "rename",
            icon: faPen,
            action: (target) => console.log("rename", target),
        },
        {
            name: "delete",
            icon: faTrash,
            action: (target) => console.log("delete", target),
        },
    ];

    createDb(db, () => listRows(db));

    const createNewTask = (taskName) => {
        const taskItem = {
            name: taskName,
            desc: "",
        };
        addRow(db, taskItem, (err) => {
            if (err) return;
            listRows(db, setTaskList);
            setTextbox(false);
        });
        return ""; // make the textbox empty
    };

    const handleRefresh = () => {
        listRows(db, setTaskList);
    };

    const handleDelete = (taskItem) => {
        deleteRow(db, taskItem.id, (err) => {
            if (err) return;
            // close the window if open
            if (openTask && openTask.taskItem.id === taskItem.id) {
                closeWindow(openTask);
                setOpenTask(null);
            }
            // TODO: re-fetching complete list is heavy. instead remove one from taskList directly
            // look at closeWindow function for info on how to get index
            listRows(db, setTaskList);
        });
    };

    const handleEdit = (taskItem, newName) => {
        taskItem.name = newName;
        editRow(db, taskItem, (err) => {
            if (err) return;
            // TODO: re-fetching complete list is heavy. instead edit one from taskList directly
            // look at closeWindow function for info on how to get index
            listRows(db, setTaskList);
        });
    };

    const getContextMenuBounds = () => {
        if (!contextMenuRef.current) return {};
        return contextMenuRef.current.getBoundingClientRect();
    };

    useEffect(() => {
        // on mount and unmount
        listRows(db, setTaskList);
        return () => {
            db.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={style.container}>
            <div style={style.header}>Tasks</div>
            <div style={style.controls}>
                <div style={style.controlItem} onClick={() => setTextbox(true)}>
                    <Tooltip value="Add" position="bottom">
                        <FontAwesomeIcon icon={faPlus} />
                    </Tooltip>
                </div>
                <div style={style.controlItem} onClick={handleRefresh}>
                    <Tooltip value="Refresh" position="bottom">
                        <FontAwesomeIcon icon={faSync} />
                    </Tooltip>
                </div>
            </div>
            {textbox && (
                <Textbox
                    visible={textbox}
                    setVisible={setTextbox}
                    handleConfirm={createNewTask}
                    handleCancel={() => setTextbox(false)}
                    placeholder=" New Task "
                />
            )}
            <div style={style.pomodoroItems} ref={contextMenuRef}>
                {taskList.map((taskItem) => (
                    <div key={`${taskItem.id}`}>
                        <PomodoroTask
                            setOpenTask={setOpenTask}
                            taskItem={taskItem}
                            handleDelete={handleDelete}
                            handleEdit={handleEdit}
                        />
                        <div className="divider" />
                    </div>
                ))}
            </div>
            <ContextMenu
                bounds={getContextMenuBounds()}
                menu={contextMenuOptions}
            />
        </div>
    );
};

export default PomodoroNav;
