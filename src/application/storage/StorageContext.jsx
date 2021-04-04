import React from "react";
import FileSystem from "./FileSystem";

const fileSystem = FileSystem.getInstance();

const StorageContext = React.createContext({
    fileSystem: fileSystem,
    userPreferences: fileSystem.userPreferences,
});

export default StorageContext;

export const StorageContextWrapper = ({ children }) => {
    const contextValues = {
        fileSystem: fileSystem,
        userPreferences: fileSystem.userPreferences,
    };

    return (
        <StorageContext.Provider value={contextValues}>
            {children}
        </StorageContext.Provider>
    );
};
