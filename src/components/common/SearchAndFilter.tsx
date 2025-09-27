import React, { useState, useRef, useEffect } from 'react';

interface Option {
    value: string;
    label: string;
}

interface SearchableDropdownProps {
    options: Option[];
    onSelect: (selected: Option | Option[]) => void;
    placeholder?: string;
    isMulti?: boolean;
    className?: string;
    disabled?: boolean;
    selected?: string | string[];
    onSetSelected?: (selected: string | string[]) => void;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
    options,
    onSelect,
    placeholder = "Select an option...",
    isMulti = false,
    className = "",
    disabled = false,
    selected,
    onSetSelected
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: Option) => {
        if (isMulti) {
            const isAlreadySelected = selectedOptions.some(item => item.value === option.value);
            let newSelectedOptions: Option[];

            if (isAlreadySelected) {
                newSelectedOptions = selectedOptions.filter(item => item.value !== option.value);
            } else {
                newSelectedOptions = [...selectedOptions, option];
            }

            setSelectedOptions(newSelectedOptions);
            onSelect(newSelectedOptions);
        } else {
            setSelectedOptions([option]);
            onSelect(option);
            setIsOpen(false);
            setSearchTerm('');
        }
    };

    const removeSelected = (value: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSelectedOptions = selectedOptions.filter(item => item.value !== value);
        setSelectedOptions(newSelectedOptions);
        onSelect(newSelectedOptions);
    };

    const clearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedOptions([]);
        onSelect([]);
    };

    const getDisplayText = () => {
        if (selectedOptions.length === 0) return placeholder;
        if (isMulti) {
            if (selectedOptions.length === 1) return selectedOptions[0].label;
            return `${selectedOptions.length} selected`;
        }
        return selectedOptions[0]?.label || placeholder;
    };

    return (
        <div
            ref={dropdownRef}
            className={`relative ${className}`}
        >
            {/* Dropdown Trigger */}
            <div
                className={`
          w-full px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 ease-out
          backdrop-blur-sm border-2 relative overflow-hidden group
          ${disabled
                        ? 'bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed opacity-50 border-gray-200 dark:border-gray-700'
                        : 'bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg dark:hover:shadow-blue-500/10'
                    }
          ${isOpen
                        ? 'border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-100 dark:shadow-blue-500/20 bg-white dark:bg-gray-900'
                        : ''
                    }
        `}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex justify-between items-center relative z-10">
                    <div className="flex flex-wrap gap-2 flex-1 min-h-[24px]">
                        {isMulti ? (
                            selectedOptions.length > 0 ? (
                                selectedOptions.map(option => (
                                    <span
                                        key={option.value}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                                    >
                                        <span>{option.label}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => removeSelected(option.value, e)}
                                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors duration-200"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-500 dark:text-gray-400 font-medium">{placeholder}</span>
                            )
                        ) : (
                            <span className={`font-medium ${selectedOptions.length > 0 ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                {getDisplayText()}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 ml-3">
                        {isMulti && selectedOptions.length > 0 && (
                            <button
                                type="button"
                                onClick={clearAll}
                                className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 text-sm font-medium transition-colors duration-200"
                            >
                                Clear
                            </button>
                        )}
                        <svg
                            className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-all duration-300 ${isOpen ? 'rotate-180 text-blue-500 dark:text-blue-400' : ''
                                }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-2xl shadow-black/10 dark:shadow-black/30 max-h-72 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    {/* Search Input */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search options..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="py-2 overflow-auto max-h-52 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => {
                                const isSelected = selectedOptions.some(item => item.value === option.value);

                                return (
                                    <div
                                        key={option.value}
                                        className={`
                      mx-2 px-4 py-3 cursor-pointer transition-all duration-200 rounded-lg relative group
                      ${isSelected
                                                ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 shadow-sm'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:shadow-sm'
                                            }
                    `}
                                        onClick={() => handleSelect(option)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{option.label}</span>
                                            {isSelected && (
                                                <div className="flex items-center justify-center w-5 h-5 bg-blue-500 dark:bg-blue-600 rounded-full">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="font-medium">No options found</p>
                                <p className="text-sm mt-1 opacity-75">Try adjusting your search</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown;