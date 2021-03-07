import { useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "../../ui/Tooltip";
import Modal from "../../ui/Modal";
import CheckList from "./CheckList";
import Textarea from "../../ui/Textarea";
import Textbox from "../../ui/Textbox";
import ContextMenu from "../../ui/ContextMenu";
import DatePicker from "../../ui/DatePicker";
import { editTileRow } from "./ProjectDB";

const style = {
    container: {
        margin: "1px 5px",
        display: "flex",
        flexFlow: "column nowrap",
        flexDirection: "column",
    },
    titleGroup: {
        display: "flex",
        flexFlow: "row nowrap",
    },
    title: {
        padding: "0.5rem 0",
        textAlign: "left",
        fontSize: "20px",
        color: "var(--secondaryTextColor)",
    },
    renameIcon: {
        padding: "5px 0px",
        position: "relative",
        right: "2rem",
    },
    textarea: {
        display: "block",
        marginBottom: "0.4rem",
        borderRadius: "4px",
        marginLeft: "0.3rem",
        width: "auto",
        height: "5rem",
        minHeight: "30px",
        maxHeight: "17.5rem",
        maxWidth: "97%",
        resize: "vertical",
        fontSize: "1.1rem",
        padding: "5px 10px",
        background: "var(--backgroundColor)",
        border: "2px solid",
    },
    dateContainer: {
        background: "var(--backgroundColor)",
        border: "2px solid",
        color: "var(--primaryTextColor)",
        padding: "15px 10px",
        textAlign: "left",
        marginBottom: "0.2rem",
        marginLeft: "0.3rem",
        cursor: "pointer",
        fontSize: "16px",
        borderRadius: "4px",
        width: "auto",
        display: "flex",
        flexFlow: "row nowrap",
    },
    checklistButton: {
        background: "var(--backgroundColor)",
        border: "2px solid",
        color: "var(--primaryTextColor)",
        padding: "15px 10px",
        textAlign: "left",
        marginBottom: "0.2rem",
        marginLeft: "0.3rem",
        cursor: "pointer",
        fontSize: "16px",
        borderRadius: "4px",
        width: "auto",
        display: "flex",
        justifyContent: "space-between",
        flexFlow: "row nowrap",
    },
    linkContainer: {
        background: "var(--backgroundColor)",
        border: "2px solid",
        padding: "15px 10px",
        textAlign: "left",
        fontSize: "16px",
        marginRight: "-0.3rem",
    },
    checklist: {
        marginBottom: "0.2rem",
        marginLeft: "0.3rem",
        borderRadius: "4px",
        maxHeight: "110px",
        overflowY: "scroll",
        //padding: "15px 10px",
    },
};

function useHookWithRefCallback() {
    const [bounds, setBounds] = useState({});
    const ref = useRef(null);
    const setRef = useCallback((node) => {
        if (node) {
            setBounds(node.getBoundingClientRect());
        }

        ref.current = node;
    }, []);

    return [setRef, bounds];
}

const Tile = ({ tileObj, onExit }) => {
    let [showModal, setShowModal] = useState(false);
    let [setContextMenuRef, bounds] = useHookWithRefCallback();
    let [titleEdit, setTitleEdit] = useState(false);
    const childRef = useRef();
    // TODO: code reduction with one handleChange(key, value) type function
    const handleNameChange = (name) => {
        tileObj.name = name;
        setTitleEdit(false);
        editTileRow(tileObj);
    };
    const handleDescChange = (desc) => {
        tileObj.desc = desc;
        editTileRow(tileObj);
    };
    const handleDateChange = (date) => {
        tileObj.dueDate = date.toString();
        editTileRow(tileObj);
    };
    const handleLinkChange = (link) => {
        tileObj.link = link;
        editTileRow(tileObj);
    };
    const contextMenuOptions = [
        {
            name: "Follow Link",
            icon: faExternalLinkAlt,
            action: () => {},
        },
    ];

    return (
        <Modal onExit={onExit}>
            <div style={style.container}>
                <div style={style.titleGroup}>
                    <Textbox
                        placeholder={"Tile " + tileObj.id}
                        initialValue={tileObj.name}
                        disabled={!titleEdit}
                        style={style.title}
                        handleConfirm={handleNameChange}
                    />
                    <div
                        style={style.renameIcon}
                        onClick={(e) => {
                            e.stopPropagation();
                            setTitleEdit(true);
                        }}
                    >
                        <Tooltip value="Rename Tile" position="mouse">
                            <FontAwesomeIcon icon={faPen} />
                        </Tooltip>
                    </div>
                </div>
                <Textarea
                    placeholder={"Additional Information"}
                    initialValue={tileObj.desc}
                    style={style.textarea}
                    handleCancel={handleDescChange}
                />
                {tileObj && (
                    <div style={style.dateContainer}>
                        Due Date:
                        <DatePicker
                            value={new Date(tileObj.dueDate)}
                            onChange={handleDateChange}
                        />
                    </div>
                )}
                <div
                    onClick={() => setShowModal((prev) => !prev)}
                    style={style.checklistButton}
                >
                    Checklist
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            childRef.current.createNewCheckbox();
                        }}
                    >
                        {showModal && (
                            <Tooltip value="Add" position="mouse">
                                <FontAwesomeIcon icon={faPlus} />
                            </Tooltip>
                        )}
                    </div>
                </div>
                <div style={style.checklist}>
                    {showModal && (
                        <div style={{ border: "2px solid" }}>
                            <CheckList
                                ref={childRef}
                                tileID={tileObj.id}
                                onExit={() => setShowModal((prev) => !prev)}
                            />
                        </div>
                    )}
                </div>
                <div ref={setContextMenuRef}>
                    <Textbox
                        style={style.linkContainer}
                        placeholder={"Link to Folder"}
                        initialValue={tileObj.link}
                        handleConfirm={handleLinkChange}
                    />
                    <ContextMenu bounds={bounds} menu={contextMenuOptions} />
                </div>
            </div>
        </Modal>
    );
};

export default Tile;
