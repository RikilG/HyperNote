import React, { useEffect, useState } from "react";

// import style from '../css/Renderer.css';

const marked = require("marked");

let style = {
    container: {
        height: "100%",
        overflowY: "auto",
    },
};

const Renderer = (props) => {
    // let [ interval, setInterval ] = useState(null);
    let [markup, setMarkup] = useState(props.value);

    const getMarkdownText = () => {
        return { __html: markup };
    };

    useEffect(() => {
        setMarkup(marked(props.value));
    }, [props.value]);

    // componentDidMount() {
    //     this.setState({
    //             interval: setInterval(() => this.setState({
    //                 markup: marked(this.props.value)
    //             }), 500)
    //     });
    // }

    // componentWillUnmount() {
    //     clearInterval(this.state.interval);
    // }

    return (
        <div
            style={style.container}
            dangerouslySetInnerHTML={getMarkdownText()}
        />
    );
};

export default Renderer;
