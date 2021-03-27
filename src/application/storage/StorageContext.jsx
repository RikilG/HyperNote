import React from "react";
import FileSystem from "./FileSystem";

const fileSystem = FileSystem.getInstance();

const StorageContext = React.createContext({
    fileSystem: fileSystem,
});

export default StorageContext;

export const StorageContextWrapper = ({ children }) => {
    return (
        <StorageContext.Provider value={{ fileSystem }}>
            {children}
        </StorageContext.Provider>
    );
};
