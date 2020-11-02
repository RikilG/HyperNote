// renderer.js also
import React from 'react';
import ReactDOM from 'react-dom';
import Main from './application/Main';

ReactDOM.render(
    <React.StrictMode>
        <div style={{height: "100vh"}}>
            <Main />
        </div>
    </React.StrictMode>,
    document.getElementById('root')
);