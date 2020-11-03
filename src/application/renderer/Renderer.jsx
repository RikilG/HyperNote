import React from 'react';

// import style from '../css/Renderer.css';

const marked = require('marked');


let style = {
    container: {
        height: "100%",
        overflowY: "auto",
    }
}

export default class Renderer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            markup: '',
        }
    }

    componentDidMount() {
        this.setState({
                interval: setInterval(() => this.setState({
                    markup: marked(this.props.value)
                }), 500)
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    getMarkdownText() {
        return { __html: this.state.markup };
    }

    render() {
        return (
            <div style={style.container} dangerouslySetInnerHTML={this.getMarkdownText()} />
        );
    }
}