import { COLORS } from "@/app/_utils/COLORS";
import React, { FC, InputHTMLAttributes } from "react";
import { FaSearch } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface TableHeaderProps extends InputHTMLAttributes<HTMLInputElement> {
  headerText: string;
  placeholder?: string;
  inputName?: string;
  containerClassName?: string;
  inputClassName?: string;
  hasSearch?: boolean;
  onSearch?: () => void;
  apiOnSearch?: boolean;
  onClear?: () => void;
}

const TableHeader: FC<TableHeaderProps> = ({
  headerText,
  placeholder = "Search...",
  inputName = "searchInput",
  containerClassName = "",
  inputClassName = "",
  hasSearch = true,
  apiOnSearch = true,
  onSearch,
  onClear,
  ...rest
}) => {
  return (
    <div
      className={`flex flex-col  items-center justify-center  ${containerClassName}`}
    >
      <p className="text-black text-md font-workSans font-medium text-center my-1">
        {headerText}
      </p>
      {hasSearch && (
        <div className="flex items-center  bg-slate-200 border-2 border-primary90 justify-center w-full">
          <input
            autoComplete="off"
            type="text"
            name={inputName}
            placeholder={placeholder}
            className={`w-100p h-8  bg-slate-200 text-sm font-workSans outline-none px-2 text-black py-1  ${inputClassName}`}
            {...rest}
          />
          {apiOnSearch ? (
            <FaSearch
              onClick={onSearch}
              // color={COLORS.black}
              size={20}
              className="cursor-pointer text-slate-500 mr-2"
            />
          ) : (
            <IoIosCloseCircleOutline
              onClick={onClear}
              size={25}
              className="cursor-pointer text-red-400 mr-2 "
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TableHeader;
