type ButtonProps = {
  children: string;
};

function Button(props: ButtonProps) {
    const {children} = props;
  return <button type="button" className="btn btn-primary m-1">
    {children}
  </button>;
}

export default Button;
