import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWrench } from "@fortawesome/free-solid-svg-icons";

const style = {
    container: {
        position: "absolute",
        padding: "0.3rem 0",
        borderRadius: "0.4rem",
        minWidth: "100px",
        color: "var(--primaryTextColor)",
        background: "var(--backgroundAccent)",
        zIndex: "5",
        boxShadow: "4px 4px 4px var(--backgroundAccent)",
    },
    menuItem: {
        cursor: "pointer",
        userSelect: "none",
        borderRadius: "0.1rem",
        margin: "0.1rem",
        padding: "0.1rem 0.5rem",
        fontSize: "0.95rem",
    },
    menuIcon: {
        margin: "0 10px 0 1px",
    },
};

const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const useContextMenu = ({ x, y, width, height }) => {
    const [xPos, setXPos] = useState("0px");
    const [yPos, setYPos] = useState("0px");
    const [showMenu, setShowMenu] = useState(false);
    const [target, setTarget] = useState(undefined);

    const handleContextMenu = useCallback(
        (e) => {
            e.preventDefault();
            setTarget(e.target);
            if (
                e.pageX >= x &&
                e.pageY >= y &&
                e.pageX <= x + width &&
                e.pageY <= y + height
            )
                setShowMenu(true);
            setXPos(`${e.pageX - 33}px`); // 35 px of navbar
            setYPos(`${e.pageY - 28}px`); // 30 px of titlebar
        },
        [setXPos, setYPos, width, height, x, y]
    );

    const handleClick = useCallback(() => {
        showMenu && setShowMenu(false);
    }, [showMenu]);

    useEffect(() => {
        document.addEventListener("click", handleClick);
        document.addEventListener("contextmenu", handleContextMenu);

        return () => {
            document.addEventListener("click", handleClick);
            document.removeEventListener(
                "contextmenu",
                handleContextMenu
            );
        };
    }, [handleClick, handleContextMenu]);

    return { xPos, yPos, showMenu, target };
};

const ContextMenu = ({ children, bounds, menu }) => {
    const { xPos, yPos, showMenu, target } = useContextMenu(bounds);

    return (
        <>
            {showMenu && (
                <div
                    style={{
                        top: yPos,
                        left: xPos,
                        ...style.container,
                    }}
                >
                    {menu.map((item, index) => (
                        <div
                            key={index}
                            style={style.menuItem}
                            className="menu-item"
                            onClick={() => item.action(target)}
                        >
                            <FontAwesomeIcon
                                icon={item.icon || faWrench}
                                style={style.menuIcon}
                            />

                            {capitalize(item.name)}
                        </div>
                    ))}
                    {children}
                </div>
            )}
        </>
    );
};

export default ContextMenu;
