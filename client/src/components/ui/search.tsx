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

/**
 * The `Search` component is a container for various search-related input elements.
 * It provides a styled wrapper for the children components, typically input or select elements.
 *
 * @component
 * @example
 * <Search title="Users">
 *   <SearchInput label="Username" value={value} onSearch={handleInputChange} />
 *   <SearchSelect label="Status" options={statusOptions} onChange={handleStatusChange} />
 * </Search>
 *
 * @param {React.ReactNode} children - The content to be rendered inside the search container.
 * @param {string} title - The title for the search section.
 *
 * @returns {JSX.Element} A styled search container with the title and children.
 */
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

/**
 * The `SearchInput` component provides a text input for users to type and trigger searches.
 * It supports a placeholder, a default value, and triggers a search on `blur` or `Enter` key press.
 *
 * @component
 * @example
 * <SearchInput label="Username" value={value} onSearch={handleInputChange} />
 *
 * @param {string} label - The label for the input field.
 * @param {string} value - The current value of the input.
 * @param {string} [placeholder] - Optional placeholder text for the input.
 * @param {(value: string) => void} onSearch - Callback function that triggers the search with the input value.
 *
 * @returns {JSX.Element} A text input element with search functionality.
 */
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

/**
 * The `SearchSelect` component provides a dropdown select element for users to choose an option.
 * It displays the options passed as `props` and triggers an `onChange` callback with the selected value.
 *
 * @component
 * @example
 * <SearchSelect label="Status" options={statusOptions} onChange={handleStatusChange} />
 *
 * @param {string} label - The label for the select dropdown.
 * @param {string[]} options - An array of options to display in the dropdown.
 * @param {string} [placeholder="Select an option"] - Placeholder text for the select input.
 * @param {(value: string) => void} onChange - Callback function that triggers when an option is selected.
 *
 * @returns {JSX.Element} A styled select dropdown element.
 */
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