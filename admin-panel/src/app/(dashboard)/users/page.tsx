'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Mail,
    ShieldCheck,
    User as UserIcon,
    HardHat,
    Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    providerStatus?: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'ALL' | 'CUSTOMER' | 'PROVIDER' | 'ADMIN'>('ALL');

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.data);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'ALL' || user.role === activeTab;
        return matchesSearch && matchesTab;
    });

    const getRoleBadge = (role: string, status?: string) => {
        switch (role) {
            case 'ADMIN':
                return <span className="px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-full flex items-center w-fit"><ShieldCheck className="w-3 h-3 mr-1" /> ADMIN</span>;
            case 'PROVIDER':
                if (status === 'PENDING') {
                    return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full flex items-center w-fit"><HardHat className="w-3 h-3 mr-1" /> PROVIDER (PENDING)</span>;
                }
                if (status === 'REJECTED') {
                    return <span className="px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-full flex items-center w-fit"><HardHat className="w-3 h-3 mr-1" /> PROVIDER (REJECTED)</span>;
                }
                return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full flex items-center w-fit"><HardHat className="w-3 h-3 mr-1" /> PROVIDER</span>;
            default:
                return <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-full flex items-center w-fit"><UserIcon className="w-3 h-3 mr-1" /> CUSTOMER</span>;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <Users className="mr-3 text-blue-500" /> User Management
                    </h1>
                    <p className="text-slate-400 mt-1">Manage and monitor all platform accounts</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 transition-all"
                        />
                    </div>
                    <button className="p-2 bg-slate-900/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Tabs Row */}
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-px">
                {(['ALL', 'CUSTOMER', 'PROVIDER', 'ADMIN'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all ${activeTab === tab
                            ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                    >
                        {tab === 'ALL' ? 'All Users' : `${tab.charAt(0) + tab.slice(1).toLowerCase()}s`}
                    </button>
                ))}
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-slate-500 font-medium">Fetching platform users...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="px-8 py-4 font-semibold">User Details</th>
                                    <th className="px-8 py-4 font-semibold">Account Role</th>
                                    <th className="px-8 py-4 font-semibold">Joined Date</th>
                                    <th className="px-8 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/5 transition-all group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center text-white border border-slate-700 shadow-lg">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-semibold">{user.name}</p>
                                                        <div className="flex items-center text-slate-500 text-xs mt-1">
                                                            <Mail className="w-3 h-3 mr-1" /> {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                {getRoleBadge(user.role, user.providerStatus)}
                                            </td>
                                            <td className="px-8 py-5 text-slate-400 text-sm">
                                                {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="p-2 text-slate-500 hover:text-white transition-all">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center space-y-2">
                                                <Users className="w-12 h-12 text-slate-700 mb-2" />
                                                <p className="text-white font-medium">No users found</p>
                                                <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
