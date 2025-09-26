'use client';

import { RiSidebarUnfoldLine, RiSidebarFoldLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "@/states/store/slicer";
import { Sun, Moon, User, ChevronDown, CheckCircle, Info, AlertCircle, DollarSignIcon, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useRef } from "react";
import MobileSidebar from "./MobileSidebar";
import ThemeToggleButton from "./ThemeToggle";
import { RootState } from "@/states/store";

const Header = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const clientSidebar = useSelector((state: RootState) => state.main.sidebarMinimized);
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const profileRef = useRef(null);
    const notificationRef = useRef(null);

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    function getInitials(name: string | undefined) {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (profileRef.current && !(profileRef.current as any).contains(event.target)) {
                setShowProfile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sample notifications
    const notifications = [
        {
            id: 1,
            type: 'success',
            title: 'Proposal Accepted',
            message: 'Your proposal for "React Developer" has been accepted!',
            time: '2 minutes ago',
            unread: true,
            icon: CheckCircle
        },
        {
            id: 2,
            type: 'info',
            title: 'New Job Match',
            message: 'We found 3 new jobs matching your skills',
            time: '1 hour ago',
            unread: true,
            icon: Info
        },
        {
            id: 3,
            type: 'warning',
            title: 'Contract Ending Soon',
            message: 'Your contract with TechCorp ends in 3 days',
            time: '2 hours ago',
            unread: false,
            icon: AlertCircle
        },
        {
            id: 4,
            type: 'success',
            title: 'Payment Received',
            message: 'You received $850 for completed work',
            time: '1 day ago',
            unread: false,
            icon: DollarSignIcon
        },
        {
            id: 5,
            type: 'info',
            title: 'Profile View',
            message: 'Your profile was viewed 15 times this week',
            time: '2 days ago',
            unread: false,
            icon: User
        }
    ];

    return (
        <div className="w-full sticky top-0 flex items-center justify-between p-3 py-4 dark:bg-gray-900 bg-white shadow z-50">
            <div>
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="p-2 hidden md:flex rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {clientSidebar ? (
                        <RiSidebarUnfoldLine className="w-6 h-6 text-green-600" />
                    ) : (
                        <RiSidebarFoldLine className="w-6 h-6 text-green-600" />
                    )}
                </button>

                <MobileSidebar />
            </div>

            <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="hidden md:flex items-center justify-center cursor-pointer w-9 h-9 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 relative"
                    >
                        <Bell className="h-4 w-4" />
                        {notifications.filter(n => n.unread).length > 0 && (
                            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                                <span className="text-xs text-gray-500">
                                    {notifications.filter(n => n.unread).length} unread
                                </span>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${notification.unread ? 'bg-green-50/50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`p-1.5 rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-600' :
                                                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                <notification.icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {notification.title}
                                                    </p>
                                                    {notification.unread && (
                                                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 ml-2"></div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {notification.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        handleNavigation('/notifications');
                                        setShowNotifications(false);
                                    }}
                                    className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium"
                                >
                                    View All Notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Theme Toggle */}
                <ThemeToggleButton />

                {/* Profile / Account Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center space-x-2 cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium">
                            {getInitials('Admin')}
                        </div>
                        <ChevronDown
                            className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''
                                }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header;
