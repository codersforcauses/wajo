import React, { useState } from "react";

interface DropdownProps {
  menuId: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const DropdownMenu = function DropdownMenu({
  options,
  onChange,
  placeholder = "Select an option",
  height,
}: DropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  function handleOnChange(value: string) {
    setSelectedOption(value);
    setIsExpanded(false);
    onChange(value);
  }
  function handleOnClick() {
    setIsExpanded(!isExpanded);
  }
  function handleOnBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsExpanded(false);
    }
  }

  return (
    <div
      onBlur={handleOnBlur}
      tabIndex={-1}
      className="relative inline-block text-left"
    >
      <button
        type="button"
        onClick={handleOnClick}
        className={`${height} w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300`}
      >
        {selectedOption || placeholder}
        <span className="float-right">&#9662;</span>
      </button>

      {isExpanded && (
        <ul className="absolute z-10 mt-2 w-full rounded-md border border-gray-300 bg-white shadow-lg">
          {options.map((option, index) => (
            <li
              key={index}
              className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => handleOnChange(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
