import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import UserPreferences from "../../settings/UserPreferences";
import Textbox from "../../ui/Textbox";
import Tooltip from "../../ui/Tooltip";
import Tile from "./Tile";
import { openDatabase } from "../../Database";
import {
    createTilesDb,
    listTileNames,
    addTileRow,
    editBoardRow,
    listBoardRows,
} from "./ProjectDB";

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

const Board = (props) => {
    let [showModal, setShowModal] = useState(false);
    let [newTile, setNewTile] = useState(false);
    let [choice, setChoice] = useState(null);
    let [tiles, setTiles] = useState([]);
    let [titleEdit, setTitleEdit] = useState(false);
    let [boardItem, setBoardItem] = useState({});
    const db = openDatabase(UserPreferences.get("projectStorage"));
    createTilesDb(db);
    const createNewTile = (tilename) => {
        let d = new Date();
        const tileItem = {
            id: null,
            boardID: props.boardID,
            name: tilename,
            desc: "",
            dueDate: d.toString(),
            link: "",
        };
        addTileRow(db, tileItem, (err) => {
            if (err) return;
            listTileNames(db, setTiles, props.boardID);
        });
    };
    const handleNameChange = (name) => {
        boardItem.name = name;
        setTitleEdit(false);
        editBoardRow(db, boardItem);
    };

    useEffect(() => {
        listTileNames(db, setTiles, props.boardID);
        listBoardRows(db, setBoardItem, props.boardID);
        return () => {
            db.close();
        };
    }, [showModal, props.boardID, props.tileDeleted]);

    return (
        <div style={style.container}>
            <div style={style.titlebar}>
                <div
                    id={"Board-" + props.boardID}
                    draggable={true}
                    onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", e.target.id);
                    }}
                    style={style.boardTitleGroup}
                >
                    <Textbox
                        placeholder={"Board " + props.boardID}
                        initialValue={boardItem.name}
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
            {tiles.map((listobj) => (
                <div
                    id={"Tile-" + listobj.id}
                    draggable={true}
                    key={listobj.id}
                    style={style.boardTile}
                    onClick={() => {
                        setChoice(listobj.id);
                        setShowModal(true);
                    }}
                    onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", e.target.id);
                    }}
                >
                    <Textbox
                        initialValue={listobj.name}
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
                    tileID={choice}
                />
            )}
        </div>
    );
};

export default Board;
