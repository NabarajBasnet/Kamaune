import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";

interface SearchFieldProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
}

const SearchField: React.FC<SearchFieldProps> = ({ placeholder = "Search...", onSearch }) => {
    const [query, setQuery] = useState("");

    const handleClear = () => {
        setQuery("");
        onSearch?.("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        onSearch?.(e.target.value);
    };

    return (
        <div className="relative w-full">
            {/* Left icon */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
            </div>

            {/* Input field */}
            <Input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-5.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Right clear icon */}
            {query && (
                <button
                    onClick={handleClear}
                    className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default SearchField;
