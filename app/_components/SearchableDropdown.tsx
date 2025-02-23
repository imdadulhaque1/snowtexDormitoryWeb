"use client";
import { FC, useState, useEffect, ChangeEvent } from "react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  options?: Option[];
  placeholder?: string;
  txtColor?: string;
  onSelect?: (value: string, label: string) => void;
  parentId?: string | null; // Deprecated
  defaultValue?: Option | null; // New prop for default selection
  isDisable?: boolean;
  errorMsg?: string;
}

const SearchableDropdown: FC<Props> = ({
  options = [],
  placeholder = "Select an option",
  onSelect,
  parentId,
  defaultValue = null,
  isDisable = false,
  errorMsg,
  txtColor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  // Update filteredOptions when options change
  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  // Set default selected option based on defaultValue or parentId
  useEffect(() => {
    const initialOption = defaultValue
      ? defaultValue
      : parentId
      ? options.find((option) => option.value === parentId)
      : null;

    if (initialOption && initialOption.label !== selectedLabel) {
      setSelectedLabel(initialOption.label);
      if (onSelect) onSelect(initialOption.value, initialOption.label);
    }
  }, [defaultValue, parentId, options, onSelect, selectedLabel]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSelect = (option: Option) => {
    setSelectedLabel(option.label);
    if (onSelect) onSelect(option.value, option.label);
    setIsOpen(false);
    setSearchTerm("");
    setFilteredOptions(options);
  };

  return (
    <div className="relative w-full">
      <button
        className={` text-black w-full px-4 py-2 text-left ${txtColor} bg-primary95 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 font-workSans ${
          isDisable && "opacity-40"
        }`}
        onClick={toggleDropdown}
        disabled={isDisable}
      >
        {selectedLabel || placeholder}
      </button>
      {errorMsg && (
        <p className="text-errorColor text-f11 md:text-f13 font-workSans pl-1 mt-1">
          {errorMsg}
        </p>
      )}

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="text-black w-full px-4 py-2 border-b focus:outline-none font-workSans"
            placeholder="Search..."
          />

          <ul>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="text-black px-4 py-2 cursor-pointer hover:bg-indigo-50 font-workSans"
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
