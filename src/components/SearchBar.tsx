import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Cari kuliner favoritmu...",
  id = "global-search-bar"
}) => {
  return (
    <div className="relative w-full" id={`${id}-container`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white text-slate-900 rounded-2xl text-sm transition-all outline-none"
        placeholder={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          id={`${id}-clear-btn`}
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};
