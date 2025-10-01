'use client';

import { logoutService } from '@/services/auth/auth.service';
import { menuItems, accountMenuItems } from '@/constants/sidebar';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, ChevronDown, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { RootState } from '@/states/store';
import { toast } from 'sonner';

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const clientSidebar = useSelector((state: RootState) => state.main.sidebarMinimized);
    const [mounted, setMounted] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        setMounted(true);
    }, []);

    const logout = async () => {
        await logoutService();
        router.push('/login');
    };

    const toggleMenu = (menuIndex: string) => {
        if (clientSidebar) return;

        setExpandedMenus(prev => ({
            ...prev,
            [menuIndex]: !prev[menuIndex]
        }));
    };

    const isActiveRoute = (path: string) => {
        return pathname === path || pathname.startsWith(path + '/');
    };

    if (!mounted) {
        return null;
    }

    const renderMenuItem = (item: any, index: number, type: 'main' | 'account' = 'main') => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedMenus[`${type}-${index}`];
        const isActive = isActiveRoute(item.path);
        const menuKey = `${type}-${index}`;

        return (
            <div key={menuKey}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div
                            className={`
                                group flex items-center 
                                ${clientSidebar ? 'justify-center p-3' : 'p-3 gap-3'} 
                                rounded-lg transition-all duration-200
                                ${isActive
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400'
                                }
                                ${hasSubItems && !clientSidebar ? 'cursor-pointer' : ''}
                            `}
                            onClick={() => {
                                if (hasSubItems && !clientSidebar) {
                                    toggleMenu(menuKey);
                                } else if (!hasSubItems) {
                                    router.push(item.path);
                                }
                            }}
                        >
                            {!hasSubItems ? (
                                <Link href={item.path} className="flex items-center gap-3 w-full">
                                    <span className={`
                                        ${isActive
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-green-500 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300'
                                        } 
                                        transition-colors [&>svg]:w-6 [&>svg]:h-6
                                    `}>
                                        {item.icon}
                                    </span>
                                    {!clientSidebar && (
                                        <span className={`
                                            font-medium text-base flex-1
                                            ${isActive
                                                ? 'text-green-700 dark:text-green-300'
                                                : 'text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-300'
                                            } 
                                            transition-colors
                                        `}>
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            ) : (
                                <>
                                    <span className={`
                                        ${isActive
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-green-500 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300'
                                        } 
                                        transition-colors [&>svg]:w-6 [&>svg]:h-6
                                    `}>
                                        {item.icon}
                                    </span>
                                    {!clientSidebar && (
                                        <>
                                            <span className={`
                                                font-medium text-base flex-1
                                                ${isActive
                                                    ? 'text-green-700 dark:text-green-300'
                                                    : 'text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-300'
                                                } 
                                                transition-colors
                                            `}>
                                                {item.label}
                                            </span>
                                            <span className={`
                                                ${isActive
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-300'
                                                } 
                                                transition-all duration-200 [&>svg]:w-4 [&>svg]:h-4
                                                ${isExpanded ? 'rotate-180' : ''}
                                            `}>
                                                <ChevronDown />
                                            </span>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </TooltipTrigger>
                    {clientSidebar && (
                        <TooltipContent side="right" sideOffset={10} className="bg-gray-800 text-white">
                            <p className="font-medium">{item.label}</p>
                            {hasSubItems && item.subItems.map((subItem: any, subIndex: number) => (
                                <div key={subIndex} className="text-sm text-gray-300 mt-1">
                                    • {subItem.label}
                                </div>
                            ))}
                        </TooltipContent>
                    )}
                </Tooltip>

                {/* Sub Menu Items */}
                {hasSubItems && !clientSidebar && (
                    <div className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                    `}>
                        <div className="ml-6 mt-1 space-y-1">
                            {item.subItems.map((subItem: any, subIndex: number) => {
                                const isSubActive = isActiveRoute(subItem.path);
                                return (
                                    <Link
                                        key={subIndex}
                                        href={subItem.path}
                                        className={`
                                            group flex items-center gap-3 p-2 pl-6 rounded-lg 
                                            transition-all duration-200 relative
                                            ${isSubActive
                                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400'
                                            }
                                        `}
                                    >
                                        {/* Sub-menu indicator line */}
                                        <div className={`
                                            absolute left-0 top-0 bottom-0 w-0.5 rounded-r
                                            ${isSubActive
                                                ? 'bg-green-500'
                                                : 'bg-transparent group-hover:bg-green-300'
                                            }
                                            transition-colors duration-200
                                        `} />

                                        <span className={`
                                            ${isSubActive
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-green-400 dark:text-green-500 group-hover:text-green-500 dark:group-hover:text-green-400'
                                            } 
                                            transition-colors [&>svg]:w-4 [&>svg]:h-4
                                        `}>
                                            {subItem.icon}
                                        </span>
                                        <span className={`
                                            text-sm font-medium
                                            ${isSubActive
                                                ? 'text-green-700 dark:text-green-300'
                                                : 'text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400'
                                            } 
                                            transition-colors
                                        `}>
                                            {subItem.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

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
                    {menuItems.map((item, index) => renderMenuItem(item, index, 'main'))}

                    {/* Separator */}
                    <div className="my-4">
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    </div>

                    {/* Account Menu Items */}
                    {accountMenuItems.map((item, index) => renderMenuItem(item, index, 'account'))}
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