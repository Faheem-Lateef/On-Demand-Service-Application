'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
    Briefcase,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    DollarSign,
    Tag,
    Loader2,
    Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
}

interface Category {
    id: string;
    name: string;
    description: string;
    services: Service[];
}

export default function ServicesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedCats, setExpandedCats] = useState<string[]>([]);

    // Form states
    const [showAddCat, setShowAddCat] = useState(false);
    const [catName, setCatName] = useState('');
    const [catDesc, setCatDesc] = useState('');

    const [addingServiceTo, setAddingServiceTo] = useState<string | null>(null);
    const [servName, setServName] = useState('');
    const [servPrice, setServPrice] = useState('');
    const [servDesc, setServDesc] = useState('');

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data);
            // Expand all by default for now
            setExpandedCats(response.data.data.map((c: any) => c.id));
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedCats(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/categories', { name: catName, description: catDesc });
            toast.success('Category created successfully');
            setCatName('');
            setCatDesc('');
            setShowAddCat(false);
            fetchCategories();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create category');
        }
    };

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addingServiceTo) return;
        try {
            await api.post(`/categories/${addingServiceTo}/services`, {
                name: servName,
                price: servPrice,
                description: servDesc
            });
            toast.success('Service added successfully');
            setServName('');
            setServPrice('');
            setServDesc('');
            setAddingServiceTo(null);
            fetchCategories();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add service');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <Layers className="mr-3 text-emerald-500" /> Services & Categories
                    </h1>
                    <p className="text-slate-400 mt-1">Configure your marketplace offerings</p>
                </div>
                <button
                    onClick={() => setShowAddCat(true)}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/20"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Category</span>
                </button>
            </div>

            {/* Add Category Modal/Form Overlay */}
            {showAddCat && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0f172a] border border-slate-700 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Create New Category</h2>
                        <form onSubmit={handleAddCategory} className="space-y-5">
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2 font-mono">NAME</label>
                                <input
                                    type="text"
                                    value={catName}
                                    onChange={(e) => setCatName(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                                    placeholder="e.g. Home Cleaning"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2 font-mono">DESCRIPTION</label>
                                <textarea
                                    value={catDesc}
                                    onChange={(e) => setCatDesc(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none h-32"
                                    placeholder="Tell customers what this category covers..."
                                />
                            </div>
                            <div className="flex space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddCat(false)}
                                    className="flex-1 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/40"
                                >
                                    Create Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {categories.map((cat) => (
                        <div key={cat.id} className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden transition-all hover:border-slate-700">
                            {/* Category Header */}
                            <div
                                onClick={() => toggleExpand(cat.id)}
                                className="px-8 py-6 flex items-center justify-between cursor-pointer group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-all">
                                        <Tag className="text-emerald-500 w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white uppercase tracking-tight font-mono">{cat.name}</h3>
                                        <p className="text-slate-500 text-sm mt-0.5">{cat.description || 'No description provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-white font-bold">{cat.services?.length || 0}</p>
                                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">SERVICES</p>
                                    </div>
                                    <button className="text-slate-500 group-hover:text-white transition-all">
                                        {expandedCats.includes(cat.id) ? <ChevronUp /> : <ChevronDown />}
                                    </button>
                                </div>
                            </div>

                            {/* Services List (Expandable) */}
                            {expandedCats.includes(cat.id) && (
                                <div className="px-8 pb-8 pt-2 border-t border-slate-800/50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                        {cat.services?.map((service) => (
                                            <div key={service.id} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-5 group transition-all hover:bg-slate-800/50">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h4 className="text-white font-semibold truncate leading-tight pr-4">{service.name}</h4>
                                                    <button className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-slate-500 text-xs mb-4 line-clamp-2 h-8">{service.description || 'Quick service for everyday needs'}</p>
                                                <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                                                    <span className="flex items-center text-emerald-400 font-bold">
                                                        <DollarSign className="w-3 h-3" /> {service.price}
                                                    </span>
                                                    <span className="text-slate-600 text-[10px] uppercase font-bold">Base Price</span>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add Service Button / Card */}
                                        <button
                                            onClick={() => setAddingServiceTo(cat.id)}
                                            className="border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-2 hover:bg-slate-800/20 hover:border-slate-700 transition-all group min-h-[140px]"
                                        >
                                            <Plus className="w-6 h-6 text-slate-600 group-hover:text-emerald-500 transition-all" />
                                            <span className="text-slate-500 text-sm font-medium group-hover:text-slate-300">Add Service</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Service Modal */}
            {addingServiceTo && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0f172a] border border-slate-700 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
                        <div className="flex items-center space-x-3 mb-6">
                            <Plus className="text-emerald-500" />
                            <h2 className="text-2xl font-bold text-white">Add New Service</h2>
                        </div>
                        <p className="text-slate-400 text-sm mb-6">Adding to <span className="text-emerald-400 font-bold">{categories.find(c => c.id === addingServiceTo)?.name}</span></p>

                        <form onSubmit={handleAddService} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-slate-500 block mb-2 font-mono tracking-tighter uppercase">SERVICE NAME</label>
                                    <input
                                        type="text"
                                        value={servName}
                                        onChange={(e) => setServName(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                                        placeholder="e.g. Deep Home Scrub"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-slate-500 block mb-2 font-mono tracking-tighter uppercase">PRICE (USD)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                        <input
                                            type="number"
                                            value={servPrice}
                                            onChange={(e) => setServPrice(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                                            placeholder="99.00"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 block mb-2 font-mono tracking-tighter uppercase">DESCRIPTION</label>
                                <textarea
                                    value={servDesc}
                                    onChange={(e) => setServDesc(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none h-24"
                                    placeholder="What does this service include?"
                                />
                            </div>
                            <div className="flex space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setAddingServiceTo(null)}
                                    className="flex-1 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/40 font-mono tracking-tighter"
                                >
                                    CONFIRM ADD
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
