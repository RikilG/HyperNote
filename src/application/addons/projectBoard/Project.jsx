import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify'

import Tooltip from '../../ui/Tooltip';
import ProjectPage from './ProjectPage';
import WindowContext from '../../WindowContext';

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
    projectList: {
        display: "flex",
        flexFlow: "column nowrap",
    },
    project: {
        margin: "0.15rem",
        padding: "0.25rem",
        borderRadius: "0.3rem",
        cursor: "pointer",
    }
};

const Project = (props) => {
    let [projectList, setProjectList] = useState(['Project1', 'Project2', 'Project3']);
    const { openWindow } = useContext(WindowContext);

    const handleNewProject = () => {
        setProjectList([...projectList, "newProject"]);
    }

    const handleProjectOpen = (e) => {
        let name = e.currentTarget.innerHTML;
        let id = `project/${name}`
        let project = {
            addon: "project",
            name: name,
            id: id,
            page: undefined,
            running: false,
        }
    }

    return (
        <div style={style.container}>
            <div style={style.header}>Projects</div>
            <div style={style.controls}>
                <Tooltip style={style.controlItem} value="Add" position="bottom">
                    <FontAwesomeIcon icon={faPlus} onClick={handleNewProject} />
                </Tooltip>
                <Tooltip style={style.controlItem} value="Edit" position="bottom">
                    <FontAwesomeIcon icon={faPen} />
                </Tooltip>
                <Tooltip style={style.controlItem} value="Delete" position="bottom">
                    <FontAwesomeIcon icon={faTrash} />
                </Tooltip>
            </div>
            <div style={style.projectList}>
                {
                    projectList.map((project) => <div key={project} style={style.project} className="tree-item" onClick={handleProjectOpen}>{project}</div>)
                }
            </div>
        </div>
    );
}

export default Project;