'use client';

import { logoutService } from "@/services/auth/auth.service";
import { TbLayoutSidebarRightCollapse, TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "@/states/store/slicer";
import { Sun, Moon, User, ChevronDown, CheckCircle, Info, AlertCircle, DollarSignIcon, Bell, LogOut, Settings, CreditCard, User as UserIcon, Mail, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useRef } from "react";
import MobileSidebar from "./MobileSidebar";
import ThemeToggleButton from "./ThemeToggle";
import { RootState } from "@/states/store";
import { useQuery } from "@tanstack/react-query";
import { getProfileData } from "@/services/userprofiles/userprofile.service";
import { UserProfile } from "@/types/profile";

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
        setShowProfile(false);
    };

    // Get profile data with proper typing
    const { data, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfileData()
    });

    const profileData: UserProfile | null = data?.data?.results?.[0] || null;

    function getInitials(user: { first_name: string; last_name: string } | undefined) {
        if (!user) return 'U';
        return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
    }

    function getFullName(user: { first_name: string; last_name: string } | undefined) {
        if (!user) return 'User';
        return `${user.first_name} ${user.last_name}`.trim();
    }

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (profileRef.current && !(profileRef.current as any).contains(event.target)) {
                setShowProfile(false);
            }
            if (notificationRef.current && !(notificationRef.current as any).contains(event.target)) {
                setShowNotifications(false);
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

    const logout = async () => {
        await logoutService()
        router.push('/login');
    };


    return (
        <div className="w-full sticky top-0 flex items-center justify-between p-3 py-4 dark:bg-gray-900 bg-white shadow z-50">
            <div>
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="p-2 hidden md:flex rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {clientSidebar ? (
                        <TbLayoutSidebarRightCollapse className="w-6 h-6 text-green-600" />
                    ) : (
                        <TbLayoutSidebarLeftCollapse className="w-6 h-6 text-green-600" />
                    )}
                </button>

                <MobileSidebar profileData={profileData} logout={logout} />
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
                        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {notifications.filter(n => n.unread).length} unread
                                </span>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer ${notification.unread ? 'bg-green-50/50 dark:bg-green-900/20' : ''
                                            }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`p-1.5 rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
                                                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300' :
                                                    'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                                                }`}>
                                                <notification.icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {notification.title}
                                                    </p>
                                                    {notification.unread && (
                                                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 ml-2"></div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                    {notification.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    onClick={() => {
                                        handleNavigation('/notifications');
                                        setShowNotifications(false);
                                    }}
                                    className="w-full text-center text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
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
                        {profileData?.profile_picture ? (
                            <img
                                src={profileData.profile_picture}
                                alt={getFullName(profileData.user)}
                                className="w-8 h-8 rounded-full object-cover border-2 border-green-500"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium">
                                {getInitials(profileData?.user)}
                            </div>
                        )}
                        <ChevronDown
                            className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''
                                }`}
                        />
                    </button>

                    {/* Profile Dropdown */}
                    {showProfile && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                            {/* Profile Header */}
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center space-x-3">
                                    {profileData?.profile_picture ? (
                                        <img
                                            src={profileData.profile_picture}
                                            alt={getFullName(profileData.user)}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-medium">
                                            {getInitials(profileData?.user)}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                            {getFullName(profileData?.user)}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center">
                                            <Mail className="w-3 h-3 mr-1" />
                                            {profileData?.user.email}
                                        </p>
                                        {profileData?.city && (
                                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate flex items-center mt-1">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {profileData.city}
                                                {profileData.country && `, ${profileData.country}`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Wallet Balance */}
                            {profileData?.wallet && (
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Wallet Balance</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                {profileData.wallet.balance} {profileData.wallet.currency}
                                            </p>
                                        </div>
                                        <CreditCard className="w-8 h-8 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                            )}

                            {/* Menu Items */}
                            <div className="p-2">
                                <button
                                    onClick={() => handleNavigation('/dashboard/profile')}
                                    className="w-full flex cursor-pointer items-center space-x-3 p-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                                >
                                    <UserIcon className="w-4 h-4" />
                                    <span>View Profile</span>
                                </button>

                                <button
                                    onClick={() => handleNavigation('/dashboard/settings')}
                                    className="w-full flex cursor-pointer items-center space-x-3 p-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                                >
                                    <Settings className="w-4 h-4" />
                                    <span>Settings</span>
                                </button>

                                {profileData?.wallet && (
                                    <button
                                        onClick={() => handleNavigation('/wallet')}
                                        className="w-full flex items-center space-x-3 p-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        <span>Wallet & Payments</span>
                                    </button>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    onClick={() => {
                                        logout()
                                    }}
                                    className="w-full cursor-pointer flex items-center space-x-3 p-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header;
