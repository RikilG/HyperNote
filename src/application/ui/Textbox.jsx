// used in Searchbar.jsx

const Textbox = (props) => {
    return (
        <input type={"text" || props.type} className="textbox" {...props} />
    );
}

export default Textbox;