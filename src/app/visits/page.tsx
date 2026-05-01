"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import VisitScheduler from '@/components/leads/VisitScheduler';
import { Calendar, MapPin, User, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Visit {
    _id: string;
    lead: { name: string; phone: string };
    property: { name: string; location: string };
    visitDate: string;
    visitTime: string;
    outcome: string;
}

import DataStateDisplay from '@/components/common/DataStateDisplay';

export default function VisitsPage() {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVisits = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/visits`);
            const data = await response.json();
            setVisits(data);
        } catch (error) {
            console.error('Error fetching visits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOutcome = async (id: string, outcome: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/visits/${id}/outcome`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ outcome })
            });

            if (response.ok) {
                fetchVisits(); // Refresh list
            }
        } catch (error) {
            console.error('Error updating outcome:', error);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, []);

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Property Visits</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#4ADE80]" />
                        Tour Management & Scheduling
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7">
                    <VisitScheduler onSuccess={fetchVisits} />
                </div>

                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-[#181818] rounded-[32px] border border-[#2E2E2E] p-8 shadow-2xl relative overflow-hidden h-full min-h-[600px]">
                        <div className="absolute top-0 left-0 h-40 w-40 bg-[#4ADE80]/5 blur-[100px] rounded-full"></div>

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h3 className="font-black text-xl text-white tracking-tight">Upcoming Visits</h3>
                            <span className="bg-[#252525] text-slate-400 text-[10px] font-black px-3 py-1 rounded-full border border-[#2E2E2E] uppercase tracking-widest">
                                {visits.length} Total
                            </span>
                        </div>

                        <div className="relative z-10 min-h-[400px]">
                            <DataStateDisplay
                                isLoading={loading && visits.length === 0}
                                isEmpty={!loading && visits.length === 0}
                                emptyMessage="No visits scheduled yet"
                                onRefresh={fetchVisits}
                            >
                                <div className="space-y-6">
                                    {visits.map((visit) => (
                                        <div key={visit._id} className="group p-6 rounded-3xl bg-[#1E1E1E] border border-[#2E2E2E] hover:border-[#4ADE80]/30 transition-all shadow-lg hover:shadow-[#4ADE80]/5">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#252525] to-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-slate-400 group-hover:text-[#4ADE80] group-hover:border-[#4ADE80]/20 transition-all">
                                                        <Clock className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[#4ADE80] text-[10px] font-black uppercase tracking-widest mb-1">
                                                            {formatDate(visit.visitDate)} • {visit.visitTime}
                                                        </p>
                                                        <h4 className="font-black text-white text-lg group-hover:text-[#4ADE80] transition-colors">{visit.lead?.name || 'Unknown Lead'}</h4>
                                                    </div>
                                                </div>
                                                <div className={cn(
                                                    "h-2 w-2 rounded-full",
                                                    visit.outcome === 'Pending' ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" :
                                                        visit.outcome === 'Booked' ? "bg-[#4ADE80] shadow-[0_0_10px_#4ADE80]" : "bg-slate-500"
                                                )}></div>
                                            </div>

                                            <div className="space-y-3 pl-16">
                                                <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                                                    <MapPin className="h-4 w-4 text-slate-600" />
                                                    <span>{visit.property?.name} • {visit.property?.location}</span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-4">
                                                    <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                                                        <CheckCircle2 className="h-4 w-4 text-slate-600" />
                                                        <select
                                                            value={visit.outcome}
                                                            onChange={(e) => handleUpdateOutcome(visit._id, e.target.value)}
                                                            className="bg-transparent border-none text-xs font-black uppercase tracking-widest text-[#4ADE80] cursor-pointer focus:ring-0"
                                                        >
                                                            <option value="Pending" className="bg-[#181818]">Pending</option>
                                                            <option value="Interested" className="bg-[#181818]">Interested</option>
                                                            <option value="Not Interested" className="bg-[#181818]">Not Interested</option>
                                                            <option value="Booked" className="bg-[#181818]">Booked</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DataStateDisplay>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// Helper for class names
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
