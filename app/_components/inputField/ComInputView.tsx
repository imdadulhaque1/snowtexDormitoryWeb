"use client";

import React, { FC } from "react";

interface comInputProps {
  type?: any;
  name?: string;
  className?: string;
  placeholder?: string;
}

const ComInputView: FC<comInputProps> = ({
  type,
  name,
  className,
  placeholder,
  ...props
}) => {
  return (
    <div className={`flex items-center justify-center`}>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={` text-sm text-black w-full  outline-none focus:outline-none px-2 font-workSans bg-white ${
          className || ""
        }`}
        {...props}
      />
    </div>
  );
};

export default ComInputView;
