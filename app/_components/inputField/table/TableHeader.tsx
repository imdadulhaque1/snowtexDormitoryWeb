import React, { FC, InputHTMLAttributes } from "react";

interface TableHeaderProps extends InputHTMLAttributes<HTMLInputElement> {
  headerText: string;
  placeholder?: string;
  inputName?: string;
  containerClassName?: string;
  inputClassName?: string;
  hasSearch?: boolean;
}

const TableHeader: FC<TableHeaderProps> = ({
  headerText,
  placeholder = "Search...",
  inputName = "searchInput",
  containerClassName = "",
  inputClassName = "",
  hasSearch = true,
  ...rest
}) => {
  return (
    <div
      className={`flex flex-col  items-center justify-center border-r-2 border-slate-50 ${containerClassName}`}
    >
      <p className="text-md font-workSans font-medium text-center my-1">
        {headerText}
      </p>
      {hasSearch && (
        <input
          autoComplete="off"
          type="text"
          name={inputName}
          placeholder={placeholder}
          className={`w-100p h-8  inset-x-0 bottom-0 bg-slate-200 text-sm font-workSans outline-none px-2 text-black py-1 border-2 border-primary90 ${inputClassName}`}
          {...rest}
        />
      )}
    </div>
  );
};

export default TableHeader;
