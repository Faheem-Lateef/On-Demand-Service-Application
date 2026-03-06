'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Settings,
    Calendar,
    LogOut,
    Briefcase,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Users', icon: Users, href: '/users' },
    { name: 'Services', icon: Briefcase, href: '/services' },
    { name: 'Bookings', icon: Calendar, href: '/bookings' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    return (
        <aside className="w-72 bg-[#020617] border-r border-slate-800 h-screen sticky top-0 flex flex-col pt-8">
            {/* Brand */}
            <div className="px-8 mb-10 flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                    <Briefcase className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">ServicePro</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center space-x-3">
                                <item.icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "group-hover:text-white")} />
                                <span className="font-medium">{item.name}</span>
                            </div>
                            <ChevronRight className={cn("w-4 h-4 transition-transform", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 rotate-0")} />
                        </Link>
                    );
                })}
            </nav>

            {/* User & Logout */}
            <div className="p-4 mt-auto">
                <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 mb-4">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-slate-800">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-white font-semibold truncate">{user?.name || 'Administrator'}</p>
                            <p className="text-slate-500 text-xs truncate">Main Operator</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full py-2.5 px-4 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-300 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm font-medium border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
