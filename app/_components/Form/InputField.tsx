import React, { FC, InputHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  isDisabled?: boolean;
  placeholder?: string;
}

const InputField: FC<Props> = ({
  isDisabled = false,
  placeholder,
  className,
  ...rest
}) => {
  return (
    <input
      type="text"
      disabled={isDisabled}
      placeholder={placeholder}
      autoComplete="off"
      className={clsx(
        "font-workSans outline-none px-5 bg-primary95 text-black rounded-lg py-3 shadow-lg shadow-primary80 mb-2 border-2 border-primary90",
        { "cursor-not-allowed opacity-50": isDisabled },
        className
      )}
      {...rest}
    />
  );
};

export default InputField;
