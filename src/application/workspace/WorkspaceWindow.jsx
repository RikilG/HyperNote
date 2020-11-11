import EditorGroup from './EditorGroup';

const WorkspaceWindow = (props) => {
    return (
        <div style={{height: "100%"}}>
        {
            props.fileObj.inApp
            ? props.fileObj.page
            : <EditorGroup key={props.fileObj.id} fileObj={props.fileObj} closeFile={props.closeFile} />
        }
        </div>
    );
}

export default WorkspaceWindow;