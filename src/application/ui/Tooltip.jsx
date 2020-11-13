import { useState, useRef } from "react";

const Tooltip = (props) => {
    let tooltip = useRef(null);
    let [position, setPosition] = useState({ x: 0, y: 0, align: "auto" });

    const onShowTooltip = (e) => {
        // remember 30 is size of titlebar (adjust y accordingly)
        const boundingRect = e.currentTarget.getBoundingClientRect();
        const tooltipRect = tooltip.current.getBoundingClientRect();
        let x = 0, y = 0, titlebarHeight = 30;
        let align = props.position;

        function setBottom() {
            x = (boundingRect.right + boundingRect.left)/2 - tooltipRect.width/2;
            y = boundingRect.bottom - titlebarHeight;
        }

        function setRight() {
            x = boundingRect.right;
            y = (boundingRect.top + boundingRect.bottom)/2 - tooltipRect.height/2 - titlebarHeight;
        }

        function setTop() {
            x = (boundingRect.right + boundingRect.left)/2 - tooltipRect.width/2;
            y = boundingRect.top - tooltipRect.height - titlebarHeight;
        }

        function setLeft() {
            x = boundingRect.left - tooltipRect.width;
            y = (boundingRect.top + boundingRect.bottom)/2 - tooltipRect.height/2 - titlebarHeight;
        }

        if (align === "mouse") {
            x = e.clientX - 20; // 20 to take care of navbar
            y = e.clientY - titlebarHeight + 10; // 20 to shift tooltip below mouse
        }
        else if (align === "right") setRight();
        else if (align === "top") setTop();
        else if (align === "left") setLeft();
        else if (align === "bottom") setBottom();
        else { // "auto" position by considering viewablity w.r.t window
            /// reference: https://medium.com/@jsmuster/building-a-tooltip-component-with-react-2de14761e02
            const docWidth = document.documentElement.clientWidth,
                docHeight = document.documentElement.clientHeight;
            
            let rx = boundingRect.right, // most right x
                lx = boundingRect.x, // most left x
                ty = boundingRect.y - titlebarHeight, // most top y
                by = boundingRect.bottom - titlebarHeight; // most bottom y
  
            let bRight = (rx + tooltipRect.width) <= (window.scrollX + docWidth);
            let bLeft = (lx - tooltipRect.width) >= 0;
            let bAbove = (ty - tooltipRect.height) >= 0;
            let bBellow = (by + tooltipRect.height) <= (window.scrollY + docHeight);
            if(bBellow) {
                setBottom();
                align = "bottom";
            }
            else if(bRight) {
                setRight();
                align = "right";
            }
            else if(bLeft) {
                setLeft();
                align = "left";
            }
            else if(bAbove) {
                setTop();
                align = "top";
            }
        }
        setPosition({ x: x, y: y, align: align });
    }

    const onHideTooltip = () => {

    }

    return (
        <div
            className="tooltip-wrapper"
            onMouseEnter={onShowTooltip}
            onMouseLeave={onHideTooltip}
            style={props.style}
        >
            {props.children}
            <div
                className={`tooltip ${position.align}`}
                style={{ top: `${position.y}px`, left: `${position.x}px` }}
                ref={tooltip}
            >
                <div className="tooltip-arrow" />
                {props.value}
            </div>
        </div>
    );
}

export default Tooltip;