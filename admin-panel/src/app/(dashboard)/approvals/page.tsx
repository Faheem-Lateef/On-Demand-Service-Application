'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface PendingProvider {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    category?: {
        name: string;
    };
}

export default function ApprovalsPage() {
    const [providers, setProviders] = useState<PendingProvider[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingProviders = async () => {
        try {
            const response = await api.get('/users/providers/pending');
            setProviders(response.data.data);
        } catch (error) {
            toast.error('Failed to load pending approvals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingProviders();
    }, []);

    const handleApproval = async (id: string, action: 'approve' | 'reject') => {
        try {
            await api.patch(`/users/providers/${id}/${action}`);
            toast.success(`Provider ${action}d successfully`);
            setProviders((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            toast.error(`Failed to ${action} provider`);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                    <AlertCircle className="mr-3 text-amber-500" /> Pending Approvals
                </h1>
                <p className="text-slate-400 mt-1">Review and manage professional registrations before they go live on the platform</p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                        <p className="text-slate-500 font-medium">Fetching pending applications...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="px-8 py-4 font-semibold">Applicant Details</th>
                                    <th className="px-8 py-4 font-semibold">Category</th>
                                    <th className="px-8 py-4 font-semibold">Applied On</th>
                                    <th className="px-8 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {providers.length > 0 ? (
                                    providers.map((provider) => (
                                        <tr key={provider.id} className="hover:bg-white/5 transition-all group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center text-white border border-slate-700 shadow-lg font-bold">
                                                        {provider.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-semibold">{provider.name}</p>
                                                        <div className="flex items-center text-slate-500 text-xs mt-1">
                                                            {provider.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full">
                                                    {provider.category?.name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-slate-400 text-sm">
                                                {new Date(provider.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-8 py-5 text-right space-x-3">
                                                <button
                                                    onClick={() => handleApproval(provider.id, 'approve')}
                                                    className="inline-flex items-center px-4 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg text-sm font-semibold transition-all border border-emerald-500/20 shadow-sm shadow-emerald-900/20"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleApproval(provider.id, 'reject')}
                                                    className="inline-flex items-center px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-sm font-semibold transition-all border border-red-500/20 shadow-sm shadow-red-900/20"
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" /> Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center space-y-2">
                                                <CheckCircle className="w-12 h-12 text-slate-700 mb-2" />
                                                <p className="text-white font-medium">All caught up!</p>
                                                <p className="text-slate-500 text-sm">There are no pending applications waiting for review.</p>
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
