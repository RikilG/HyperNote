import React from 'react';
import '../css/Editor.css'

const Editor = (props) => {
    return (
        <textarea className='editor' value={props.value} onChange={props.handleChange} />
    );
}

export default Editor;