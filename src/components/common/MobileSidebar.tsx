import { RiSidebarUnfoldLine, RiSidebarFoldLine } from "react-icons/ri";
import { LogOut, ChevronDown } from "lucide-react";
import React, { useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { menuItems, accountMenuItems } from '@/constants/sidebar';
import Link from 'next/link';
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from '@/states/store/slicer';
import { RootState } from "@/states/store";
import { usePathname, useRouter } from 'next/navigation';

function MobileSidebar() {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const clientSidebar = useSelector((state: RootState) => state.main.sidebarMinimized);
    const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

    const logout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const toggleMenu = (menuIndex: string) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuIndex]: !prev[menuIndex]
        }));
    };

    const isActiveRoute = (path: string) => {
        return pathname === path || pathname.startsWith(path + '/');
    };

    const renderMenuItem = (item: any, index: number, type: 'main' | 'account' = 'main') => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedMenus[`${type}-${index}`];
        const isActive = isActiveRoute(item.path);
        const menuKey = `${type}-${index}`;

        return (
            <div key={menuKey}>
                <div
                    className={`
                        group flex items-center p-3 gap-3 rounded-lg transition-all duration-200
                        ${isActive
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400'
                        }
                        ${hasSubItems ? 'cursor-pointer' : ''}
                    `}
                    onClick={() => {
                        if (hasSubItems) {
                            toggleMenu(menuKey);
                        } else {
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
                </div>

                {/* Sub Menu Items */}
                {hasSubItems && (
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
        <Sheet>
            <SheetTrigger asChild>
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="p-2 flex md:hidden rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {clientSidebar ? (
                        <RiSidebarUnfoldLine className="w-6 h-6 text-green-600" />
                    ) : (
                        <RiSidebarFoldLine className="w-6 h-6 text-green-600" />
                    )}
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
                {/* Header */}
                <header className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center h-10 justify-start px-4">
                        <span className="font-bold tracking-wide bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent text-2xl">
                            Kamaune
                        </span>
                    </div>
                </header>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent max-h-[calc(100vh-160px)]">
                    {/* Main Menu Items */}
                    {menuItems.map((item, index) => renderMenuItem(item, index, 'main'))}

                    {/* Separator */}
                    <div className="my-4">
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    </div>

                    {/* Account Menu Items */}
                    {accountMenuItems.map((item, index) => renderMenuItem(item, index, 'account'))}
                </nav>

                {/* Footer */}
                <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={logout}
                        className="group flex items-center p-3 gap-4 w-full rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <LogOut className="w-6 h-6" />
                        <span className="text-base font-medium">Logout</span>
                    </button>
                </footer>
            </SheetContent>
        </Sheet>
    )
}

export default MobileSidebar