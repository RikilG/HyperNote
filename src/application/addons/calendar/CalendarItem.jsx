import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useCallback } from "react";

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
    let [setContextMenuRef, bounds] = useHookWithRefCallback();

    const contextMenuOptions = [
        {
            name: "edit",
            icon: faPen,
            action: () => handleEdit(event),
        },
        {
            name: "delete",
            icon: faTrash,
            action: () => handleDelete(event),
        },
    ];

    const handleEventClick = () => {};

    return (
        <>
            <div
                style={style.container}
                className="hover-item"
                onClick={handleEventClick}
                ref={setContextMenuRef}
            >
                <div style={style.title}>{event.title}</div>
                <div className="hover-item-toolbar">
                    <div
                        className="hover-item-tool"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(event);
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
            </div>
            <ContextMenu bounds={bounds} menu={contextMenuOptions} />
        </>
    );
};

export default CalendarItem;
