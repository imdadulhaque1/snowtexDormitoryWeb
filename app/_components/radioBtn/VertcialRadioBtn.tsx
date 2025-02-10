import React from "react";

interface RadioButtonProps {
  label?: string;
  value?: number;
  name?: string;
  checked?: boolean;
  onChange?: (value: number) => void;
  required?: boolean;
  className?: string;
}

const VertcialRadioBtn: React.FC<RadioButtonProps> = ({
  label,
  value,
  name,
  checked,
  onChange,
  required = false,
  className = "",
}) => {
  return (
    <label
      className={`flex  items-center space-x-1 cursor-pointer ${className}`}
    >
      <input
        type="radio"
        value={value}
        name={name}
        checked={checked}
        onChange={() => onChange(value)}
        className="w-5 h-5 cursor-pointer"
        required={required}
      />
      {label && (
        <span className="font-workSans text-black text-sm">{label}</span>
      )}
    </label>
  );
};

export default VertcialRadioBtn;
