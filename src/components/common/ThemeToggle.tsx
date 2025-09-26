import React from 'react'
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

function ThemeToggleButton() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-xl cursor-pointer bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 group"
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5">
                <Sun
                    className={`absolute inset-0 w-5 h-5 text-green-500 transition-all duration-300 ${theme === 'dark'
                        ? "opacity-0 rotate-90 scale-0"
                        : "opacity-100 rotate-0 scale-100"
                        }`}
                />
                <Moon
                    className={`absolute inset-0 w-5 h-5 text-green-500 transition-all duration-300 ${theme === 'dark'
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-90 scale-0"
                        }`}
                />
            </div>
        </button>
    )
}

export default ThemeToggleButton;
