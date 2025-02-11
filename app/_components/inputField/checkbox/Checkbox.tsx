import React from "react";

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  required?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  required = false,
  className = "",
}) => {
  return (
    <label
      className={`flex items-center space-x-1 cursor-pointer ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="w-5 h-5 cursor-pointer"
        required={required}
      />
      {label && (
        <span className="font-workSans text-black text-sm">{label}</span>
      )}
    </label>
  );
};

export default Checkbox;
