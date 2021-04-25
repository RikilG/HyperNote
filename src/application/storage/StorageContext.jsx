import React, { useState } from "react";
import FileSystem, { StorageType } from "./FileSystem";

const fileSystem = FileSystem.getInstance();

const StorageContext = React.createContext({
    fileSystem: fileSystem,
    userPreferences: fileSystem.userPreferences,
    storage: undefined,
    setStorage: () => {},
});

export default StorageContext;

export const StorageContextWrapper = ({ children }) => {
    let [storage, setStorage] = useState(StorageType.TEMP); // TODO: get from preferences

    const contextValues = {
        fileSystem: fileSystem,
        userPreferences: fileSystem.userPreferences,
    };

    const setStorageWrapper = (newStorage) => {
        fileSystem.setCurrentStorage(newStorage);
        setStorage(newStorage);
    };

    return (
        <StorageContext.Provider
            value={{
                ...contextValues,
                storage: storage,
                setStorage: setStorageWrapper,
            }}
        >
            {children}
        </StorageContext.Provider>
    );
};
