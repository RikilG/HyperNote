import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSync } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState, useEffect } from "react";

import Tooltip from "../../ui/Tooltip";
import Textbox from "../../ui/Textbox";
import PomodoroTask from "./PomodoroTask";
import WindowContext from "../../WindowContext";
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

    const createNewTask = (taskName) => {
        const taskItem = {
            name: taskName,
            desc: "",
            duration: 25,
            tickingSound: true,
            ringingSound: true,
        };
        addRow(taskItem, (err) => {
            if (err) return;
            listRows(setTaskList);
            setTextbox(false);
        });
        return ""; // make the textbox empty
    };

    const handleRefresh = () => {
        listRows(setTaskList);
    };

    const handleDelete = (taskItem) => {
        deleteRow(taskItem.id, (err) => {
            if (err) return;
            // close the window if open
            if (openTask && openTask.taskItem.id === taskItem.id) {
                closeWindow(openTask);
                setOpenTask(null);
            }
            // TODO: re-fetching complete list is heavy. instead remove one from taskList directly
            // look at closeWindow function for info on how to get index
            listRows(setTaskList);
        });
    };

    const handleEdit = (taskItem, newName) => {
        taskItem.name = newName;
        editRow(taskItem, (err) => {
            if (err) return;
            // TODO: re-fetching complete list is heavy. instead edit one from taskList directly
            // look at closeWindow function for info on how to get index
            listRows(setTaskList);
        });
    };

    useEffect(() => {
        createDb(() => listRows(setTaskList));
    }, []); // on mount and unmount only

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
            <div style={style.pomodoroItems}>
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
        </div>
    );
};

export default PomodoroNav;
