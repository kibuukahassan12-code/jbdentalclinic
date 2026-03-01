import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, Users, FileText, DollarSign, Package,
    TrendingUp, TrendingDown, AlertCircle, Clock,
    Activity, ArrowRight, Phone, Stethoscope
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/SectionHeader';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function AdminDashboard({ api, getStoredKey, onNavigate }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const formatMoney = (n) => Number(n || 0).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    const loadDashboard = useCallback(async () => {
        const key = getStoredKey();
        if (!key) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/api/reports/dashboard`, {
                headers: { 'X-Api-Key': key }
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                setError(errData.error || 'Failed to load dashboard');
                return;
            }
            const dashboardData = await res.json();
            setData(dashboardData);
        } catch (e) {
            setError(e.message || 'Connection error');
        } finally {
            setLoading(false);
        }
    }, [getStoredKey]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7FD856]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                {error}
                <Button onClick={loadDashboard} className="ml-4 text-white">Retry</Button>
            </div>
        );
    }

    const stats = [
        {
            label: "Today's Appointments",
            value: data?.today_appointments_count || 0,
            icon: Calendar,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            onClick: () => onNavigate && onNavigate('appointments')
        },
        {
            label: 'Total Patients',
            value: data?.total_patients || 0,
            icon: Users,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            onClick: () => onNavigate && onNavigate('patients')
        },
        {
            label: "Today's Revenue",
            value: formatMoney(data?.daily_revenue) + ' UGX',
            icon: DollarSign,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
            onClick: () => onNavigate && onNavigate('finances')
        },
        {
            label: 'Monthly Revenue',
            value: formatMoney(data?.monthly_revenue) + ' UGX',
            icon: TrendingUp,
            color: 'text-[#7FD856]',
            bg: 'bg-[#7FD856]/10',
            border: 'border-[#7FD856]/20',
            onClick: () => onNavigate && onNavigate('finances')
        },
        {
            label: 'Pending Invoices',
            value: data?.pending_invoices_count || 0,
            icon: FileText,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            onClick: () => onNavigate && onNavigate('invoices')
        },
        {
            label: 'Outstanding Balance',
            value: formatMoney(data?.total_outstanding) + ' UGX',
            icon: AlertCircle,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            onClick: () => onNavigate && onNavigate('finances')
        },
        {
            label: 'Low Stock Items',
            value: data?.low_stock_count || 0,
            icon: Package,
            color: data?.low_stock_count > 0 ? 'text-orange-400' : 'text-gray-400',
            bg: data?.low_stock_count > 0 ? 'bg-orange-500/10' : 'bg-gray-500/10',
            border: data?.low_stock_count > 0 ? 'border-orange-500/20' : 'border-gray-500/20',
            onClick: () => onNavigate && onNavigate('inventory')
        }
    ];

    return (
        <div className="space-y-8">
            <SectionHeader
                title="Dashboard"
                subtitle="Overview of your clinic's performance and quick access to key areas."
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <motion.button
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={stat.onClick}
                            className={`p-5 rounded-2xl ${stat.bg} ${stat.border} border text-left hover:scale-[1.02] transition-transform group`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                                        {stat.label}
                                    </p>
                                    <p className={`text-2xl font-bold ${stat.color}`}>
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-2 rounded-xl ${stat.bg} group-hover:bg-white/10 transition-colors`}>
                                    <Icon size={20} className={stat.color} />
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Appointments */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl bg-white/5 border border-white/10 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Calendar size={20} className="text-blue-400" />
                            Today's Appointments
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate && onNavigate('appointments')}
                            className="text-gray-400 hover:text-white"
                        >
                            View all <ArrowRight size={14} className="ml-1" />
                        </Button>
                    </div>

                    {data?.today_appointments?.length > 0 ? (
                        <ul className="space-y-3">
                            {data.today_appointments.map((apt) => (
                                <li key={apt.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            <Clock size={16} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{apt.patient_name}</p>
                                            <p className="text-gray-400 text-xs">{apt.appointment_time} • {apt.service || 'General'}</p>
                                        </div>
                                    </div>
                                    {apt.patient_phone && (
                                        <a
                                            href={`tel:${apt.patient_phone}`}
                                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Phone size={14} />
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="py-8 text-center text-gray-500">
                            <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No appointments scheduled for today</p>
                        </div>
                    )}
                </motion.div>

                {/* Low Stock Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl bg-white/5 border border-white/10 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Package size={20} className={data?.low_stock_count > 0 ? 'text-orange-400' : 'text-gray-400'} />
                            Inventory Alerts
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate && onNavigate('inventory')}
                            className="text-gray-400 hover:text-white"
                        >
                            Manage <ArrowRight size={14} className="ml-1" />
                        </Button>
                    </div>

                    {data?.low_stock_items?.length > 0 ? (
                        <ul className="space-y-3">
                            {data.low_stock_items.map((item) => (
                                <li key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                                            <AlertCircle size={16} className="text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{item.name}</p>
                                            <p className="text-gray-400 text-xs">
                                                Stock: {item.quantity} / Min: {item.minimum_stock}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-orange-400 text-xs font-medium px-2 py-1 rounded bg-orange-500/20">
                                        Low
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="py-8 text-center text-gray-500">
                            <Package size={32} className="mx-auto mb-2 opacity-50" />
                            <p>All inventory levels are healthy</p>
                        </div>
                    )}
                </motion.div>

                {/* Recent Treatments */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-2xl bg-white/5 border border-white/10 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Stethoscope size={20} className="text-purple-400" />
                            Recent Treatments
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate && onNavigate('treatments')}
                            className="text-gray-400 hover:text-white"
                        >
                            View all <ArrowRight size={14} className="ml-1" />
                        </Button>
                    </div>

                    {data?.recent_treatments?.length > 0 ? (
                        <ul className="space-y-3">
                            {data.recent_treatments.slice(0, 5).map((treatment) => (
                                <li key={treatment.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                            <Activity size={16} className="text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{treatment.service_name}</p>
                                            <p className="text-gray-400 text-xs">
                                                {treatment.treatment_date} • {treatment.cost ? formatMoney(treatment.cost) + ' UGX' : 'No cost'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-1 rounded capitalize ${treatment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                        treatment.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {treatment.status || 'pending'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="py-8 text-center text-gray-500">
                            <Stethoscope size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No treatments recorded yet</p>
                        </div>
                    )}
                </motion.div>

                {/* Outstanding Balances */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="rounded-2xl bg-white/5 border border-white/10 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <TrendingDown size={20} className="text-red-400" />
                            Outstanding Balances
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate && onNavigate('finances')}
                            className="text-gray-400 hover:text-white"
                        >
                            Manage <ArrowRight size={14} className="ml-1" />
                        </Button>
                    </div>

                    {data?.outstanding_balances?.length > 0 ? (
                        <ul className="space-y-3">
                            {data.outstanding_balances.slice(0, 5).map((inv) => (
                                <li key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                            <DollarSign size={16} className="text-red-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">Invoice #{inv.id}</p>
                                            <p className="text-gray-400 text-xs">
                                                Due: {inv.created_at?.slice(0, 10) || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-red-400 font-medium text-sm">
                                        {formatMoney(inv.balance)} UGX
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="py-8 text-center text-gray-500">
                            <TrendingDown size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No outstanding balances</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="rounded-2xl bg-gradient-to-r from-[#7FD856]/10 to-blue-500/10 border border-[#7FD856]/20 p-6"
            >
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={() => onNavigate && onNavigate('appointments')}
                        className="bg-[#7FD856] text-black hover:bg-[#6FC745]"
                    >
                        <Calendar size={16} className="mr-2" />
                        New Appointment
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onNavigate && onNavigate('patients')}
                        className="border-white/20 text-white hover:bg-white/10"
                    >
                        <Users size={16} className="mr-2" />
                        Add Patient
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onNavigate && onNavigate('invoices')}
                        className="border-white/20 text-white hover:bg-white/10"
                    >
                        <FileText size={16} className="mr-2" />
                        Create Invoice
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onNavigate && onNavigate('inventory')}
                        className="border-white/20 text-white hover:bg-white/10"
                    >
                        <Package size={16} className="mr-2" />
                        Update Inventory
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
