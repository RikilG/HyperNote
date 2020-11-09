// used in Searchbar.jsx

const style = {
    bar: {
        outline: "none",
        minWidth: "0",
        flex: "1",
        background: "var(--backgroundAccent)",
        padding: "3px",
        border: "0",
        borderRadius: "5px",
    },
}

const Textbox = (props) => {
    return (
        <input type="text" style={style.bar} {...props} />
    );
}

export default Textbox;