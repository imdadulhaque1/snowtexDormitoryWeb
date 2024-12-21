"use client";

import { COLORS } from "@/app/_utils/COLORS";
import React, { FC } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

interface AddInputProps {
  placeholder?: string;
  onAdd: (value: string) => void;
  addIcon?: React.ReactNode;
}

const AddInput: FC<AddInputProps> = ({
  placeholder = "Enter text",
  onAdd,
  addIcon,
}) => {
  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem(
      "addInput"
    ) as HTMLInputElement;
    const inputValue = input.value.trim();

    if (inputValue) {
      onAdd(inputValue);
      input.value = "";
    }
  };

  return (
    <form onSubmit={handleAdd} className="flex items-center">
      <input
        autoComplete="off"
        type="text"
        name="addInput"
        placeholder={placeholder}
        className="font-workSans outline-none px-5 bg-primary95 text-black rounded-lg py-3 shadow-lg mb-2 border-2 border-primary90"
      />
      <button type="submit">
        <IoIosAddCircleOutline
          color={COLORS.primary96}
          size={30}
          className="cursor-pointer ml-1 bg-primary50 rounded-full"
        />
      </button>
    </form>
  );
};

export default AddInput;
