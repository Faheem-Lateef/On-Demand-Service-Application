'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
    Briefcase, Plus, Loader2, Trash2, Tag, Wrench
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Service {
    id: string;
    name: string;
    description: string;
    price: string | number;
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

    const [newCategoryName, setNewCategoryName] = useState('');
    const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

    const [newServiceName, setNewServiceName] = useState('');
    const [newServicePrice, setNewServicePrice] = useState('');
    const [targetCategoryId, setTargetCategoryId] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data);
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            await api.post('/categories', { name: newCategoryName });
            toast.success('Category created');
            setNewCategoryName('');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to create category');
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category and ALL its services?')) return;
        try {
            await api.delete(`/categories/${id}`);
            toast.success('Category deleted');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    const handleCreateService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetCategoryId || !newServiceName.trim() || !newServicePrice.toString().trim()) return;
        try {
            await api.post(`/categories/${targetCategoryId}/services`, {
                name: newServiceName,
                price: Number(newServicePrice)
            });
            toast.success('Service added');
            setNewServiceName('');
            setNewServicePrice('');
            setTargetCategoryId(null);
            fetchCategories();
        } catch (error) {
            toast.error('Failed to add service');
        }
    };

    const handleDeleteService = async (serviceId: string) => {
        if (!confirm('Delete this service?')) return;
        try {
            await api.delete(`/categories/services/${serviceId}`);
            toast.success('Service deleted');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to delete service');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <Briefcase className="mr-3 text-blue-500" /> Category & Service Configurator
                    </h1>
                    <p className="text-slate-400 mt-1">Manage the marketplace offerings and pricing</p>
                </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                <form onSubmit={handleCreateCategory} className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="New Category Name (e.g. Plumbing)"
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                        className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-semibold flex items-center transition-all">
                        <Plus className="w-5 h-5 mr-2" /> Add Category
                    </button>
                </form>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-4 mt-8">
                        {categories.map(category => (
                            <div key={category.id} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
                                <div className="flex items-center justify-between bg-slate-800/50 p-4 border-b border-slate-700/50 cursor-pointer hover:bg-slate-800 transition" onClick={() => setOpenCategoryId(openCategoryId === category.id ? null : category.id)}>
                                    <div className="flex items-center">
                                        <Tag className="text-blue-400 mr-3 w-5 h-5" />
                                        <h3 className="text-lg font-bold text-white">{category.name}</h3>
                                        <span className="ml-3 px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded-full">
                                            {category.services.length} services
                                        </span>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id); }} className="p-2 text-slate-500 hover:text-red-400 transition">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {openCategoryId === category.id && (
                                    <div className="p-4 bg-slate-900/20">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            {category.services.map(service => (
                                                <div key={service.id} className="flex items-center bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
                                                    <Wrench className="w-4 h-4 text-slate-400 mr-3" />
                                                    <div className="flex-1">
                                                        <p className="text-white font-medium text-sm">{service.name}</p>
                                                        <p className="text-green-400 font-bold text-sm">${service.price}</p>
                                                    </div>
                                                    <button onClick={() => handleDeleteService(service.id)} className="p-2 text-slate-500 hover:text-red-400 transition" title="Delete Form">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {targetCategoryId !== category.id ? (
                                            <button onClick={() => setTargetCategoryId(category.id)} className="text-blue-400 text-sm font-semibold flex items-center hover:text-blue-300">
                                                <Plus className="w-4 h-4 mr-1" /> Add New Service
                                            </button>
                                        ) : (
                                            <form onSubmit={handleCreateService} className="flex gap-3 mt-4 items-center">
                                                <input
                                                    type="text"
                                                    placeholder="Service Name"
                                                    value={newServiceName}
                                                    onChange={e => setNewServiceName(e.target.value)}
                                                    className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Price ($)"
                                                    value={newServicePrice}
                                                    onChange={e => setNewServicePrice(e.target.value)}
                                                    className="w-24 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                                                />
                                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save</button>
                                                <button type="button" onClick={() => setTargetCategoryId(null)} className="text-slate-400 text-sm font-semibold hover:text-white px-2">Cancel</button>
                                            </form>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
