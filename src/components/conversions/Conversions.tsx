'use client';

import { useState } from 'react'
import {
    TrendingUp,
    DollarSign,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    Search,
    Plus,
    Edit,
    Trash2,
    Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ConversionModal } from './ConversionModal';
import { DeleteModal } from '@/components/ui/DeleteModal'

// Define the ConversionData interface
interface ConversionData {
    id: string
    productName: string
    conversionType: string
    customerName: string
    customerEmail: string
    platformName: string
    conversionValue: number
    commissionAmount: number
    status: 'completed' | 'pending' | 'failed'
    timestamp: string
}

// Mock data for conversions
const mockConversions: ConversionData[] = [
    {
        id: '1',
        productName: 'Premium Software Suite',
        conversionType: 'Sale',
        customerName: 'John Smith',
        customerEmail: 'john.smith@email.com',
        platformName: 'Website',
        conversionValue: 299,
        commissionAmount: 59.80,
        status: 'completed',
        timestamp: '2024-01-15T10:30:00Z'
    },
    {
        id: '2',
        productName: 'Marketing Course',
        conversionType: 'Lead',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@email.com',
        platformName: 'Facebook',
        conversionValue: 97,
        commissionAmount: 19.40,
        status: 'pending',
        timestamp: '2024-01-14T14:20:00Z'
    },
    {
        id: '3',
        productName: 'E-book Bundle',
        conversionType: 'Sale',
        customerName: 'Mike Wilson',
        customerEmail: 'mike.wilson@email.com',
        platformName: 'Instagram',
        conversionValue: 49,
        commissionAmount: 9.80,
        status: 'completed',
        timestamp: '2024-01-13T09:15:00Z'
    },
    {
        id: '4',
        productName: 'Consultation Service',
        conversionType: 'Appointment',
        customerName: 'Emily Davis',
        customerEmail: 'emily.davis@email.com',
        platformName: 'LinkedIn',
        conversionValue: 150,
        commissionAmount: 30.00,
        status: 'failed',
        timestamp: '2024-01-12T16:45:00Z'
    },
    {
        id: '5',
        productName: 'Annual Subscription',
        conversionType: 'Subscription',
        customerName: 'Robert Brown',
        customerEmail: 'robert.b@email.com',
        platformName: 'Website',
        conversionValue: 499,
        commissionAmount: 99.80,
        status: 'completed',
        timestamp: '2024-01-11T11:20:00Z'
    }
]

// Mock functions for CRUD operations
const addConversion = (conversionData: Omit<ConversionData, 'id'>) => {
    console.log('Adding conversion:', conversionData)
    // In a real app, this would make an API call
    const newConversion: ConversionData = {
        ...conversionData,
        id: Date.now().toString()
    }
    mockConversions.unshift(newConversion)
}

const updateConversion = (id: string, updates: Partial<ConversionData>) => {
    console.log('Updating conversion:', id, updates)
    // In a real app, this would make an API call
    const index = mockConversions.findIndex(conv => conv.id === id)
    if (index !== -1) {
        mockConversions[index] = { ...mockConversions[index], ...updates }
    }
}

const deleteConversion = (id: string) => {
    console.log('Deleting conversion:', id)
    // In a real app, this would make an API call
    const index = mockConversions.findIndex(conv => conv.id === id)
    if (index !== -1) {
        mockConversions.splice(index, 1)
    }
}

export function Conversions() {
    const [conversions, setConversions] = useState<ConversionData[]>(mockConversions)
    const [searchQuery, setSearchQuery] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [editingConversion, setEditingConversion] = useState<ConversionData | null>(null)
    const [deletingConversion, setDeletingConversion] = useState<ConversionData | null>(null)
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')

    const filteredConversions = conversions.filter(conversion =>
        conversion.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conversion.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalConversions = filteredConversions.length
    const completedConversions = filteredConversions.filter(c => c.status === 'completed').length
    const totalRevenue = filteredConversions
        .filter(c => c.status === 'completed')
        .reduce((sum, c) => sum + c.conversionValue, 0)
    const totalCommission = filteredConversions
        .filter(c => c.status === 'completed')
        .reduce((sum, c) => sum + c.commissionAmount, 0)

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />
            case 'failed':
                return <XCircle className="w-4 h-4 text-red-500" />
            default:
                return null
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        }
    }

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString()
    }

    const handleAddConversion = () => {
        setModalMode('add')
        setEditingConversion(null)
        setShowModal(true)
    }

    const handleEditConversion = (conversion: ConversionData) => {
        setModalMode('edit')
        setEditingConversion(conversion)
        setShowModal(true)
    }

    const handleViewConversion = (conversion: ConversionData) => {
        setModalMode('edit')
        setEditingConversion(conversion)
        setShowModal(true)
    }

    const handleDeleteConversion = (conversion: ConversionData) => {
        setDeletingConversion(conversion)
        setShowDeleteModal(true)
    }

    const handleSaveConversion = (conversionData: Omit<ConversionData, 'id'>) => {
        addConversion(conversionData)
        // Update local state to reflect the new conversion
        const newConversion: ConversionData = {
            ...conversionData,
            id: Date.now().toString()
        }
        setConversions(prev => [newConversion, ...prev])
        setShowModal(false)
    }

    const handleUpdateConversion = (id: string, updates: Partial<ConversionData>) => {
        updateConversion(id, updates)
        // Update local state
        setConversions(prev =>
            prev.map(conv =>
                conv.id === id ? { ...conv, ...updates } : conv
            )
        )
        setShowModal(false)
        setEditingConversion(null)
    }

    const confirmDelete = () => {
        if (deletingConversion) {
            deleteConversion(deletingConversion.id)
            // Update local state
            setConversions(prev =>
                prev.filter(conv => conv.id !== deletingConversion.id)
            )
            setDeletingConversion(null)
            setShowDeleteModal(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Conversions</h1>
                <Button
                    onClick={handleAddConversion}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Conversion
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Conversions</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalConversions}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </Card>

                <Card className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedConversions}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </Card>

                <Card className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                </Card>

                <Card className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Commission</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalCommission.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search */}
            <Card className="glass rounded-xl p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search conversions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                    />
                </div>
            </Card>

            {/* Conversions Table */}
            <Card className="glass rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Conversions</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Platform
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Value
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredConversions.map((conversion) => (
                                <tr key={conversion.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {conversion.productName}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {conversion.conversionType}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {conversion.customerName}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {conversion.customerEmail}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 dark:text-white">{conversion.platformName}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            ${conversion.conversionValue.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(conversion.status)}
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(conversion.status)}`}>
                                                {conversion.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            {formatDate(conversion.timestamp)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewConversion(conversion)}
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditConversion(conversion)}
                                            >
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteConversion(conversion)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredConversions.length === 0 && (
                    <div className="text-center py-12">
                        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No conversions found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria.</p>
                    </div>
                )}
            </Card>

            {/* Conversion Modal */}
            <ConversionModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false)
                    setEditingConversion(null)
                }}
                onSave={handleSaveConversion}
                onUpdate={handleUpdateConversion}
                conversion={editingConversion || undefined}
                mode={modalMode}
            />

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false)
                    setDeletingConversion(null)
                }}
                onConfirm={confirmDelete}
                title="Delete Conversion"
                description="Are you sure you want to delete this conversion? This action cannot be undone."
                itemName={deletingConversion?.productName}
            />
        </div>
    )
}