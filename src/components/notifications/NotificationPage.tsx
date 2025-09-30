'use client';

import { useState } from 'react'
import {
    Bell,
    Send,
    Plus,
    Coins,
    CreditCard,
    MessageSquare,
    CheckCircle,
    Clock,
    Search,
    Megaphone,
    Gift,
    Ticket,
    User,
    Filter,
    TrendingUp,
    AlertCircle,
    ChevronRight,
    Sparkles,
    Users,
    Target,
    BarChart3,
    X,
    Check,
    Zap,
    Calendar,
    DollarSign,
    Activity,
    Eye,
    MousePointerClick,
    Wallet
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type TabType = 'send' | 'templates' | 'history' | 'coins'

// Mock data
const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', isOnline: true },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', isOnline: false },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', isOnline: true },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', isOnline: true },
    { id: '5', name: 'David Brown', email: 'david@example.com', isOnline: false },
    { id: '6', name: 'Emily Davis', email: 'emily@example.com', isOnline: true },
    { id: '7', name: 'Chris Lee', email: 'chris@example.com', isOnline: false },
    { id: '8', name: 'Amanda Taylor', email: 'amanda@example.com', isOnline: true },
]

const mockTemplates = [
    { id: '1', title: 'Welcome Message', message: 'Welcome to our platform! We are excited to have you here.', type: 'general' as const, coinCost: 1 },
    { id: '2', title: 'Special Offer', message: 'Get 20% off your first purchase with this special offer!', type: 'offer' as const, coinCost: 3 },
    { id: '3', title: 'New Campaign', message: 'Check out our new campaign featuring amazing products.', type: 'campaign' as const, coinCost: 5 },
    { id: '4', title: 'Discount Coupon', message: 'Here is your exclusive 15% discount coupon: SAVE15', type: 'coupon' as const, coinCost: 2 },
    { id: '5', title: 'Weekly Newsletter', message: 'Your weekly newsletter with updates and news is here!', type: 'general' as const, coinCost: 1 },
]

const mockSentNotifications = [
    {
        id: '1',
        templateId: '1',
        recipientIds: ['1', '2', '3'],
        sentAt: new Date('2024-01-15').toISOString(),
        status: 'sent' as const,
        totalCost: 3,
        deliveryStats: {
            sent: 3,
            delivered: 3,
            opened: 2,
            clicked: 1
        }
    },
    {
        id: '2',
        templateId: '2',
        recipientIds: ['4', '5', '6', '7'],
        sentAt: new Date('2024-01-16').toISOString(),
        status: 'sent' as const,
        totalCost: 12,
        deliveryStats: {
            sent: 4,
            delivered: 4,
            opened: 3,
            clicked: 2
        }
    },
    {
        id: '3',
        templateId: '3',
        recipientIds: ['1', '3', '5', '7', '8'],
        sentAt: new Date('2024-01-17').toISOString(),
        status: 'sent' as const,
        totalCost: 25,
        deliveryStats: {
            sent: 5,
            delivered: 5,
            opened: 4,
            clicked: 3
        }
    }
]

let mockUserCoins = 1000;
let mockTemplatesList = [...mockTemplates];

// Mock API functions
const sendNotification = async (templateId: string, recipientIds: string[]): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    const template = mockTemplatesList.find(t => t.id === templateId);
    if (!template) return false;

    const totalCost = template.coinCost * recipientIds.length;

    if (mockUserCoins >= totalCost) {
        mockUserCoins -= totalCost;

        // Add to sent notifications
        mockSentNotifications.unshift({
            id: Date.now().toString(),
            templateId,
            recipientIds,
            sentAt: new Date().toISOString(),
            status: 'sent',
            totalCost,
            deliveryStats: {
                sent: recipientIds.length,
                delivered: recipientIds.length,
                opened: Math.floor(recipientIds.length * 0.8),
                clicked: Math.floor(recipientIds.length * 0.6)
            }
        });

        return true;
    }
    return false;
}

const addTemplate = (template: any) => {
    const newTemplate = {
        ...template,
        id: Date.now().toString()
    };
    mockTemplatesList.push(newTemplate);
}

const buyCoins = async (amount: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    mockUserCoins += amount;
    return true;
}

const getTemplate = (templateId: string) => {
    return mockTemplatesList.find(t => t.id === templateId);
}

export function Notifications() {
    const [activeTab, setActiveTab] = useState<TabType>('send')
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [selectedTemplate, setSelectedTemplate] = useState<string>('')
    const [searchQuery, setSearchQuery] = useState('')
    const [userFilter, setUserFilter] = useState<'all' | 'online' | 'offline'>('all')
    const [isLoading, setIsLoading] = useState(false)
    const [showNewTemplate, setShowNewTemplate] = useState(false)
    const [newTemplate, setNewTemplate] = useState({
        title: '',
        message: '',
        type: 'general' as const,
        coinCost: 1
    })
    const [coinPackage, setCoinPackage] = useState(500)
    const [notificationSent, setNotificationSent] = useState(false)
    const [userCoins, setUserCoins] = useState(mockUserCoins)
    const [templates, setTemplates] = useState(mockTemplatesList)
    const [sentNotifications, setSentNotifications] = useState(mockSentNotifications)
    const [users] = useState(mockUsers)

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = userFilter === 'all' ||
            (userFilter === 'online' && user.isOnline) ||
            (userFilter === 'offline' && !user.isOnline)
        return matchesSearch && matchesFilter
    })

    const selectedTemplateData = templates.find(t => t.id === selectedTemplate)
    const totalCost = selectedTemplateData ? selectedTemplateData.coinCost * selectedUsers.length : 0

    const handleUserToggle = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        )
    }

    const handleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([])
        } else {
            setSelectedUsers(filteredUsers.map(user => user.id))
        }
    }

    const handleSendNotification = async () => {
        if (!selectedTemplate || selectedUsers.length === 0) return

        setIsLoading(true)
        const success = await sendNotification(selectedTemplate, selectedUsers)

        if (success) {
            setSelectedUsers([])
            setSelectedTemplate('')
            setNotificationSent(true)
            setUserCoins(mockUserCoins)
            setSentNotifications([...mockSentNotifications])
            setTimeout(() => setNotificationSent(false), 3000)
            setTimeout(() => setActiveTab('history'), 500)
        } else {
            alert('Insufficient coins or failed to send notification')
        }
        setIsLoading(false)
    }

    const handleCreateTemplate = () => {
        if (!newTemplate.title || !newTemplate.message) return

        addTemplate(newTemplate)
        setTemplates([...mockTemplatesList])
        setNewTemplate({ title: '', message: '', type: 'general', coinCost: 1 })
        setShowNewTemplate(false)
    }

    const handleBuyCoins = async () => {
        setIsLoading(true)
        const success = await buyCoins(coinPackage)
        if (success) {
            setUserCoins(mockUserCoins)
        }
        setIsLoading(false)
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'campaign': return <Megaphone className="w-4 h-4" />
            case 'offer': return <Gift className="w-4 h-4" />
            case 'coupon': return <Ticket className="w-4 h-4" />
            default: return <MessageSquare className="w-4 h-4" />
        }
    }

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'campaign': return 'bg-blue-500/20 text-blue-400'
            case 'offer': return 'bg-emerald-500/20 text-emerald-400'
            case 'coupon': return 'bg-purple-500/20 text-purple-400'
            default: return 'bg-gray-500/20 text-gray-400'
        }
    }

    // Stats for dashboard
    const stats = [
        {
            title: 'Total Sent',
            value: sentNotifications.reduce((acc, n) => acc + n.recipientIds.length, 0).toLocaleString(),
            icon: Send,
            iconClass: 'text-emerald-400',
            bgClass: 'bg-emerald-500/20'
        },
        {
            title: 'Open Rate',
            value: sentNotifications.length > 0
                ? `${Math.round(sentNotifications.reduce((acc, n) => acc + (n.deliveryStats.opened / n.deliveryStats.sent * 100), 0) / sentNotifications.length)}%`
                : '0%',
            icon: Eye,
            iconClass: 'text-blue-400',
            bgClass: 'bg-blue-500/20'
        },
        {
            title: 'Active Users',
            value: users.filter(u => u.isOnline).length.toLocaleString(),
            icon: Users,
            iconClass: 'text-purple-400',
            bgClass: 'bg-purple-500/20'
        },
        {
            title: 'Coins Used',
            value: sentNotifications.reduce((acc, n) => acc + n.totalCost, 0).toLocaleString(),
            icon: Coins,
            iconClass: 'text-yellow-400',
            bgClass: 'bg-yellow-500/20'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Header with Balance */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notifications</h1>
                    <p className="text-gray-600 dark:text-gray-400">Send targeted messages to your users</p>
                </div>

                {/* Coin Balance Card */}
                <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Available Coins</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{userCoins.toLocaleString()}</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveTab('coins')}
                            className="ml-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/50"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Buy
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.title} className="glass rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-400">{stat.title}</h3>
                            <stat.icon className={`w-8 h-8 ${stat.iconClass}`} />
                        </div>
                        <p className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white">{stat.value}</p>
                        <div className={`h-1 w-full rounded-full overflow-hidden ${stat.bgClass}`}>
                            <div className={`h-full w-3/4 rounded-full ${stat.iconClass.replace('text-', 'bg-')}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-800">
                <nav className="-mb-px flex space-x-8">
                    {[
                        { id: 'send', name: 'Send', icon: Send },
                        { id: 'templates', name: 'Templates', icon: MessageSquare },
                        { id: 'history', name: 'History', icon: Clock },
                        { id: 'coins', name: 'Store', icon: Coins }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                ? 'border-emerald-400 text-emerald-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Send Tab */}
            {activeTab === 'send' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Selection */}
                    <div className="lg:col-span-2">
                        <div className="glass rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Recipients</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {selectedUsers.length} selected
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSelectAll}
                                        className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/50"
                                    >
                                        {selectedUsers.length === filteredUsers.length ? 'Deselect All' : 'Select All'}
                                    </Button>
                                </div>
                            </div>

                            {/* Search and Filter */}
                            <div className="flex gap-3 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500"
                                    />
                                </div>
                                <select
                                    value={userFilter}
                                    onChange={(e) => setUserFilter(e.target.value as any)}
                                    className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                                >
                                    <option value="all">All Users</option>
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                </select>
                            </div>

                            {/* User List */}
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => handleUserToggle(user.id)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedUsers.includes(user.id)
                                            ? 'bg-emerald-500/20 border-emerald-500/50'
                                            : 'bg-gray-100 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-900/50'
                                            }`}
                                    >
                                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-emerald-400' : 'bg-gray-600'
                                                }`} />
                                            {selectedUsers.includes(user.id) && (
                                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Template Selection & Send */}
                    <div className="space-y-6">
                        {/* Template Selection */}
                        <div className="glass rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Choose Template</h3>

                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {templates.map((template) => (
                                    <div
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template.id)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedTemplate === template.id
                                            ? 'bg-emerald-500/20 border-emerald-500/50'
                                            : 'bg-gray-100 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-900/50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded ${getTypeStyles(template.type)}`}>
                                                    {getTypeIcon(template.type)}
                                                </div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">{template.title}</h4>
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-400">
                                                <Coins className="w-3 h-3" />
                                                <span className="text-xs font-medium">{template.coinCost}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{template.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cost Summary */}
                        {selectedTemplate && selectedUsers.length > 0 && (
                            <div className="glass rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Cost</span>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-emerald-400">{totalCost}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">coins</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Recipients</span>
                                        <span>{selectedUsers.length}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Cost per user</span>
                                        <span>{selectedTemplateData?.coinCost}</span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-800">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Balance after</span>
                                            <span className={`font-bold ${userCoins - totalCost >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {userCoins - totalCost}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Send Button */}
                        <Button
                            onClick={handleSendNotification}
                            disabled={!selectedTemplate || selectedUsers.length === 0 || totalCost > userCoins || isLoading}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Send to {selectedUsers.length} Users
                                </>
                            )}
                        </Button>

                        {totalCost > userCoins && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                                <p className="text-sm text-red-400 text-center">
                                    Insufficient coins. Need {totalCost - userCoins} more.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Message Templates</h3>
                        <Button
                            onClick={() => setShowNewTemplate(true)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Template
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {templates.map((template) => (
                            <div key={template.id} className="glass rounded-xl p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded ${getTypeStyles(template.type)}`}>
                                            {getTypeIcon(template.type)}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white">{template.title}</h4>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">{template.type}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        <Coins className="w-4 h-4" />
                                        <span className="text-sm font-medium">{template.coinCost}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{template.message}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/50"
                                    onClick={() => {
                                        setSelectedTemplate(template.id)
                                        setActiveTab('send')
                                    }}
                                >
                                    Use Template
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div>
                    <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Notification History</h3>

                    {sentNotifications.length === 0 ? (
                        <div className="glass rounded-xl p-8 text-center">
                            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No notifications sent yet</h3>
                            <p className="text-gray-600 dark:text-gray-400">Start sending notifications to see your history here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sentNotifications.map((notification) => {
                                const template = getTemplate(notification.templateId)
                                const openRate = Math.round((notification.deliveryStats.opened / notification.deliveryStats.sent) * 100)
                                const clickRate = Math.round((notification.deliveryStats.clicked / notification.deliveryStats.sent) * 100)

                                return (
                                    <div key={notification.id} className="glass rounded-xl p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="font-medium text-white mb-1">
                                                    {template?.title || 'Unknown Template'}
                                                </h4>
                                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        {notification.recipientIds.length} recipients
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(notification.sentAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Coins className="w-4 h-4" />
                                                        {notification.totalCost} coins
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${notification.status === 'sent'
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {notification.status}
                                            </span>
                                        </div>

                                        {/* Delivery Stats */}
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{notification.deliveryStats.sent}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Sent</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-blue-400">{notification.deliveryStats.delivered}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Delivered</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-emerald-400">{notification.deliveryStats.opened}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Opened ({openRate}%)</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-purple-400">{notification.deliveryStats.clicked}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Clicked ({clickRate}%)</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Buy Coins Tab */}
            {activeTab === 'coins' && (
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Purchase Coins</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[
                            { amount: 100, price: 9.99, popular: false },
                            { amount: 500, price: 39.99, popular: true },
                            { amount: 1000, price: 69.99, popular: false }
                        ].map((pkg) => (
                            <div
                                key={pkg.amount}
                                className={`glass rounded-xl p-6 cursor-pointer transition-all transform hover:scale-105 ${coinPackage === pkg.amount
                                    ? 'ring-2 ring-emerald-400'
                                    : ''
                                    } ${pkg.popular ? 'relative' : ''}`}
                                onClick={() => setCoinPackage(pkg.amount)}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                        <Coins className="w-8 h-8 text-yellow-400" />
                                    </div>

                                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {pkg.amount.toLocaleString()} Coins
                                    </h4>

                                    <p className="text-3xl font-bold text-emerald-400 mb-4">
                                        ${pkg.price}
                                    </p>

                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        ${(pkg.price / pkg.amount).toFixed(3)} per coin
                                    </p>

                                    {coinPackage === pkg.amount && (
                                        <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mt-4" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={handleBuyCoins}
                        disabled={isLoading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 text-lg font-semibold"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-5 h-5 mr-2" />
                                Purchase {coinPackage.toLocaleString()} Coins for ${
                                    coinPackage === 100 ? '9.99' :
                                        coinPackage === 500 ? '39.99' : '69.99'
                                }
                            </>
                        )}
                    </Button>

                    {/* Coin Usage Info */}
                    <div className="glass rounded-xl p-6 mt-8">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">How Coins Work</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-blue-500/20">
                                    <Megaphone className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Campaign</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">5 coins per user</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-emerald-500/20">
                                    <Gift className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Offer</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">3 coins per user</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-purple-500/20">
                                    <Ticket className="w-4 h-4 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Coupon</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">2 coins per user</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Template Modal */}
            {showNewTemplate && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass rounded-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Template</h3>
                                <button
                                    onClick={() => setShowNewTemplate(false)}
                                    className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Template Title
                                </label>
                                <input
                                    type="text"
                                    value={newTemplate.title}
                                    onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                                    placeholder="Enter template title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Message
                                </label>
                                <textarea
                                    value={newTemplate.message}
                                    onChange={(e) => setNewTemplate(prev => ({ ...prev, message: e.target.value }))}
                                    rows={4}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900 dark:text-white resize-none"
                                    placeholder="Enter notification message"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Type
                                    </label>
                                    <select
                                        value={newTemplate.type}
                                        onChange={(e) => setNewTemplate(prev => ({ ...prev, type: e.target.value as any }))}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                                    >
                                        <option value="general">General</option>
                                        <option value="campaign">Campaign</option>
                                        <option value="offer">Offer</option>
                                        <option value="coupon">Coupon</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Coin Cost
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newTemplate.coinCost}
                                        onChange={(e) => setNewTemplate(prev => ({ ...prev, coinCost: parseInt(e.target.value) || 1 }))}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowNewTemplate(false)}
                                className="flex-1 bg-transparent border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateTemplate}
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                                disabled={!newTemplate.title || !newTemplate.message}
                            >
                                Create Template
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {notificationSent && (
                <div className="fixed bottom-8 right-8 z-50">
                    <div className="glass rounded-lg px-6 py-4 flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                        <div>
                            <p className="font-semibold text-white">Success!</p>
                            <p className="text-sm text-gray-400">Notification sent successfully</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}