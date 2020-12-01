import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSync } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import Tooltip from '../../ui/Tooltip';
import PomodoroPage from './PomodoroPage';
import PomodoroTask from './PomodoroTask';
import WindowContext from '../../WindowContext';
import { openDatabase } from '../../Database';
import UserPreferences from '../../settings/UserPreferences';
import { createDb, listRows, addRow } from './PomodoroDB';

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

const Pomodoro = () => {
    let [ taskList, setTaskList ] = useState(['Task1', 'Task2', 'Task3']);
    const { openWindow } = useContext(WindowContext);
    const db = openDatabase(UserPreferences.get('pomoStorage'));

    createDb(db, () => listRows(db));

    // useEffect(() => { // on unmount
    //     return () => {
    //         db.close();
    //     }
    // }, []);

    const handleNewTask = () => {
        addRow(db, {name: "newTask", desc: ""}, (err) => {
            if (err) return;
            setTaskList([...taskList, "newTask"]);
        });
    }

    const handleTaskOpen = (e) => {
        let name = e.currentTarget.getAttribute('task');
        let id = `pomodoro/${name}`
        let task = {
            addon: "pomodoro",
            name: name,
            id: id,
            page: undefined,
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
    }

    const handleRefresh = () => {
        listRows(db, setTaskList);
    }

    return (
        <div style={style.container}>
            <div style={style.header}>Tasks</div>
            <div style={style.controls}>
                <div style={style.controlItem} onClick={handleNewTask}>
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
            <div style={style.taskList}>
                {
                    taskList.map((task) => <PomodoroTask key={task} onClick={handleTaskOpen} task={task} />)
                }
            </div>
        </div>
    );
}

export default Pomodoro;