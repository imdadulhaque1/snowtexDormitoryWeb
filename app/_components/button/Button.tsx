"use client";
import React, { FC, ReactNode } from "react";

interface Props {
  btnOnClick?: () => void;
  children?: ReactNode;
  className?: string;
}

const Button: FC<Props> = (props) => {
  const { btnOnClick, children, className } = props;

  return (
    <button
      className={`px-4  bg-primary95 hover:bg-primary80 ${className}`}
      onClick={btnOnClick}
    >
      {children}
    </button>
  );
};

export default Button;
