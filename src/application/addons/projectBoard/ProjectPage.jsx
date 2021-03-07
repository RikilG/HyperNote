import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import WindowBar from "../../workspace/WindowBar";
import Board from "./Board";
import { addBoard, listBoards, deleteTileRow, deleteBoard } from "./ProjectDB";
import Tooltip from "../../ui/Tooltip";

const style = {
    container: {
        background: "var(--backgroundColor)",
        height: "100%",
        padding: "0 0.5rem",
    },
    title: {
        margin: "0.2rem",
        fontSize: "1.5rem",
        fontWeight: "bold",
        textAlign: "center",
    },
    description: {
        height: "25%",
        maxHeight: "25%",
        fontSize: "1.1rem",
        textAlign: "center",
    },
    actionSpace: {
        display: "flex",
        flexFlow: "column nowrap",
    },
    topSpace: {
        display: "flex",
        flexFlow: "row nowrap",
    },
    deleteBox: {
        width: "10rem",
        height: "1.5rem",
        background: "#f05673",
        margin: "auto",
        border: "3px solid",
        borderRadius: "0.5rem",
        textAlign: "center",
        fontSize: "17px",
        paddingTop: "3px",
    },
    addIcon: {
        padding: "0.2rem 0.5rem",
        paddingRight: "1.2rem",
        height: "1rem",
        width: "0.1rem",
        background: "var(--primaryColor)",
        border: "2px solid",
    },
    boardArea: {
        display: "flex",
        flexFlow: "row nowrap",
        overflow: "auto",
        height: "29rem",
    },
    boardParentContainer: {
        width: "11rem",
        padding: "0.2rem 0.5rem",
    },
};

const ProjectPage = (props) => {
    let winObj = props.winObj;
    let [boards, setBoards] = useState([]);
    const [dummy, setDummy] = useState(0);
    const projectItem = winObj.projectItem;
    const createNewBoard = () => {
        const boardItem = {
            id: null,
            projectID: props.projectID,
            name: "",
        };
        addBoard(boardItem, (err) => {
            if (err) return;
            listBoards(setBoards, props.projectID);
        });
    };

    const onDrop = (e) => {
        let data = e.dataTransfer.getData("text");
        e.dataTransfer.clearData();
        let [type, id] = data.split("-");
        if (type === "Tile") {
            deleteTileRow(id, (err) => {
                if (err) return;
                setDummy((x) => (x + 1) % 100003);
            });
        } else if (type === "Board") {
            deleteBoard(id, (err) => {
                if (err) return;
                listBoards(setBoards, props.projectID);
            });
        }
    };

    useEffect(() => {
        listBoards(setBoards, props.projectID);
    }, [props.projectID]);

    return (
        <div style={style.container}>
            <WindowBar winObj={winObj} title={"Project"} />
            <div style={style.actionSpace}>
                <div style={style.topSpace}>
                    <div
                        onDrop={onDrop}
                        onDragOver={(e) => {
                            e.preventDefault();
                        }}
                        style={style.deleteBox}
                    >
                        Delete Box
                    </div>
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            createNewBoard();
                        }}
                        style={style.addIcon}
                    >
                        <Tooltip value="Add Board" position="mouse">
                            <FontAwesomeIcon icon={faPlus} />
                        </Tooltip>
                    </div>
                </div>
                <div style={style.title}>{projectItem.name}</div>
                <div style={style.boardArea}>
                    {boards.map((boardObj) => (
                        <div
                            key={boardObj.id}
                            style={style.boardParentContainer}
                        >
                            <Board
                                boardObj={boardObj}
                                tileDeleted={dummy}
                                setTileDeleted={setDummy}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectPage;
