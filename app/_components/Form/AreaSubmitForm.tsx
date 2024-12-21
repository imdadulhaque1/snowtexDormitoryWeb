"use client";

import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import { FaRegWindowClose } from "react-icons/fa";
import { COLORS } from "@/app/_utils/COLORS";

interface FormProps {
  placeholder?: string;
  onSubmit: (formData: FormData) => Promise<void>;
  errorMessage?: string;
  isDisabled?: boolean;
  value: string;
  onValueChange: (newValue: string) => void;
  isUpdated?: boolean;
  notUpdateFunc?: () => void;
  addHoverText?: string;
  updateHoverText?: string;
  updateClosedHoverText?: string;
}

const AreaSubmitForm: React.FC<FormProps> = ({
  placeholder = "Enter Text",
  onSubmit,
  errorMessage,
  isDisabled = false,
  value,
  onValueChange,
  isUpdated = false,
  notUpdateFunc,
  addHoverText,
  updateHoverText,
  updateClosedHoverText,
}) => {
  const [error, setError] = useState<string | null>(errorMessage || null);

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", value);

    try {
      await onSubmit(formData);
      onValueChange("");
    } catch (err: any) {
      console.error("Submission Error: ", err);
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={submitHandler} className="flex items-center space-x-2">
        <input
          type="text"
          name="name"
          disabled={isDisabled}
          placeholder={placeholder}
          autoComplete="off"
          className="font-workSans outline-none px-5 bg-primary95 text-black rounded-lg py-3 shadow-lg shadow-primary80 mb-2 border-2 border-primary90"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
        />
        {!isUpdated ? (
          <div className="relative group">
            <button type="submit" disabled={isDisabled} className="relative">
              <IoIosAddCircleOutline
                color={COLORS.primary96}
                size={30}
                className="cursor-pointer bg-primary50 rounded-full shadow-xl shadow-white"
              />
            </button>

            {/* Tooltip text */}
            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
              {addHoverText}
            </span>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="relative group ">
              <button type="submit" disabled={isDisabled}>
                <MdOutlineSystemUpdateAlt
                  color={COLORS.primary70}
                  size={30}
                  className="cursor-pointer  shadow-xl shadow-white"
                />
              </button>

              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                {updateHoverText}
              </span>
            </div>

            <div className="relative group mb-2">
              <FaRegWindowClose
                onClick={notUpdateFunc}
                color={COLORS.errorColor}
                size={25}
                className=" ml-2 cursor-pointer  shadow-xl shadow-white"
              />

              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                {updateClosedHoverText}
              </span>
            </div>
          </div>
        )}
      </form>

      {error && (
        <p className="font-workSans text-errorColor text-sm">{error}</p>
      )}
    </div>
  );
};

export default AreaSubmitForm;
