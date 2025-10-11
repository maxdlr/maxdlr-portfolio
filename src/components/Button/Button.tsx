import Link from "next/link";

const Button = ({
  label = "",
  url = "",
  className = "",
  onClick = () => {},
}) => {
  const Element = url ? Link : "button";
  return (
    <Element
      href={url || "/"}
      className={`${className} cursor-pointer`}
      onClick={onClick}
    >
      {label}
    </Element>
  );
};

export default Button;
