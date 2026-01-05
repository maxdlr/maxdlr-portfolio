"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { FC, ReactElement } from "react";

interface ButtonProps {
  label?: string;
  url?: string;
  className?: string;
  onClick?: () => void;
  Icon?: ReactElement;
  target?: string;
  border?: boolean;
  rotating?: boolean;
}

const Button: FC<ButtonProps> = ({
  label = "",
  url = "",
  className = "",
  onClick = () => {},
  Icon,
  target,
  border = false,
  rotating = false,
}) => {
  const content = (
    <span className="flex justify-center items-center gap-2">
      {Icon && Icon}
      {label && <span>{label}</span>}
    </span>
  );

  const classes = `${className} inline-flex items-center cursor-pointer ${border && "border-1 p-1 rounded-md"}`;

  const Element = () => {
    if (url) {
      return (
        <Link href={url} className={classes} target={target}>
          {content}
        </Link>
      );
    }
    return (
      <button onClick={onClick} className={classes} type="button">
        {content}
      </button>
    );
  };

  const RotatingButton = () => (
    <motion.div
      style={{ transformOrigin: "center" }}
      initial={{
        opacity: 0,
        rotate: 20,
        transition: { duration: 0.5, ease: [0, 1, 0, 1] },
      }}
      animate={{
        opacity: 1,
        rotate: 0,
        y: 0,
        transition: { duration: 0.5, ease: [0, 1, 0, 1] },
      }}
      exit={{
        opacity: 0,
        y: -20,
        transition: { duration: 0.3, ease: [0, 1, 0, 1] },
      }}
      whileHover={{
        y: -2,
        rotate: 20,
        transition: { duration: 0.4, ease: [0, 1, 0, 1] },
      }}
      whileTap={{
        scale: 0.95,
        y: 0,
        transition: { duration: 0.1, ease: [0, 1, 0, 1] },
      }}
    >
      <Element />
    </motion.div>
  );

  return rotating ? <RotatingButton /> : <Element />;
};

export default Button;
