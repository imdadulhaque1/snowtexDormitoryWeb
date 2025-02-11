import React, { useState } from "react";

interface DateTimePickerProps {
  label?: string;
  value?: string;
  onChange: (date: string) => void;
  min?: string;
  max?: string;
  className?: string;
  errorMsg?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  className = "",
  errorMsg,
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const localDate = new Date(e.target.value);
    const isoDate = localDate.toISOString(); // Convert to ISO format
    onChange(isoDate);
  };

  return (
    <div className="flex flex-col relative">
      {label && (
        <label className="text-black text-sm font-workSans mb-1">{label}</label>
      )}

      <div className="relative w-full">
        <input
          type="datetime-local"
          value={value ? value.slice(0, 16) : ""}
          onChange={handleDateChange}
          min={min}
          max={max}
          className={` font-workSans text-sm border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none  w-full ${className}`}
        />
        {errorMsg && (
          <p className="text-errorColor text-f11 md:text-f13 font-workSans pl-1 mt-1">
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
};

export default DateTimePicker;
