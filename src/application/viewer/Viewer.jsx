import React from 'react';

const marked = require('marked');

export default class Viewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            markup: '# Loading...',
        }
    }

    componentDidMount() {
        this.setState({
                interval: setInterval(() => this.setState({
                    markup: marked(this.props.value, {sanitize: true})
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
            <div dangerouslySetInnerHTML={this.getMarkdownText()} />
        );
    }
}