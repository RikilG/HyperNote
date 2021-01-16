import {
    useState,
    useEffect,
    forwardRef,
    useRef,
    useImperativeHandle,
} from "react";
import CheckBox from "../../ui/CheckBox";
import UserPreferences from "../../settings/UserPreferences";
import { openDatabase } from "../../Database";
import {
    createChecklistsDb,
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
};

const CheckList = forwardRef((props, ref) => {
    let [checklist, setChecklist] = useState([]);
    const db = openDatabase(UserPreferences.get("projectStorage"));
    createChecklistsDb(db, () => listChecklistRows(db));

    useImperativeHandle(ref, () => ({
        createNewCheckbox() {
            const checkboxItem = {
                id: null,
                tileID: props.tileID,
                desc: "",
                checked: false,
            };
            addChecklistRow(db, checkboxItem, (err) => {
                if (err) return;
                listChecklistRows(db, setChecklist);
            });
        },
    }));

    /*const handleDelete = (checkboxItem) => {
        deleteChecklistRow(db, checkboxItem.id, (err) => {
            if (err) return;
            listChecklistRows(db, setChecklist);
        });
    };*/

    useEffect(() => {
        listChecklistRows(db, setChecklist);
        return () => {
            db.close();
        };
    }, []);

    const handleTextChange = (text, id) => {
        let checkboxItem;
        for (var i in checklist) {
            if (checklist[i].id === id) {
                checklist[i].desc = text;
                checkboxItem = checklist[i];
                break;
            }
        }
        editChecklistRow(db, checkboxItem, (err) => {
            if (err) return;
            listChecklistRows(db, props.setChecklist);
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
        editChecklistRow(db, checkboxItem, (err) => {
            if (err) return;
            listChecklistRows(db, props.setChecklist);
        });
    };

    return (
        <div style={style.container}>
            {checklist.map((listobj) => (
                <CheckBox
                    initialText={listobj.desc}
                    handleConfirm={(text) => handleTextChange(text, listobj.id)}
                    defaultChecked={listobj.checked}
                    onCheckboxToggle={(event) =>
                        handleCheckboxToggle(event.target.checked, listobj.id)
                    }
                    textboxStyle={{ background: "var(--backgroundColor)" }}
                />
            ))}
        </div>
    );
});

export default CheckList;
