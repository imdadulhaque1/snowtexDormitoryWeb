import React, { FC } from "react";

interface Props {
  label?: string;
  name?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  errorMsg?: string;
}

const VerticalSingleInput: FC<Props> = ({
  label,
  type,
  name,
  placeholder,
  className,
  errorMsg,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <label className=" text-black text-sm font-workSans mb-1 ">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={`w-full border-2 rounded-md outline-none focus:outline-none px-2 py-2 font-workSans bg-primary95 ${
          className || ""
        }`}
        {...props}
      />
      {errorMsg && (
        <p className="text-errorColor text-f11 md:text-f13 font-workSans pl-1 mt-1">
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default VerticalSingleInput;
