import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

import './Pomodoro.css';
import Textbox from '../../ui/Textbox';

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
    let [ textbox, setTextbox ] = useState(false);

    const handleDelete = (e) => {
        e.stopPropagation();
        props.handleDelete(props.taskItem)
    }

    const handleConfirm = (newName) => {
        props.handleEdit(props.taskItem, newName);
        setTextbox(false);
    }

    const handleCancel = (newName, type) => {
        if (type === 'click') {
            handleConfirm(newName);
            return "";
        }
        return props.taskItem.name;
    }

    return (
        <div style={style.container} className="hover-item" onClick={props.onClick} taskid={props.taskItem.id}>
            {
                textbox 
                ? <Textbox
                    initialValue={props.taskItem.name}
                    visible={textbox}
                    setVisible={setTextbox}
                    handleConfirm={handleConfirm}
                    handleCancel={handleCancel}
                    />
                : <div style={style.title}>{props.taskItem.name}</div>
            }
            {
                (!textbox) && 
                <div className="hover-item-toolbar">
                    <div className="hover-item-tool" onClick={(e) => {e.stopPropagation(); setTextbox(true);}}>
                            <FontAwesomeIcon icon={faPen} />
                    </div>
                    <div className="hover-item-tool" onClick={handleDelete}>
                        <FontAwesomeIcon icon={faTrash} />
                    </div>
                </div>
            }
        </div>
    );
}

export default PomodoroTask;