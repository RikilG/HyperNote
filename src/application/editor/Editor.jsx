import React from 'react';
import '../css/Editor.css'

export default class Editor extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         value: 'Get Started!'
    //     };
    // }

    // handleChange = (event) => {
    //     this.setState({value: event.target.value});
    // }
  
    render() {
        return (
            <textarea className='editor' value={this.props.value} onChange={this.props.handleChange} />
        );
    }
}