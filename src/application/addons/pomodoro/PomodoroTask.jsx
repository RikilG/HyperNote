import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

import './Pomodoro.css';

const style = {
    container: {
        position: "relative",
        margin: "0.15rem",
        padding: "0.25rem",
        borderRadius: "0.3rem",
        cursor: "pointer",
    },
};

const PomodoroTask = (props) => {

    const handleDelete = (e) => {
        e.stopPropagation();
        props.handleDelete(props.taskItem)
    }

    return (
        <div style={style.container} className="hover-item" onClick={props.onClick} taskid={props.taskItem.id}>
            <div style={style.title}>{props.taskItem.name}</div>
            <div className="hover-item-toolbar">
                <div className="hover-item-tool">
                        <FontAwesomeIcon icon={faPen} />
                </div>
                <div className="hover-item-tool" onClick={handleDelete}>
                    <FontAwesomeIcon icon={faTrash} />
                </div>
            </div>
        </div>
    );
}

export default PomodoroTask;