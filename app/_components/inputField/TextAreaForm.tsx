import { useWindowSize } from "@/app/_utils/handler/useWindowSize";
import React from "react";

interface Props
  extends React.InputHTMLAttributes<HTMLInputElement>,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  errorMsg?: string;
  dynamicClass?: string;
  haveSecondLabel?: boolean;
  secondLabelFunc?: () => void;
  secondLabelTxt?: string;
  labelTxtSize?: string;
}

const TextAreaForm: React.FC<Props> = ({
  label,
  name,
  errorMsg,
  dynamicClass,
  haveSecondLabel = false,
  secondLabelFunc,
  secondLabelTxt,
  labelTxtSize = "text-md",
  ...props
}) => {
  const size = useWindowSize();
  const windowWidth: any = size && size?.width;

  return (
    <div className="flex flex-col w-full items-start mb-4">
      <div className="flex items-center">
        <label
          className={`font-workSans text-black ${labelTxtSize} pr-2`}
          htmlFor={name}
        >
          {label}:
        </label>
        {haveSecondLabel && (
          <p
            onClick={secondLabelFunc}
            className={`text-black cursor-pointer font-workSans  ${
              dynamicClass || ""
            }`}
          >
            {secondLabelTxt}
          </p>
        )}
      </div>

      <textarea
        id={name}
        name={name}
        className="outline-none w-full bg-primary95 border-0 text-black rounded-md py-2 px-3 font-workSans transition duration-200 focus:ring-2"
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
      {errorMsg && (
        <p className="text-errorColor text-f11 md:text-f13 font-workSans pl-1 mt-1">
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default TextAreaForm;
