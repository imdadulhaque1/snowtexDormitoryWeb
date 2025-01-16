"use client";
import React, { useState, FC, useRef } from "react";

interface SearchableInputProps {
  options: Array<{ [key: string]: any }>;
  selectedData: (string | number)[];
  onDataSelect: (id: string | number) => void;
  onDataRemove: (id: string | number) => void;
  onManualAdd: (name: string) => void;
  label?: string;
  placeholder?: string;
  notMatchingMsg?: string;
  idKey?: string;
  nameKey?: string;
}

const SearchableInput: FC<SearchableInputProps> = ({
  options,
  selectedData,
  onDataSelect,
  onDataRemove,
  onManualAdd,
  label = "Searchable Input",
  placeholder = "Add your items...",
  notMatchingMsg = "No matching data found!",
  idKey = "id",
  nameKey = "name",
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const firstItemKeys = options.length > 0 ? Object.keys(options[0]) : [];
  const resolvedIdKey = idKey || firstItemKeys[0];
  const resolvedNameKey = nameKey || firstItemKeys[1];

  const filteredOptions = options.filter((option) =>
    option[resolvedNameKey]?.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleTagSelection = (option: any) => {
    const id = option[resolvedIdKey];
    if (id === undefined) {
      console.error(
        `The key '${resolvedIdKey}' does not exist in the selected option. Selected option:`,
        option
      );
      return;
    }
    onDataSelect(id);
    // setInputValue(""); // Reset input after selection
  };

  const handleTagRemoval = (id: string | number) => {
    onDataRemove(id);
  };

  const handleManualAdd = () => {
    if (inputValue.trim()) {
      onManualAdd(inputValue.trim());
      if (inputRef.current) inputRef.current.value = ""; // Reset input
      setInputValue("");
    }
  };

  return (
    <div className="mb-5">
      {label && (
        <label className="text-black text-sm font-workSans mb-1">{label}</label>
      )}

      <div className="flex flex-wrap items-center bg-primary95 border border-primary95 rounded-md px-2 py-1 focus-within:border-primary80">
        {selectedData.map((id) => {
          const selectedOption = options.find(
            (option) => option[resolvedIdKey] === id
          );
          return (
            selectedOption && (
              <button
                key={id}
                onClick={() => handleTagRemoval(id)}
                className="flex items-center bg-primary90 text-black font-workSans text-sm px-3 py-1 mr-1 my-1 rounded-full hover:bg-errorLight85"
              >
                {selectedOption[resolvedNameKey]}
              </button>
            )
          );
        })}

        {/* Input Field */}
        <div className="flex w-full items-center justify-between ">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className="flex-1 border-none outline-none focus:outline-none py-2 px-1 font-workSans text-sm bg-primary95"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {inputValue && (
            <button
              onClick={handleManualAdd}
              className="font-workSans text-sm bg-green-200 px-3 py-1 rounded-xl hover:bg-green-300"
            >
              Manually Add ?
            </button>
          )}
        </div>
      </div>

      {/* Display Matching Options */}
      {inputValue && (
        <div className="flex flex-wrap items-center bg-primary96 rounded-md px-3 pt-3">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const id = option[resolvedIdKey];
              return (
                <div
                  key={id}
                  onClick={() => handleTagSelection(option)}
                  className="flex items-center gap-2 bg-primary80 px-3 py-1 mr-3 mb-3 rounded-md border-2 border-primary80 cursor-pointer hover:bg-primary90 hover:border-primary85"
                >
                  <p className="text-black font-workSans text-sm">
                    {option[resolvedNameKey]}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="font-workSans text-sm mb-3 text-red-500">
              {notMatchingMsg}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableInput;
