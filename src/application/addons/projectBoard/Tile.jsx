import { useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "../../ui/Tooltip";
import Modal from "../../ui/Modal";
import CheckList from "./CheckList";
import Textarea from "../../ui/Textarea";
import Textbox from "../../ui/Textbox";
import ContextMenu from "../../ui/ContextMenu";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

const style = {
    container: {
        margin: "1px 5px",
        display: "flex",
        flexFlow: "column nowrap",
        flexDirection: "column",
    },
    title: {
        fontSize: "1.7rem",
        padding: "0.5rem 0",
        textAlign: "left",
        fontSize: "20px",
        color: "var(--secondaryTextColor)",
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
        padding: "15px 10px",
        textAlign: "left",
        fontSize: "16px",
        marginBottom: "0.2rem",
        marginRight: "-0.3rem",
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

const Tile = (props) => {
    let [showModal, setShowModal] = useState(false);
    let [setContextMenuRef, bounds] = useHookWithRefCallback();
    const childRef = useRef();
    const contextMenuOptions = [
        {
            name: "Follow Link",
            icon: faExternalLinkAlt,
            action: () => {},
        },
    ];
    return (
        <Modal onExit={props.onExit}>
            <div style={style.container}>
                <Textbox
                    initialValue={"Tile " + props.tileID}
                    disabled={true}
                    style={style.title}
                />
                <Textarea
                    placeholder={"Additional Information"}
                    initialValue={props.initialValue}
                    style={style.textarea}
                />
                <Textbox style={style.dateContainer} placeholder={"Date"} />
                <div
                    onClick={() => setShowModal((prev) => !prev)}
                    style={style.checklistButton}
                >
                    Checkbox
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
                                tileID={2} //should not be hardcoded
                                onExit={() => setShowModal((prev) => !prev)}
                            />
                        </div>
                    )}
                </div>
                <div ref={setContextMenuRef}>
                    <Textbox
                        style={style.linkContainer}
                        placeholder={"Link to Folder"}
                    />
                    <ContextMenu bounds={bounds} menu={contextMenuOptions} />
                </div>
            </div>
        </Modal>
    );
};

export default Tile;
