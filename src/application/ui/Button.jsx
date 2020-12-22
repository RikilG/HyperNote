const Button = (props) => {
    return (
        <div className="button" {...props}>
            {props.children || props.value}
        </div>
    );
};

export default Button;
