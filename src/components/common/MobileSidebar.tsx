import { RiSidebarUnfoldLine, RiSidebarFoldLine } from "react-icons/ri";
import { LogOut } from "lucide-react";
import React from 'react'
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

function MobileSidebar() {
    const dispatch = useDispatch()
    const clientSidebar = useSelector((state: RootState) => state.main.sidebarMinimized);

    const logout = () => {
        localStorage.removeItem('token');
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
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    {/* Main Menu Items */}
                    {menuItems.map((item, index) => (
                        <Link
                            href={item.path}
                            key={index}
                            className="group flex items-center p-3 gap-4 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400"
                        >
                            <span className="text-green-500 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors [&>svg]:w-6 [&>svg]:h-6">
                                {item.icon}
                            </span>
                            <span className="font-medium text-base text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors">
                                {item.label}
                            </span>
                        </Link>
                    ))}

                    {/* Separator */}
                    <div className="my-4">
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    </div>

                    {/* Account Menu Items */}
                    {accountMenuItems.map((item, index) => (
                        <Link
                            href={item.path}
                            key={`account-${index}`}
                            className="group flex items-center p-3 gap-4 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400"
                        >
                            <span className="text-green-500 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors [&>svg]:w-6 [&>svg]:h-6">
                                {item.icon}
                            </span>
                            <span className="font-medium text-base text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors">
                                {item.label}
                            </span>
                        </Link>
                    ))}
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