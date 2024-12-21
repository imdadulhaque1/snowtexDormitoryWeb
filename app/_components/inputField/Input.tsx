import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  errorMsg?: string;
  inputType?: string;
}

const Input: React.FC<Props> = ({
  label,
  name,
  errorMsg,
  inputType = "text",
  ...props
}) => {
  return (
    <div className="flex w-full items-center justify-between mb-4">
      <label
        className="w-3/12 flex items-end font-workSans text-black pr-2"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="w-2/3">
        <input
          type={inputType}
          id={name}
          name={name}
          className={`outline-none w-full bg-primary95 border-0 text-black rounded-xl py-2 px-3 font-workSans transition duration-200 focus:ring-2 ${
            errorMsg ? "border-errorColor" : "focus:ring-blue-400"
          }`}
          {...props}
        />
        {errorMsg && (
          <p className="text-errorColor text-f11 md:text-f13 font-workSans pl-1 mt-1">
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
};

export default Input;
