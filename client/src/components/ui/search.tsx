import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        className="rounded border px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
      />
    </div>
  );
};

interface SearchSelectProps {
  label: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchSelect = ({
  label,
  options,
  placeholder = "Select an option",
  onChange,
}: SearchSelectProps) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <Select onValueChange={(value: string) => onChange(value)}>
        <SelectTrigger
          className={`w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export { Search, SearchInput, SearchSelect };
