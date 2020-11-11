import EditorGroup from './EditorGroup';

const WorkspaceWindow = (props) => {
    return (
        <div style={{height: "100%"}}>
        {
            props.fileObj.inApp
            ? props.fileObj.page
            : <EditorGroup key={props.fileObj.id} fileObj={props.fileObj} />
        }
        </div>
    );
}

export default WorkspaceWindow;