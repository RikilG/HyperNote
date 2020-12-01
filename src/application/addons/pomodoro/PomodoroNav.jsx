import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSync } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import Tooltip from '../../ui/Tooltip';
import Textbox from '../../ui/Textbox';
import PomodoroPage from './PomodoroPage';
import PomodoroTask from './PomodoroTask';
import WindowContext from '../../WindowContext';
import { openDatabase } from '../../Database';
import UserPreferences from '../../settings/UserPreferences';
import { createDb, listRows, addRow, deleteRow } from './PomodoroDB';

const style = {
    container: {
        height: "100%",
        padding: "0.2rem",
    },
    header: {
        fontSize: "2rem",
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
    taskList: {
        display: "flex",
        flexFlow: "column nowrap",
    },
};

const PomodoroNav = () => {
    let [ taskList, setTaskList ] = useState([]);
    let [ textbox, setTextbox ] = useState(false);
    let [ openTask, setOpenTask ] = useState(null); // currently open pomo task
    const { openWindow, closeWindow } = useContext(WindowContext);
    const db = openDatabase(UserPreferences.get('pomoStorage'));

    createDb(db, () => listRows(db));

    const createNewTask = (taskName) => {
        const taskItem = {
            name: taskName,
            desc: "<Enter description here>",
        }
        addRow(db, taskItem, (err) => {
            if (err) return;
            setTaskList([...taskList, taskItem]);
            setTextbox(false);
        });
        return ""; // make the textbox empty
    }

    const handleTaskOpen = (e) => {
        let taskId = parseInt(e.currentTarget.getAttribute('taskid'));
        let taskItem = undefined;
        for (let i in taskList) {
            if (taskList[i].id === taskId) {
                taskItem = taskList[i];
                break;
            }
        }
        let id = `pomodoro/${taskItem.name}-${taskItem.id}`;
        let task = { // this task is the running task in window, not the pomodoro task!!
            addon: "pomodoro",
            id: id,
            page: undefined,
            taskItem: taskItem,
            running: false,
        }
        task.page = <PomodoroPage winObj={task} />;
        openWindow(task, true, async (winObj) => {
            if (winObj.id !== id) { // other than current open window
                if (winObj.running === true) { // if pomodoro is running
                    toast("Pomodoro in progress, Reset to change")
                    return false;
                }
                else {
                    return true; // open new window
                }
            }
        });
        setOpenTask(task);
    }

    const handleRefresh = () => {
        listRows(db, setTaskList);
    }

    const handleDelete = (taskItem) => {
        deleteRow(db, taskItem.id, (err) => {
            if (err) return;
            // close the window if open
            if (openTask && openTask.taskItem.id === taskItem.id) {
                closeWindow(openTask);
                setOpenTask(null);
            }
            // TODO: re-fetching complete list is heavy. instead remove one from taskList directly
            // look at closeWindow function for info
            listRows(db, setTaskList);
        })
    }

    useEffect(() => { // on mount and unmount
        listRows(db, setTaskList);
        return () => {
            db.close();
        }
    }, []);

    return (
        <div style={style.container}>
            <div style={style.header}>Tasks</div>
            <div style={style.controls}>
                <div style={style.controlItem} onClick={() => setTextbox(true)}>
                    <Tooltip value="Add" position="bottom">
                        <FontAwesomeIcon icon={faPlus}  />
                    </Tooltip>
                </div>
                <div onClick={handleRefresh} style={style.controlItem}>
                    <Tooltip  value="Refresh" position="bottom">
                        <FontAwesomeIcon icon={faSync}  />
                    </Tooltip>
                </div>
            </div>
            <Textbox
                visible={textbox}
                setVisible={setTextbox}
                handleConfirm={createNewTask}
                handleCancel={() => setTextbox(false)}
                placeholder=" New Task "
            />
            <div style={style.taskList}>
                {
                    taskList.map((taskItem) => <PomodoroTask key={`${taskItem.name}-${taskItem.id}`} onClick={handleTaskOpen} taskItem={taskItem} handleDelete={handleDelete} />)
                }
            </div>
        </div>
    );
}

export default PomodoroNav;