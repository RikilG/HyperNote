import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import CheckBox from "../../ui/CheckBox";
import Tooltip from "../../ui/Tooltip";
import {
    listChecklistRows,
    addChecklistRow,
    deleteChecklistRow,
    editChecklistRow,
} from "./ProjectDB";

const style = {
    container: {
        margin: "1px 5px",
        display: "flex",
        flexFlow: "column nowrap",
    },
    checkboxGroup: {
        display: "flex",
        flexFlow: "row nowrap",
    },
    deleteIcon: {
        marginTop: "3px",
    },
};

const CheckList = forwardRef((props, ref) => {
    let [checklist, setChecklist] = useState([]);
    useImperativeHandle(ref, () => ({
        createNewCheckbox() {
            const checkboxItem = {
                id: null,
                tileID: props.tileID,
                desc: "",
                checked: false,
            };
            addChecklistRow(checkboxItem, (err) => {
                if (err) return;
                listChecklistRows(setChecklist, props.tileID);
            });
        },
    }));

    const handleDelete = (id) => {
        deleteChecklistRow(id, (err) => {
            if (err) return;
            listChecklistRows(setChecklist, props.tileID);
        });
    };

    useEffect(() => {
        listChecklistRows(setChecklist, props.tileID);
    }, [props.tileID]);

    const handleTextChange = (text, id) => {
        let checkboxItem;
        for (var i in checklist) {
            if (checklist[i].id === id) {
                checklist[i].desc = text;
                checkboxItem = checklist[i];
                break;
            }
        }
        editChecklistRow(checkboxItem, (err) => {
            if (err) return;
            listChecklistRows(setChecklist, props.tileID);
        });
    };

    const handleCheckboxToggle = (isChecked, id) => {
        let checkboxItem;
        for (var i in checklist) {
            if (checklist[i].id === id) {
                checklist[i].checked = isChecked;
                checkboxItem = checklist[i];
                break;
            }
        }
        editChecklistRow(checkboxItem, (err) => {
            if (err) return;
            listChecklistRows(setChecklist, props.tileID);
        });
    };

    return (
        <div style={style.container}>
            {checklist.map((listobj) => (
                <div key={listobj.id} style={style.checkboxGroup}>
                    <CheckBox
                        initialText={listobj.desc}
                        handleConfirm={(text) =>
                            handleTextChange(text, listobj.id)
                        }
                        value={listobj.checked}
                        onChange={(event) =>
                            handleCheckboxToggle(
                                event.target.checked,
                                listobj.id
                            )
                        }
                        editable={true}
                    />
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(listobj.id);
                        }}
                        style={style.deleteIcon}
                    >
                        <Tooltip value="Delete" position="mouse">
                            <FontAwesomeIcon icon={faTrash} />
                        </Tooltip>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default CheckList;
