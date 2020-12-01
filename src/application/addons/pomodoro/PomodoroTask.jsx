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
    title: {

    },
};

const PomodoroTask = (props) => {
    return (
        <div style={style.container} className="hover-item" onClick={props.onClick} task={props.task}>
            <div style={style.title}>{props.task}</div>
            <div className="hover-item-toolbar">
                <div className="hover-item-tool">
                        <FontAwesomeIcon icon={faPen} />
                </div>
                <div className="hover-item-tool">
                    <FontAwesomeIcon icon={faTrash} />
                </div>
            </div>
        </div>
    );
}

export default PomodoroTask;