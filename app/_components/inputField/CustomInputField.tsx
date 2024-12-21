"use client";

import { FC } from "react";

interface CustomInputFieldProps {
  name: string;
  defaultValue?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const CustomInputField: FC<CustomInputFieldProps> = ({
  name,
  defaultValue,
  onChange,
  placeholder,
}) => {
  return (
    <input
      className="h-full w-full font-workSans outline-none rounded-l-full px-5 bg-primary95 hover:rounded-l-full text-black"
      type="text"
      name={name}
      defaultValue={defaultValue}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default CustomInputField;
