import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useCallback } from "react";

import Textbox from "../../ui/Textbox";
import ContextMenu from "../../ui/ContextMenu";

const style = {
    container: {
        position: "relative",
        margin: "0.15rem",
        padding: "0.25rem",
        borderRadius: "0.3rem",
        cursor: "pointer",
    },
};

function useHookWithRefCallback() {
    // for the original useHookWIthRefCallback, go here:
    // https://gist.github.com/thebuilder/fb07c989093d4a82811625de361884e7
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

const CalendarItem = ({ handleDelete, handleEdit, event }) => {
    let [textbox, setTextbox] = useState(false);
    let [setContextMenuRef, bounds] = useHookWithRefCallback();

    const contextMenuOptions = [
        {
            name: "rename",
            icon: faPen,
            action: () => setTextbox(true),
        },
        {
            name: "delete",
            icon: faTrash,
            action: () => handleDelete(),
        },
    ];

    const handleConfirm = (newName) => {
        handleEdit(event, newName);
        setTextbox(false);
    };

    const handleCancel = (newName, type) => {
        if (type === "click") {
            handleConfirm(newName);
            return "";
        }
        return event.title;
    };

    const handleEventClick = () => {
        if (textbox) return; // rename textbox is open
    };

    return (
        <>
            <div
                style={style.container}
                className="hover-item"
                onClick={handleEventClick}
                ref={setContextMenuRef}
            >
                {textbox ? (
                    <Textbox
                        initialValue={event.title}
                        visible={textbox}
                        setVisible={setTextbox}
                        handleConfirm={handleConfirm}
                        handleCancel={handleCancel}
                    />
                ) : (
                    <div style={style.title}>{event.title}</div>
                )}
                {!textbox && (
                    <div className="hover-item-toolbar">
                        <div
                            className="hover-item-tool"
                            onClick={(e) => {
                                e.stopPropagation();
                                setTextbox(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faPen} />
                        </div>
                        <div
                            className="hover-item-tool"
                            onClick={(e) => {
                                if (e) e.stopPropagation();
                                handleDelete(event);
                            }}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </div>
                    </div>
                )}
            </div>
            <ContextMenu bounds={bounds} menu={contextMenuOptions} />
        </>
    );
};

export default CalendarItem;
