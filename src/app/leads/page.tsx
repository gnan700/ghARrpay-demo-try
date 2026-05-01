"use client";

import { useState, useEffect, Suspense } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Lead } from '@/lib/types';
import { formatDate, cn } from '@/lib/utils';
import { Phone, Mail, MessageSquare, Search, Filter, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import DataStateDisplay from '@/components/common/DataStateDisplay';

function LeadsContent() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const querySearch = searchParams.get('search') || '';
    const [searchTerm, setSearchTerm] = useState(querySearch);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/leads`);
            const data = await response.json();
            setLeads(data);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    // Sync local state when URL params change
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        console.log('Syncing Leads search from URL:', urlSearch);
        setSearchTerm(urlSearch);
    }, [searchParams]);

    useEffect(() => {
        fetchLeads();
    }, []);

    const filteredLeads = leads.filter(lead => {
        const term = searchTerm.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(term);
        const matchesPhone = lead.phoneNumber && lead.phoneNumber.includes(searchTerm);
        const matchesEmail = lead.email && lead.email.toLowerCase().includes(term);
        return matchesName || matchesPhone || matchesEmail;
    });

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Leads</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and track your incoming prospects</p>
                </div>
            </div>

            <div className="bg-[#181818] rounded-[32px] border border-[#2E2E2E] overflow-hidden">
                <div className="p-8 border-b border-[#2E2E2E] flex flex-col md:flex-row gap-6 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            className="w-full bg-[#1E1E1E] border border-[#2E2E2E] rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4ADE80] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <DataStateDisplay
                        isLoading={loading && leads.length === 0}
                        isEmpty={!loading && filteredLeads.length === 0}
                        emptyMessage={searchTerm ? `No leads found for "${searchTerm}"` : "No leads available"}
                        onRefresh={fetchLeads}
                    >
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#2E2E2E] bg-[#1E1E1E]/50">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Lead Name</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Source</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Added Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeads.map((lead) => (
                                    <tr key={lead._id || lead.id} className="border-b border-[#2E2E2E] hover:bg-[#1E1E1E]/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4ADE80] to-[#22C55E] flex items-center justify-center text-[#121212] font-black text-sm">
                                                    {lead.name.charAt(0)}
                                                </div>
                                                <Link href={`/leads/${lead._id || lead.id}`}>
                                                    <span className="font-bold text-white group-hover:text-[#4ADE80] transition-colors cursor-pointer">{lead.name}</span>
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="bg-[#252525] text-[#4ADE80] text-[10px] font-black px-3 py-1 rounded-full border border-[#4ADE80]/20 uppercase tracking-widest">
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm text-slate-300 font-medium">{lead.phoneNumber}</span>
                                                <span className="text-xs text-slate-500">{lead.email || 'No email'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-slate-400 font-bold capitalize">{lead.source}</td>
                                        <td className="px-8 py-6 text-sm text-slate-500 font-medium">{formatDate(lead.createdAt)}</td>
                                        <td className="px-8 py-6 text-right">
                                            <Link
                                                href={`/leads/${lead._id || lead.id}`}
                                                className="inline-flex items-center justify-center p-2 rounded-xl bg-[#252525] text-slate-400 hover:text-[#4ADE80] hover:bg-[#2E2E2E] transition-all"
                                            >
                                                <ArrowUpRight className="h-5 w-5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </DataStateDisplay>
                </div>
            </div>
        </DashboardLayout >
    );
}

export default function LeadsPage() {
    return (
        <Suspense fallback={
            <DashboardLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4ADE80]"></div>
                </div>
            </DashboardLayout>
        }>
            <LeadsContent />
        </Suspense>
    );
}
