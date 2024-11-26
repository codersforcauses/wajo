import React, { useId, useState } from "react";

import DropdownMenu from "@/components/ui/dropdown";

// Style for height
const defaultHeight = "h-10";

interface SearchProps {
  children: React.ReactNode;
  title: string;
}

const Search = ({ children, title }: SearchProps) => {
  return (
    <div className="mx-auto mb-6 rounded-lg border bg-white p-4 shadow-md">
      <h2 className="mb-4 text-lg font-semibold text-gray-700">
        Search {title}
      </h2>
      <div className="flex flex-wrap gap-x-4 gap-y-2">{children}</div>
    </div>
  );
};

interface SearchInputProps {
  label: string;
  value: string;
  placeholder?: string;
  onSearch: (value: string) => void; // Trigger searching on focus out
}

const SearchInput = ({
  label,
  value,
  placeholder,
  onSearch,
}: SearchInputProps) => {
  const [tempValue, setTempValue] = useState(value);

  const handleOnBlur = () => {
    onSearch(tempValue);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(tempValue);
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        type="text"
        placeholder={placeholder || ""}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleOnBlur}
        onKeyDown={handleOnKeyDown}
        className={`${defaultHeight} rounded border px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300`}
      />
    </div>
  );
};

interface SearchDropdownProps {
  label: string;
  options: string[];
  onChange: (value: string) => void;
}

const SearchDropdown = ({ label, options, onChange }: SearchDropdownProps) => {
  const menuId = useId();
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <DropdownMenu
        menuId={menuId}
        options={options}
        onChange={(value: string) => onChange(value)}
      />
    </div>
  );
};

export { Search, SearchDropdown, SearchInput };
