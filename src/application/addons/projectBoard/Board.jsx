import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import Textbox from "../../ui/Textbox";
import Tooltip from "../../ui/Tooltip";
import Tile from "./Tile";
import { listTiles, addTileRow, editBoard, editTileBoard } from "./ProjectDB";

const style = {
    container: {
        margin: "1px 5px",
        display: "flex",
        flexFlow: "column nowrap",
        borderStyle: "groove",
        borderRadius: "0.3rem",
        width: "11rem",
    },
    titlebar: {
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "space-between",
        paddingBottom: "0.2rem",
    },
    renameIcon: {
        padding: "5px 0px",
        position: "relative",
        right: "1rem",
    },
    addIcon: {
        padding: "5px 2px",
        marginRight: "2px",
    },
    boardTitleGroup: {
        display: "flex",
        flexFlow: "row nowrap",
    },
    boardTitle: {
        textAlign: "left",
        fontSize: "20px",
        color: "var(--secondaryTextColor)",
        width: "80%",
    },
    title: {
        display: "flex",
        margin: "2px 0px",
        textAlign: "left",
        fontSize: "20px",
        color: "var(--primaryTextColor)",
    },
    boardTile: {},
};

const Board = ({ boardObj, tileDeleted, setTileDeleted }) => {
    let [showModal, setShowModal] = useState(false);
    let [newTile, setNewTile] = useState(false);
    let [choice, setChoice] = useState(null);
    let [tiles, setTiles] = useState([]);
    let [titleEdit, setTitleEdit] = useState(false);
    const createNewTile = (tilename) => {
        let d = new Date();
        const tileItem = {
            id: null,
            boardID: boardObj.id,
            name: tilename,
            desc: "",
            dueDate: d.toString(),
            link: "",
        };
        addTileRow(tileItem, (err) => {
            if (err) return;
            listTiles(setTiles, boardObj.id);
        });
    };
    const onDrop = (e) => {
        let data = e.dataTransfer.getData("text");
        e.dataTransfer.clearData();
        let [type, id] = data.split("-");
        if (type === "Tile") {
            editTileBoard({ boardID: boardObj.id, id: id }, (err) => {
                if (err) return;
                setTileDeleted((x) => (x + 1) % 100003); //Need to find better way to make parent refresh
            });
        }
    };
    const handleNameChange = (name) => {
        boardObj.name = name;
        setTitleEdit(false);
        editBoard(boardObj);
    };

    useEffect(() => {
        listTiles(setTiles, boardObj.id);
    }, [showModal, boardObj.id, tileDeleted]);

    return (
        <div
            onDrop={onDrop}
            onDragOver={(e) => {
                e.preventDefault();
            }}
            style={style.container}
        >
            <div style={style.titlebar}>
                <div
                    id={"Board-" + boardObj.id}
                    draggable={true}
                    onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", e.target.id);
                    }}
                    style={style.boardTitleGroup}
                >
                    <Textbox
                        placeholder={"Board " + boardObj.id}
                        initialValue={boardObj.name}
                        disabled={!titleEdit}
                        containerStyle={style.boardTitle}
                        style={{
                            background: "var(--primaryColor)",
                            width: "100%",
                        }}
                        handleConfirm={handleNameChange}
                    />
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            setTitleEdit(true);
                        }}
                        style={style.renameIcon}
                    >
                        <Tooltip value="Rename" position="mouse">
                            <FontAwesomeIcon icon={faPen} />
                        </Tooltip>
                    </div>
                </div>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setNewTile(true);
                    }}
                    style={style.addIcon}
                >
                    <Tooltip value="Add" position="mouse">
                        <FontAwesomeIcon icon={faPlus} />
                    </Tooltip>
                </div>
            </div>
            {tiles.map((tileObj) => (
                <div
                    id={"Tile-" + tileObj.id}
                    draggable={true}
                    key={tileObj.id}
                    style={style.boardTile}
                    onClick={() => {
                        setChoice(tileObj);
                        setShowModal(true);
                    }}
                    onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", e.target.id);
                    }}
                >
                    <Textbox
                        initialValue={tileObj.name}
                        disabled={true}
                        containerStyle={style.title}
                    />
                </div>
            ))}
            {newTile && (
                <Textbox
                    style={{ margin: "1px 5px" }}
                    handleConfirm={(e) => {
                        createNewTile(e);
                        setNewTile(false);
                    }}
                />
            )}
            {showModal && (
                <Tile
                    onExit={() => setShowModal((prev) => !prev)}
                    tileObj={choice}
                />
            )}
        </div>
    );
};

export default Board;
