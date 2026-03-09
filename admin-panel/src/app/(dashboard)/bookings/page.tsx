'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
    Calendar, Search, Filter, Loader2, MapPin, DollarSign, User as UserIcon, HardHat, MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Booking {
    id: string;
    scheduledAt: string;
    status: string;
    totalAmount: string;
    address: string;
    customer: { id: string; name: string; email: string };
    provider: { id: string; name: string; email: string } | null;
    service: { id: string; name: string };
    createdAt: string;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings?limit=100'); // Let's pull up to 100 for admin view
            setBookings(response.data.data);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await api.patch(`/bookings/${id}/status`, { status: newStatus });
            toast.success(`Booking marked as ${newStatus}`);
            fetchBookings();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'ACCEPTED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'REJECTED': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <Calendar className="mr-3 text-blue-500" /> Platform Bookings
                    </h1>
                    <p className="text-slate-400 mt-1">Monitor and manage all service appointments</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by ID, name, service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-72 transition-all"
                        />
                    </div>
                    <button className="p-2 bg-slate-900/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-slate-500 font-medium">Fetching global schedule...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">Service Details</th>
                                    <th className="px-6 py-4 font-semibold">Parties</th>
                                    <th className="px-6 py-4 font-semibold">Time & Location</th>
                                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredBookings.length > 0 ? (
                                    filteredBookings.map((b) => (
                                        <tr key={b.id} className="hover:bg-white/5 transition-all group">
                                            <td className="px-6 py-5">
                                                <p className="text-white font-bold">{b.service.name}</p>
                                                <p className="text-emerald-400 font-semibold text-sm mt-1 flex items-center">
                                                    <DollarSign className="w-3 h-3 mr-0.5" />{b.totalAmount}
                                                </p>
                                                <p className="text-slate-500 text-[10px] mt-1 tracking-widest font-mono">ID: {b.id.split('-')[0]}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col space-y-2">
                                                    <div className="flex items-center text-slate-300 text-sm">
                                                        <UserIcon className="w-4 h-4 mr-2 text-slate-500" />
                                                        <span className="truncate w-32">{b.customer.name}</span>
                                                    </div>
                                                    <div className="flex items-center text-slate-300 text-sm">
                                                        <HardHat className="w-4 h-4 mr-2 text-slate-500" />
                                                        {b.provider ? (
                                                            <span className="truncate w-32 font-medium text-amber-500/80">{b.provider.name}</span>
                                                        ) : (
                                                            <span className="text-slate-500 italic">Unassigned</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm">
                                                <p className="text-blue-400 font-semibold flex items-center mb-1.5">
                                                    <Calendar className="w-4 h-4 mr-2 opacity-70" />
                                                    {new Date(b.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p className="text-slate-400 flex items-center truncate max-w-[200px]" title={b.address}>
                                                    <MapPin className="w-4 h-4 mr-2 opacity-50" />
                                                    {b.address}
                                                </p>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusStyle(b.status)}`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <select
                                                        className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg text-xs py-1.5 px-2 outline-none focus:border-blue-500 transition-all cursor-pointer"
                                                        value={b.status}
                                                        onChange={(e) => handleStatusUpdate(b.id, e.target.value)}
                                                    >
                                                        <option value="PENDING">Pending</option>
                                                        <option value="ACCEPTED">Accepted</option>
                                                        <option value="COMPLETED">Completed</option>
                                                        <option value="REJECTED">Rejected</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-slate-500 font-medium">
                                            No bookings found matching your search.
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
