"use client";
import { FC, useState, useEffect, ChangeEvent } from "react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  options?: Option[];
  placeholder?: string;
  onSelect?: (value: string, label: string) => void;
  parentId?: string | null; // Deprecated
  defaultValue?: Option | null; // New prop for default selection
  isDisable?: boolean;
}

const SearchableDropdown: FC<Props> = ({
  options = [],
  placeholder = "Select an option",
  onSelect,
  parentId,
  defaultValue = null,
  isDisable = false,
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
    <div className="relative w-64">
      <button
        className={`w-full px-4 py-2 text-left bg-white border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 font-workSans ${
          isDisable && "opacity-40"
        }`}
        onClick={toggleDropdown}
        disabled={isDisable}
      >
        {selectedLabel || placeholder}
      </button>

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border-b focus:outline-none font-workSans"
            placeholder="Search..."
          />
          <ul>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="px-4 py-2 cursor-pointer hover:bg-indigo-500 hover:text-white font-workSans"
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
