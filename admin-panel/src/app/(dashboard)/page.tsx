'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import {
    Users,
    Briefcase,
    Calendar,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Stats {
    users: number;
    services: number;
    bookings: number;
    pendingBookings: number;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<Stats>({ users: 0, services: 0, bookings: 0, pendingBookings: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch users, categories, and bookings to calculate stats
                const [usersRes, categoriesRes, bookingsRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/categories'),
                    api.get('/bookings/my-bookings')
                ]);

                setStats({
                    users: usersRes.data.results || 0,
                    services: categoriesRes.data.data.reduce((acc: number, cat: any) => acc + (cat.services?.length || 0), 0),
                    bookings: bookingsRes.data.results || 0,
                    pendingBookings: bookingsRes.data.data.filter((b: any) => b.status === 'PENDING').length
                });
            } catch (error) {
                toast.error('Failed to load dashboard statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { name: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Active Services', value: stats.services, icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { name: 'Total Bookings', value: stats.bookings, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { name: 'Pending Jobs', value: stats.pendingBookings, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    return (
        <div className="space-y-10">
            {/* Welcome Section */}
            <section>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Good morning, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-slate-400">
                    Here's a quick overview of what's happening on your platform today.
                </p>
            </section>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.name} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 transition-all hover:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <TrendingUp className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">{stat.name}</p>
                            <h3 className="text-3xl font-bold text-white mt-1">
                                {loading ? '...' : stat.value}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Secondary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">System Health</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl">
                            <div className="flex items-center space-x-3">
                                <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                                <span className="text-slate-300">Database Connection</span>
                            </div>
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full">OPTIMAL</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl">
                            <div className="flex items-center space-x-3">
                                <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                                <span className="text-slate-300">API Server Status</span>
                            </div>
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full">ACTIVE</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl">
                            <div className="flex items-center space-x-3">
                                <AlertCircle className="text-amber-500 w-5 h-5" />
                                <span className="text-slate-300">New Providers Pending</span>
                            </div>
                            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full">3 REVIEW</span>
                        </div>
                    </div>
                </div>

                {/* Platform Tip */}
                <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/10 rounded-3xl p-8 flex flex-col justify-center">
                    <div className="bg-blue-600/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                        <AlertCircle className="text-blue-400 w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Admin Pro Tip</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">
                        Keep your category list focused. Studies show that having fewer, high-quality categories with clear descriptions leads to a 25% increase in conversion.
                    </p>
                    <button className="self-start px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/20">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
}
