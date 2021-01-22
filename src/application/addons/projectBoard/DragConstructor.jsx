// Not Used Yet. Can be used later if necessary.

const DragConstructor = (element) => {
    let oldX, oldY, dX, dY;
    const onDragStop = () => {
        document.onmouseup = null;
        document.onmousemove = null;
    };
    const onDragStart = (e) => {
        e = e || window.event;
        e.preventDefault();
        dX = oldX - e.clientX;
        dY = oldY - e.clientY;
        oldX = e.clientX;
        oldY = e.clientY;
        element.style.top = element.offsetTop - dY + "px";
        element.style.left = element.offsetLeft - dX + "px";
    };
    const onMouseDown = (e) => {
        e = e || window.event;
        e.preventDefault();
        oldX = e.clientX;
        oldY = e.clientY;
        document.onmouseup = onDragStop;
        document.onmousemove = onDragStart;
    };
    element.onmousedown = onMouseDown;
};

export default DragConstructor;
