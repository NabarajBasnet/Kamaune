'use client';

import { menuItems, accountMenuItems } from '@/constants/sidebar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { RootState } from '@/states/store';

const Sidebar = () => {
    const router = useRouter();
    const clientSidebar = useSelector((state: RootState) => state.main.sidebarMinimized);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (!mounted) {
        return null;
    }

    return (
        <aside className={`
            ${clientSidebar ? 'w-20' : 'w-64'} 
            transition-all duration-300 ease-in-out 
            h-screen flex flex-col 
            bg-white dark:bg-gray-900 
            border-r border-gray-200 dark:border-gray-700
        `}>
            {/* Header */}
            <header className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className={`
                    ${clientSidebar ? 'justify-center' : 'justify-start px-4'}
                    flex items-center h-10
                `}>
                    <span className={`
                        font-bold tracking-wide 
                        bg-gradient-to-r from-green-500 to-green-600 
                        bg-clip-text text-transparent
                        ${clientSidebar ? 'text-xl' : 'text-2xl'}
                    `}>
                        {clientSidebar ? 'KM' : 'Kamaune'}
                    </span>
                </div>
            </header>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <TooltipProvider delayDuration={100}>
                    {/* Main Menu Items */}
                    {menuItems.map((item, index) => (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={item.path}
                                    className={`
                                        group flex items-center 
                                        ${clientSidebar ? 'justify-center p-3' : 'p-3 gap-4'} 
                                        rounded-lg transition-all duration-200
                                        text-gray-700 dark:text-gray-300
                                        hover:bg-green-50 dark:hover:bg-green-900/20
                                        hover:text-green-600 dark:hover:text-green-400
                                    `}
                                >
                                    <span className="text-green-500 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors [&>svg]:w-6 [&>svg]:h-6">
                                        {item.icon}
                                    </span>
                                    {!clientSidebar && (
                                        <span className="font-medium text-base text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors">
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            </TooltipTrigger>
                            {clientSidebar && (
                                <TooltipContent side="right" sideOffset={10} className="bg-gray-800 text-white">
                                    <p className="font-medium">{item.label}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    ))}

                    {/* Separator */}
                    <div className="my-4">
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    </div>

                    {/* Account Menu Items */}
                    {accountMenuItems.map((item, index) => (
                        <Tooltip key={`account-${index}`}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={item.path}
                                    className={`
                                        group flex items-center 
                                        ${clientSidebar ? 'justify-center p-3' : 'p-3 gap-4'} 
                                        rounded-lg transition-all duration-200
                                        text-gray-700 dark:text-gray-300
                                        hover:bg-green-50 dark:hover:bg-green-900/20
                                        hover:text-green-600 dark:hover:text-green-400
                                    `}
                                >
                                    <span className="text-green-500 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors [&>svg]:w-6 [&>svg]:h-6">
                                        {item.icon}
                                    </span>
                                    {!clientSidebar && (
                                        <span className="font-medium text-base text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors">
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            </TooltipTrigger>
                            {clientSidebar && (
                                <TooltipContent side="right" sideOffset={10} className="bg-gray-800 text-white">
                                    <p className="font-medium">{item.label}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </nav>

            {/* Footer */}
            <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={logout}
                            className={`
                                group flex cursor-pointer items-center 
                                ${clientSidebar ? 'justify-center p-3' : 'p-3 gap-3 w-full'} 
                                rounded-lg transition-all duration-200
                                text-gray-600 dark:text-gray-300
                                hover:text-red-600 dark:hover:text-red-400
                                hover:bg-red-50 dark:hover:bg-red-900/20
                            `}
                        >
                            <LogOut className="w-6 h-6" />
                            {!clientSidebar && (
                                <span className="text-base font-medium">Logout</span>
                            )}
                        </button>
                    </TooltipTrigger>
                    {clientSidebar && (
                        <TooltipContent side="right" sideOffset={10} className="bg-gray-800 text-white">
                            <p>Logout</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </footer>
        </aside>
    );
};

export default Sidebar;