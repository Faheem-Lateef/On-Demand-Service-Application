'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
    Calendar,
    MapPin,
    Clock,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Search,
    Loader2,
    User as UserIcon,
    Tag
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Booking {
    id: string;
    scheduledAt: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
    address: string;
    notes: string;
    totalAmount: string;
    customer: {
        name: string;
        email: string;
    };
    service: {
        name: string;
        category: {
            name: string;
        }
    };
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings/my-bookings');
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
            toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
            fetchBookings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const filteredBookings = statusFilter === 'ALL'
        ? bookings
        : bookings.filter(b => b.status === statusFilter);

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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <Calendar className="mr-3 text-purple-500" /> Platform Bookings
                    </h1>
                    <p className="text-slate-400 mt-1">Monitor and coordinate all service appointments</p>
                </div>

                <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
                    {['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === status
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                            <div key={booking.id} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 transition-all hover:bg-slate-900/60 group">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    {/* Service & Customer Info */}
                                    <div className="flex items-start space-x-5 flex-1">
                                        <div className="w-14 h-14 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                                            <Tag className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white leading-tight">
                                                {booking.service.name}
                                                <span className="ml-2 px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-mono rounded">
                                                    {booking.service.category.name}
                                                </span>
                                            </h3>
                                            <div className="flex items-center text-slate-400 text-[13px] mt-2 space-x-4">
                                                <span className="flex items-center break-all"><UserIcon className="w-3.5 h-3.5 mr-1.5 text-slate-500 flex-shrink-0" /> {booking.customer.name}</span>
                                                <span className="flex items-center text-emerald-400 font-bold">$ {booking.totalAmount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date & Time */}
                                    <div className="flex lg:flex-col lg:items-end justify-between items-center px-6 border-x border-slate-800/50">
                                        <div className="flex items-center text-slate-300 font-medium">
                                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                            {new Date(booking.scheduledAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center text-slate-500 text-sm mt-1 uppercase font-bold tracking-tighter">
                                            <Clock className="w-3.5 h-3.5 mr-2" />
                                            {new Date(booking.scheduledAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="flex items-center justify-between lg:justify-end space-x-4 min-w-[200px]">
                                        <div className={`px-4 py-1.5 rounded-full border text-xs font-black tracking-widest ${getStatusStyle(booking.status)}`}>
                                            {booking.status}
                                        </div>

                                        {booking.status === 'PENDING' && (
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                                                    className="p-2 text-slate-500 hover:text-red-400 transition-all bg-slate-800/50 rounded-lg"
                                                    title="Reject Booking"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'ACCEPTED')}
                                                    className="p-2 text-slate-500 hover:text-emerald-400 transition-all bg-slate-800/50 rounded-lg"
                                                    title="Accept Booking"
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}

                                        {booking.status === 'ACCEPTED' && (
                                            <button
                                                onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                                                className="px-4 py-2 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-bold transition-all"
                                            >
                                                MARK COMPLETED
                                            </button>
                                        )}

                                        <button className="p-2 text-slate-500 hover:text-white">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Extended Details */}
                                <div className="mt-6 pt-6 border-t border-slate-800/30 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start">
                                        <MapPin className="w-4 h-4 mr-3 text-red-500 mt-1 flex-shrink-0" />
                                        <p className="text-slate-400 text-sm">{booking.address}</p>
                                    </div>
                                    {booking.notes && (
                                        <div className="flex items-start">
                                            <Clock className="w-4 h-4 mr-3 text-amber-500 mt-1 flex-shrink-0" />
                                            <p className="text-slate-500 text-sm italic">"{booking.notes}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-slate-900/20 border border-slate-800 border-dashed rounded-3xl py-32 flex flex-col items-center">
                            <Calendar className="w-16 h-16 text-slate-800 mb-4" />
                            <h3 className="text-xl font-bold text-slate-500">No appointments found</h3>
                            <p className="text-slate-600 text-sm mt-1">Bookings with the selected status will appear here.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
