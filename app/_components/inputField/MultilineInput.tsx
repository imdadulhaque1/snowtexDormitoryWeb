import { useWindowSize } from "@/app/_utils/handler/useWindowSize";
import React from "react";

interface Props
  extends React.InputHTMLAttributes<HTMLInputElement>,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  errorMsg?: string;
  inputType?: string;
  multiline?: boolean;
}

const MultilineInput: React.FC<Props> = ({
  label,
  name,
  errorMsg,
  inputType = "text",
  multiline = false,
  ...props
}) => {
  const size = useWindowSize();
  const windowWidth: any = size && size?.width;

  return (
    <div className="flex w-full items-center justify-between mb-4">
      <label
        className={`${
          windowWidth > 1024 ? "w-2/12" : "w-3/12"
        } flex items-end font-workSans text-black pr-2`}
        htmlFor={name}
      >
        {label}
      </label>
      <div className={`${windowWidth > 1024 ? "w-5/6" : "w-3/4"} `}>
        {multiline ? (
          <textarea
            id={name}
            name={name}
            className={`outline-none w-full bg-primary95 border-0 text-black rounded-xl py-2 px-3 font-workSans transition duration-200 focus:ring-2 ${
              errorMsg ? "border-errorColor" : "focus:ring-blue-400"
            }`}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            type={inputType}
            id={name}
            name={name}
            className={`outline-none w-full bg-primary95 border-0 text-black rounded-xl py-2 px-3 font-workSans transition duration-200 focus:ring-2 ${
              errorMsg ? "border-errorColor" : "focus:ring-blue-400"
            }`}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {errorMsg && (
          <p className="text-errorColor text-f11 md:text-f13 font-workSans pl-1 mt-1">
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
};

export default MultilineInput;
