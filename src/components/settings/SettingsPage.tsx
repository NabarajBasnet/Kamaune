'use client';

import { useState } from "react";
import {
    Bell,
    Globe,
    Clock,
    CreditCard,
    Shield,
    Eye,
    EyeOff,
    Key,
    Trash2,
    Settings as SettingsIcon,
    Save,
    RotateCcw,
    AlertTriangle,
    Smartphone,
    Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// Custom Switch component implemented inline
interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    className?: string;
}

const Switch = ({ checked, onCheckedChange, className = "" }: SwitchProps) => (
    <label
        className={`relative inline-flex items-center cursor-pointer ${className}`}
    >
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
    </label>
);

interface SettingsData {
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
        marketing: boolean;
    };
    privacy: {
        profileVisibility: "public" | "private" | "contacts";
        showEmail: boolean;
        showPhone: boolean;
        activityTracking: boolean;
    };
    preferences: {
        language: string;
        timezone: string;
        currency: string;
        dateFormat: string;
    };
    security: {
        twoFactor: boolean;
        loginAlerts: boolean;
        sessionTimeout: string;
    };
}

export function Settings() {
    const [activeTab, setActiveTab] = useState<
        "general" | "notifications" | "privacy" | "security"
    >("general");
    const [isEditing, setIsEditing] = useState(false);
    const [showEditConfirm, setShowEditConfirm] = useState(false);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [settings, setSettings] = useState<SettingsData>({
        notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: false,
        },
        privacy: {
            profileVisibility: "public",
            showEmail: false,
            showPhone: false,
            activityTracking: true,
        },
        preferences: {
            language: "en",
            timezone: "UTC-5",
            currency: "USD",
            dateFormat: "MM/DD/YYYY",
        },
        security: {
            twoFactor: false,
            loginAlerts: true,
            sessionTimeout: "30",
        },
    });

    const handleNotificationChange = (
        key: keyof SettingsData["notifications"],
        value: boolean
    ) => {
        setSettings((prev) => ({
            ...prev,
            notifications: { ...prev.notifications, [key]: value },
        }));
    };

    const handlePrivacyChange = (
        key: keyof SettingsData["privacy"],
        value: any
    ) => {
        setSettings((prev) => ({
            ...prev,
            privacy: { ...prev.privacy, [key]: value },
        }));
    };

    const handlePreferenceChange = (
        key: keyof SettingsData["preferences"],
        value: string
    ) => {
        setSettings((prev) => ({
            ...prev,
            preferences: { ...prev.preferences, [key]: value },
        }));
    };

    const handleSecurityChange = (
        key: keyof SettingsData["security"],
        value: any
    ) => {
        setSettings((prev) => ({
            ...prev,
            security: { ...prev.security, [key]: value },
        }));
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setIsEditing(false);
        } else {
            setShowEditConfirm(true);
        }
    };

    const confirmEdit = () => {
        setIsEditing(true);
        setShowEditConfirm(false);
    };

    const handleSaveChanges = () => {
        setShowSaveConfirm(true);
    };

    const confirmSave = () => {
        setIsEditing(false);
        setShowSaveConfirm(false);
    };

    const handleResetDefaults = () => {
        setSettings({
            notifications: {
                email: true,
                push: true,
                sms: false,
                marketing: false,
            },
            privacy: {
                profileVisibility: "public",
                showEmail: false,
                showPhone: false,
                activityTracking: true,
            },
            preferences: {
                language: "en",
                timezone: "UTC-5",
                currency: "USD",
                dateFormat: "MM/DD/YYYY",
            },
            security: {
                twoFactor: false,
                loginAlerts: true,
                sessionTimeout: "30",
            },
        });
    };

    const tabs = [
        { id: "general", label: "General", icon: SettingsIcon },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "privacy", label: "Privacy", icon: Eye },
        { id: "security", label: "Security", icon: Shield },
    ] as const;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Settings
                </h1>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Settings Navigation */}
                <Card className="glass rounded-xl p-6">
                    <div className="flex flex-wrap gap-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <Button
                                    key={tab.id}
                                    variant={activeTab === tab.id ? "default" : "ghost"}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-4 py-2 ${activeTab === tab.id
                                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                        : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {tab.label}
                                </Button>
                            );
                        })}
                    </div>
                </Card>

                {/* General Settings */}
                {activeTab === "general" && (
                    <Card className="glass rounded-xl p-6 space-y-6">
                        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                            General Preferences
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                    <Globe className="w-4 h-4 inline mr-2" />
                                    Language
                                </label>
                                <select
                                    value={settings.preferences.language}
                                    onChange={(e) =>
                                        handlePreferenceChange("language", e.target.value)
                                    }
                                    className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                    <option value="it">Italian</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                    <Clock className="w-4 h-4 inline mr-2" />
                                    Timezone
                                </label>
                                <select
                                    value={settings.preferences.timezone}
                                    onChange={(e) =>
                                        handlePreferenceChange("timezone", e.target.value)
                                    }
                                    className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                >
                                    <option value="UTC-12">UTC-12:00</option>
                                    <option value="UTC-8">UTC-08:00 (PST)</option>
                                    <option value="UTC-5">UTC-05:00 (EST)</option>
                                    <option value="UTC+0">UTC+00:00 (GMT)</option>
                                    <option value="UTC+1">UTC+01:00 (CET)</option>
                                    <option value="UTC+8">UTC+08:00 (CST)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                    <CreditCard className="w-4 h-4 inline mr-2" />
                                    Currency
                                </label>
                                <select
                                    value={settings.preferences.currency}
                                    onChange={(e) =>
                                        handlePreferenceChange("currency", e.target.value)
                                    }
                                    className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                >
                                    <option value="USD">US Dollar (USD)</option>
                                    <option value="EUR">Euro (EUR)</option>
                                    <option value="GBP">British Pound (GBP)</option>
                                    <option value="JPY">Japanese Yen (JPY)</option>
                                    <option value="INR">Indian Rupee (INR)</option>
                                    <option value="NPR">Nepalese Rupee (NPR)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                    Date Format
                                </label>
                                <select
                                    value={settings.preferences.dateFormat}
                                    onChange={(e) =>
                                        handlePreferenceChange("dateFormat", e.target.value)
                                    }
                                    className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                >
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                                </select>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Button
                                    onClick={handleSaveChanges}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 text-base"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </Button>
                                <Button
                                    onClick={() => setIsEditing(false)}
                                    variant="outline"
                                    className="flex-1 py-3 px-6 text-base"
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </Card>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                    <Card className="glass rounded-xl p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                                    Notification Preferences
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Manage how and when you receive notifications
                                </p>
                            </div>
                            {!isEditing && (
                                <Button
                                    onClick={handleEditToggle}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Settings
                                </Button>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        Email Notifications
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Receive important updates and alerts via email
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.notifications.email}
                                    onCheckedChange={(checked) =>
                                        isEditing && handleNotificationChange("email", checked)
                                    }
                                    className={!isEditing ? "opacity-50 pointer-events-none" : ""}
                                />
                            </div>

                            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        Push Notifications
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Get instant browser notifications for real-time updates
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.notifications.push}
                                    onCheckedChange={(checked) =>
                                        isEditing && handleNotificationChange("push", checked)
                                    }
                                    className={!isEditing ? "opacity-50 pointer-events-none" : ""}
                                />
                            </div>

                            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        SMS Notifications
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Receive critical alerts via text message to your phone
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.notifications.sms}
                                    onCheckedChange={(checked) =>
                                        isEditing && handleNotificationChange("sms", checked)
                                    }
                                    className={!isEditing ? "opacity-50 pointer-events-none" : ""}
                                />
                            </div>

                            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        Marketing Communications
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Stay updated with promotional content, newsletters, and
                                        product announcements
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.notifications.marketing}
                                    onCheckedChange={(checked) =>
                                        isEditing && handleNotificationChange("marketing", checked)
                                    }
                                    className={!isEditing ? "opacity-50 pointer-events-none" : ""}
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Button
                                    onClick={handleSaveChanges}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 text-base"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </Button>
                                <Button
                                    onClick={() => setIsEditing(false)}
                                    variant="outline"
                                    className="flex-1 py-3 px-6 text-base"
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </Card>
                )}

                {/* Privacy Settings */}
                {activeTab === "privacy" && (
                    <Card className="glass rounded-xl p-6 space-y-6">
                        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                            Privacy Settings
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                    Profile Visibility
                                </label>
                                <select
                                    value={settings.privacy.profileVisibility}
                                    onChange={(e) =>
                                        handlePrivacyChange("profileVisibility", e.target.value)
                                    }
                                    className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                >
                                    <option value="public">Public - Visible to everyone</option>
                                    <option value="private">Private - Only visible to you</option>
                                    <option value="contacts">
                                        Contacts Only - Visible to your contacts
                                    </option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                            Show Email Address
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Display your email on your public profile
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.privacy.showEmail}
                                        onCheckedChange={(checked) =>
                                            handlePrivacyChange("showEmail", checked)
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                            Show Phone Number
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Display your phone number on your public profile
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.privacy.showPhone}
                                        onCheckedChange={(checked) =>
                                            handlePrivacyChange("showPhone", checked)
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                            Activity Tracking
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Allow tracking of your activity for analytics
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.privacy.activityTracking}
                                        onCheckedChange={(checked) =>
                                            handlePrivacyChange("activityTracking", checked)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                    <Card className="glass rounded-xl p-6 space-y-6">
                        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                            Security Settings
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                        Two-Factor Authentication
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Add an extra layer of security to your account
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Switch
                                        checked={settings.security.twoFactor}
                                        onCheckedChange={(checked) =>
                                            handleSecurityChange("twoFactor", checked)
                                        }
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-emerald-600 hover:text-emerald-700"
                                    >
                                        <Smartphone className="w-4 h-4 mr-1" />
                                        Setup
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                        Login Alerts
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Get notified when someone logs into your account
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.security.loginAlerts}
                                    onCheckedChange={(checked) =>
                                        handleSecurityChange("loginAlerts", checked)
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                    Session Timeout
                                </label>
                                <select
                                    value={settings.security.sessionTimeout}
                                    onChange={(e) =>
                                        handleSecurityChange("sessionTimeout", e.target.value)
                                    }
                                    className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                >
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="120">2 hours</option>
                                    <option value="never">Never</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                    Password Management
                                </h4>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                        <Key className="w-4 h-4 mr-2" />
                                        Change Password
                                    </Button>
                                    <Button variant="outline">Download Recovery Codes</Button>
                                </div>
                            </div>

                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 rounded-lg p-4">
                                <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 flex items-center">
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Danger Zone
                                </h4>
                                <p className="text-sm text-red-600 dark:text-red-300 mb-3">
                                    These actions cannot be undone.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button variant="destructive">
                                        <EyeOff className="w-4 h-4 mr-2" />
                                        Deactivate Account
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="bg-red-800 hover:bg-red-900"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Confirmation Dialogs */}
                {showEditConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <Card className="p-6 max-w-md mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Do you want to edit?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                You're about to enter edit mode. You'll be able to modify your
                                settings.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    onClick={confirmEdit}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    Yes, Edit
                                </Button>
                                <Button
                                    onClick={() => setShowEditConfirm(false)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {showSaveConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <Card className="p-6 max-w-md mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Are you sure you want to save changes?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                This will update your settings with the new values you've
                                entered.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    onClick={confirmSave}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    Yes, Save
                                </Button>
                                <Button
                                    onClick={() => setShowSaveConfirm(false)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Reset to Defaults Button */}
                {!isEditing && (
                    <div className="flex justify-center">
                        <Button
                            onClick={handleResetDefaults}
                            variant="outline"
                            className="px-8 py-3"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset to Defaults
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
