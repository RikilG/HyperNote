import React from 'react';

const WindowContext = React.createContext({
    windowList: [],
    openWindow: () => {},
    closeWindow: () => {},
});

export default WindowContext;