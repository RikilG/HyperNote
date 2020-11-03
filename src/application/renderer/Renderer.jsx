import React from 'react';

import style from '../css/Renderer.css';

const marked = require('marked');

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
            <div className="renderer y-scrollable " dangerouslySetInnerHTML={this.getMarkdownText()} />
        );
    }
}