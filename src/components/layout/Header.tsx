"use client";

import { Bell, Search, User, LogOut, Settings, BellOff, ChevronRight, Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showSearchPreview, setShowSearchPreview] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const router = useRouter();
    const notificationRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSearchPreview = async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                setShowSearchPreview(false);
                return;
            }

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const response = await fetch(`${apiUrl}/api/leads`);
                const leads = await response.json();

                const filtered = leads.filter((l: any) =>
                    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (l.phoneNumber && l.phoneNumber.includes(searchQuery))
                ).slice(0, 5);

                setSearchResults(filtered);
                setShowSearchPreview(true);
            } catch (error) {
                console.error('Error fetching search preview:', error);
            }
        };

        const debounceTimer = setTimeout(fetchSearchPreview, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const response = await fetch(`${apiUrl}/api/leads`);
                const leads = await response.json();
                // Just use some recent leads as mock notifications for now
                const alerts = leads
                    .filter((l: any) => l.status === 'New Lead')
                    .slice(0, 5)
                    .map((l: any) => ({
                        id: l._id,
                        title: 'New Lead Captured',
                        message: `${l.name} from ${l.source}`,
                        time: 'Just now',
                        link: `/leads/${l._id}`
                    }));
                setNotifications(alerts);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        // Close dropdowns on outside click
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchPreview(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSearchPreview(false);
            router.push(`/leads?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="h-16 md:h-20 border-b border-[#2E2E2E] bg-[#121212] px-4 md:px-10 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-3 md:gap-4 flex-1 mr-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-400 hover:text-white md:hidden shrink-0"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="flex-1 max-w-lg relative group" ref={searchRef}>
                    <form onSubmit={handleSearch} className="relative">
                        <button
                            type="submit"
                            className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-[#4ADE80] hover:text-[#4ADE80] transition-colors z-10"
                        >
                            <Search className="h-4 w-4" />
                        </button>
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="w-full pl-9 md:pl-12 pr-4 py-2 md:py-3 bg-[#1E1E1E] border border-[#2E2E2E] rounded-xl md:rounded-2xl text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#4ADE80] focus:border-[#4ADE80] transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.length >= 2 && setShowSearchPreview(true)}
                        />
                    </form>

                    {/* Search Results Preview */}
                    {showSearchPreview && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#181818] border border-[#2E2E2E] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="p-3 border-b border-[#2E2E2E]/50 flex justify-between items-center bg-[#1E1E1E]/30">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Search Results</span>
                                <span className="text-[10px] font-bold text-[#4ADE80] pr-2 uppercase">{searchResults.length} Found</span>
                            </div>
                            <div className="py-1">
                                {searchResults.map((lead) => (
                                    <Link
                                        key={lead._id}
                                        href={`/leads/${lead._id}`}
                                        onClick={() => setShowSearchPreview(false)}
                                        className="flex items-center justify-between px-5 py-3 hover:bg-[#1E1E1E] transition-all group border-b border-[#2E2E2E]/30 last:border-0"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-2 w-2 rounded-full bg-[#4ADE80] shrink-0"></div>
                                            <div className="truncate">
                                                <p className="text-sm font-bold text-white group-hover:text-[#4ADE80] transition-colors">{lead.name}</p>
                                                <p className="text-[10px] text-slate-500 font-medium">{lead.phoneNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest bg-[#252525] px-2 py-0.5 rounded group-hover:bg-[#4ADE80]/10 group-hover:text-[#4ADE80] transition-colors">
                                                {lead.status}
                                            </span>
                                            <ChevronRight className="h-3 w-3 text-slate-700 group-hover:text-[#4ADE80] transition-colors" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link
                                href={`/leads?search=${encodeURIComponent(searchQuery)}`}
                                onClick={() => setShowSearchPreview(false)}
                                className="block p-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#4ADE80] bg-[#1E1E1E]/50 hover:bg-[#1E1E1E] transition-all border-t border-[#2E2E2E]"
                            >
                                Advanced Search for "{searchQuery}"
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-6 shrink-0">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={cn(
                            "relative p-3 rounded-xl transition-all",
                            showNotifications ? "bg-[#1E1E1E] text-[#4ADE80]" : "text-slate-500 hover:bg-[#1E1E1E] hover:text-[#4ADE80]"
                        )}
                    >
                        <Bell className="h-5 w-5" />
                        {notifications.length > 0 && (
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-[#4ADE80] rounded-full border-2 border-[#121212]"></span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 md:-right-4 mt-3 w-[280px] md:w-80 bg-[#181818] border border-[#2E2E2E] rounded-2xl md:rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-5 border-b border-[#2E2E2E] flex items-center justify-between">
                                <h3 className="font-bold text-white tracking-tight">Notifications</h3>
                                <span className="text-[10px] font-black text-[#4ADE80] uppercase tracking-widest">{notifications.length} New</span>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <Link
                                            key={n.id}
                                            href={n.link}
                                            onClick={() => setShowNotifications(false)}
                                            className="block p-5 border-b border-[#2E2E2E]/50 hover:bg-[#1E1E1E] transition-colors group"
                                        >
                                            <div className="flex gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-[#252525] flex items-center justify-center text-[#4ADE80] shrink-0 group-hover:bg-[#4ADE80] group-hover:text-[#121212] transition-colors">
                                                    <Bell className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white mb-0.5">{n.title}</p>
                                                    <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                                                    <p className="text-[10px] text-slate-600 font-bold uppercase mt-2">{n.time}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="py-10 text-center flex flex-col items-center">
                                        <BellOff className="h-10 w-10 text-slate-800 mb-3" />
                                        <p className="text-slate-600 text-sm font-bold">No new notifications</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-[#1E1E1E]/50 text-center">
                                <button className="text-[10px] font-black text-slate-500 hover:text-[#4ADE80] uppercase tracking-widest transition-colors">
                                    Clear All
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-10 w-px bg-[#2E2E2E] mx-1"></div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className={cn(
                            "h-8 w-8 md:h-10 md:w-10 rounded-xl bg-[#1E1E1E] flex items-center justify-center border transition-all",
                            showUserMenu ? "border-[#4ADE80] shadow-[0_0_15px_rgba(74,222,128,0.2)]" : "border-[#2E2E2E] hover:border-[#4ADE80]/50"
                        )}
                    >
                        <User className={cn("h-5 w-5 transition-colors", showUserMenu ? "text-[#4ADE80]" : "text-slate-500")} />
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-3 w-56 bg-[#181818] border border-[#2E2E2E] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 border-b border-[#2E2E2E]">
                                <p className="text-sm font-bold text-white">Agent User</p>
                                <p className="text-[10px] text-slate-500 font-medium">agent@gharpayy.com</p>
                            </div>
                            <div className="p-2">
                                <button className="w-full flex items-center gap-3 p-3 text-xs text-slate-400 hover:text-white hover:bg-[#1E1E1E] rounded-xl transition-all">
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </button>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="w-full flex items-center gap-3 p-3 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
