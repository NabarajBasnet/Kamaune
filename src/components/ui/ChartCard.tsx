import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { cn } from '@/lib/utils'
import { CalendarDays, TrendingUp, Activity } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

interface ChartData {
    labels: string[]
    data: number[]
}

interface ChartCardProps {
    title: string
    data: Record<string, ChartData>
    defaultPeriod: string
    className?: string
}

export function ChartCard({ title, data, defaultPeriod, className }: ChartCardProps) {
    const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriod)
    const [isHovered, setIsHovered] = useState(false)

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#333',
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    label: function (context: any) {
                        return `Earnings: ₹${context.parsed.y.toLocaleString()}`
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#9ca3af',
                    callback: function (tickValue: string | number) {
                        return `₹${Number(tickValue).toLocaleString()}`
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#9ca3af'
                }
            }
        }
    }

    const chartData = {
        labels: data[selectedPeriod].labels,
        datasets: [
            {
                label: 'Earnings',
                data: data[selectedPeriod].data,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    }

    const currentData = data[selectedPeriod].data
    const total = currentData.reduce((a, b) => a + b, 0)
    const average = Math.round(total / currentData.length)
    const peak = Math.max(...currentData)
    const growth = currentData.length > 1 ?
        ((currentData[currentData.length - 1] - currentData[0]) / currentData[0] * 100).toFixed(1) :
        '0'

    return (
        <div
            className={cn(
                "glass rounded-xl p-6 transition-all duration-300",
                isHovered && "scale-[1.02] shadow-2xl",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-semibold">{title}</h3>
                </div>

                {/* Mobile: Dropdown, Desktop: Buttons */}
                <div className="block sm:hidden">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-24 h-8 glass border-gray-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass border-gray-700">
                            {Object.keys(data).map((period) => (
                                <SelectItem key={period} value={period}>
                                    {period.charAt(0).toUpperCase() + period.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="hidden sm:flex gap-2">
                    {Object.keys(data).map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={cn(
                                "px-3 py-1 text-sm rounded-lg transition-all duration-200",
                                selectedPeriod === period
                                    ? "bg-emerald-500/20 text-emerald-400 scale-105"
                                    : "hover:bg-white/10 text-gray-400 hover:scale-105"
                            )}
                        >
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative h-64 mb-4">
                <Line data={chartData} options={chartOptions} />
            </div>

            <div className="pt-4 border-t border-gray-800">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1">
                            <CalendarDays className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-400">Total</p>
                        </div>
                        <p className="text-lg font-semibold text-emerald-400">
                            ₹{total.toLocaleString()}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-400">Average</p>
                        <p className="text-lg font-semibold">
                            ₹{average.toLocaleString()}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-400">Peak</p>
                        <p className="text-lg font-semibold">
                            ₹{peak.toLocaleString()}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1">
                            <TrendingUp className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-400">Growth</p>
                        </div>
                        <p className={cn(
                            "text-lg font-semibold",
                            Number(growth) >= 0 ? "text-emerald-400" : "text-red-400"
                        )}>
                            {Number(growth) >= 0 ? '+' : ''}{growth}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
