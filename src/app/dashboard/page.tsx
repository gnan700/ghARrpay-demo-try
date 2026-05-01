"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
    Users,
    Target,
    CalendarCheck,
    TrendingUp,
    ArrowUpRight,
    MoreVertical,
    ChevronRight,
    Settings2,
    Filter,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DataStateDisplay from '@/components/common/DataStateDisplay';
import { getInactiveLeads } from '@/lib/services/reminderService';
import { LeadStatus } from '@/lib/types';
import AgentLeaderboard from '@/components/dashboard/AgentLeaderboard';

export default function Dashboard() {
    const [statsData, setStatsData] = useState<any>(null);
    const [monthlyLeads, setMonthlyLeads] = useState<number[]>(new Array(12).fill(0));
    const [recentVisits, setRecentVisits] = useState<any[]>([]);
    const [reminders, setReminders] = useState<any[]>([]);
    const [pipelineBreakdown, setPipelineBreakdown] = useState<any[]>([]);
    const [recentBooked, setRecentBooked] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [sourceStats, setSourceStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const [leadsRes, propsRes, visitsRes, activityRes] = await Promise.all([
                fetch(`${apiUrl}/api/leads`),
                fetch(`${apiUrl}/api/properties`),
                fetch(`${apiUrl}/api/visits`),
                fetch(`${apiUrl}/api/leads/activities?limit=10`)
            ]);
            const leads = await leadsRes.json();
            const props = await propsRes.json();
            const visits = await visitsRes.json();
            const activityData = await activityRes.json();

            console.log('Dashboard Data Fetched:', { leadsCount: leads.length, visitsCount: visits.length });

            // Compute stats
            setStatsData({
                totalLeads: leads.length,
                bookedLeads: leads.filter((l: any) => l.status === LeadStatus.BOOKED).length,
                availableProps: props.filter((p: any) => p.available).length,
                conversionRate: leads.length > 0 ? ((leads.filter((l: any) => l.status === LeadStatus.BOOKED).length / leads.length) * 100).toFixed(1) : 0
            });

            // Compute monthly leads for bar graph
            const now = new Date();
            const currentYear = now.getFullYear();
            const counts = new Array(12).fill(0);

            leads.forEach((lead: any) => {
                const leadDate = new Date(lead.createdAt);
                if (leadDate.getFullYear() === currentYear) {
                    const month = leadDate.getMonth();
                    counts[month]++;
                }
            });

            setMonthlyLeads(counts);
            setRecentVisits(visits.slice(0, 5));
            setActivities(activityData);

            // Lead Source Stats
            const sources = leads.reduce((acc: any, lead: any) => {
                acc[lead.source] = (acc[lead.source] || 0) + 1;
                return acc;
            }, {});
            const sourceList = Object.entries(sources).map(([name, count]) => ({
                name,
                count: count as number
            })).sort((a, b) => b.count - a.count);
            setSourceStats(sourceList);

            // Inactive lead reminders
            setReminders(getInactiveLeads(leads).slice(0, 10));

            // Pipeline Breakdown
            const stages = Object.values(LeadStatus);
            const breakdown = stages.map(stage => ({
                name: stage,
                count: leads.filter((l: any) => l.status === stage).length
            })).filter(s => s.count > 0);
            setPipelineBreakdown(breakdown);

            // Recent Booked Leads
            setRecentBooked(leads.filter((l: any) => l.status === LeadStatus.BOOKED).slice(0, 5));

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center items-start gap-4 md:gap-0 justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time Lead & Property Analytics</p>
                </div>

                {reminders.length > 0 && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-2 flex items-center gap-3 w-full md:w-auto">
                        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider truncate">
                            {reminders.length} Follow-ups Required
                        </span>
                    </div>
                )}
            </div>

            <DataStateDisplay
                isLoading={loading}
                isEmpty={!loading && statsData?.totalLeads === 0 && recentVisits.length === 0}
                emptyMessage="No data available yet"
                onRefresh={fetchDashboardData}
            >
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Total Leads Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#181818] rounded-[32px] p-8 border border-[#2E2E2E] relative overflow-hidden group"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white">Total Leads</h3>
                                <div className="p-2 bg-[#252525] rounded-full text-slate-600">
                                    <MoreVertical className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex items-center justify-center py-6 relative">
                                <div className="h-40 w-40 rounded-full bg-[#4ADE80] flex items-center justify-center shadow-[0_0_60px_rgba(74,222,128,0.3)]">
                                    <span className="text-3xl font-black text-[#121212]">{statsData?.totalLeads}</span>
                                </div>
                            </div>
                            <div className="mt-8">
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Global Outreach</p>
                                <p className="text-slate-300 text-sm mt-1">Acquired from multiple sources</p>
                            </div>
                        </motion.div>

                        {/* Conversion Rate Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-[#181818] rounded-[32px] p-8 border border-[#2E2E2E] group"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white">Conversion Rate</h3>
                                <div className="p-2 bg-[#252525] rounded-full text-slate-600">
                                    <Settings2 className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="relative h-48 w-48 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full border-[12px] border-[#252525]"></div>
                                    <div className="absolute inset-0 rounded-full border-[12px] border-transparent border-t-[#4ADE80] border-r-[#4ADE80] rotate-45" style={{ transform: `rotate(${statsData?.conversionRate * 3.6}deg)` }}></div>
                                    <span className="text-4xl font-black text-white">{`${statsData?.conversionRate}%`}</span>
                                </div>
                                <p className="text-slate-500 text-xs font-bold mt-4 italic uppercase tracking-widest text-center">Successful Bookings</p>
                            </div>
                        </motion.div>

                        {/* Available Properties Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#181818] rounded-[32px] p-8 border border-[#2E2E2E] group"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white">Available PGs</h3>
                                <div className="p-2 bg-[#252525] rounded-full text-slate-600">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="h-40 flex items-center justify-center mb-8">
                                <span className="text-6xl font-black text-[#4ADE80] drop-shadow-[0_0_20px_rgba(74,222,128,0.3)]">{statsData?.availableProps}</span>
                            </div>
                            <div className="space-y-4">
                                <p className="text-slate-500 text-center font-bold text-xs uppercase tracking-widest">Active Inventory</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Monthly Chart */}
                        <div className="lg:col-span-2 bg-[#181818] rounded-[32px] p-8 border border-[#2E2E2E]">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Lead Acquisition</h3>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-[#4ADE80]"></div>
                                        <span className="text-xs font-bold text-slate-500">{new Date().getFullYear()} Stats</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-64 relative mt-10">
                                {/* Grid Lines */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                    {[0, 1, 2, 3].map((_, i) => (
                                        <div key={i} className="w-full border-t border-[#2E2E2E]/50 border-dashed relative">
                                        </div>
                                    ))}
                                    <div className="w-full border-t border-[#2E2E2E]"></div>
                                </div>

                                {/* Bars Container */}
                                <div className="absolute inset-0 flex items-end gap-2 px-4 pt-4">
                                    {monthlyLeads.map((count, j) => {
                                        const maxVal = Math.max(...monthlyLeads, 1);
                                        let height = (count / maxVal) * 100;
                                        if (count > 0 && height < 5) height = 5;

                                        return (
                                            <div key={j} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end relative z-10">
                                                <div className="w-full bg-[#1E1E1E]/40 group-hover:bg-[#252525]/60 transition-all duration-300 rounded-t-2xl relative h-full flex items-end overflow-visible">
                                                    {count > 0 && (
                                                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#252525] px-2 py-0.5 rounded border border-[#4ADE80]/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                                            <span className="text-[10px] font-black text-[#4ADE80]">{count}</span>
                                                        </div>
                                                    )}
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${height}%` }}
                                                        className="w-full bg-gradient-to-t from-[#166534] via-[#22C55E] to-[#4ADE80] rounded-t-xl"
                                                    ></motion.div>
                                                </div>
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][j]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Agent Leaderboard */}
                        <div className="lg:col-span-1">
                            <AgentLeaderboard />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* 1. Pipeline Stage Breakdown */}
                        <div className="bg-[#181818] rounded-[32px] p-8 border border-[#2E2E2E] flex flex-col h-[420px]">
                            <h3 className="text-xl font-bold text-white mb-8 tracking-tight shrink-0">Pipeline Status</h3>
                            <div className="space-y-5 overflow-y-auto pr-2 scrollbar-hide flex-1">
                                {pipelineBreakdown.map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                                            <span className="text-xs font-black text-white">{item.count}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#252525] rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.count / statsData?.totalLeads) * 100}%` }}
                                                className="h-full bg-gradient-to-r from-[#22C55E] to-[#4ADE80]"
                                            ></motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Reminders / Follow-ups */}
                        <div className="bg-[#181818] rounded-[32px] p-8 border border-[#2E2E2E] flex flex-col h-[420px]">
                            <h3 className="text-xl font-bold text-white mb-8 tracking-tight flex items-center gap-3 shrink-0">
                                Follow-ups
                                {reminders.length > 0 && <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded-full">{reminders.length}</span>}
                            </h3>
                            <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide flex-1">
                                {reminders.length > 0 ? (
                                    reminders.map((lead) => (
                                        <Link href={`/leads/${lead._id}`} key={lead._id}>
                                            <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-[#2E2E2E] hover:border-amber-500/30 transition-all flex items-center justify-between group mb-3">
                                                <div className="truncate pr-2">
                                                    <h4 className="font-bold text-white text-sm truncate">{lead.name}</h4>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 truncate">{lead.status}</p>
                                                </div>
                                                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 opacity-30">
                                        <CheckCircle2 className="h-10 w-10 mx-auto mb-3" />
                                        <p className="text-xs font-black uppercase tracking-widest">Clear</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Recent Activity */}
                        <div className="bg-[#181818] rounded-[32px] p-8 border border-[#2E2E2E] flex flex-col h-[420px]">
                            <h3 className="text-xl font-bold text-white mb-8 tracking-tight shrink-0">Recent Activity</h3>
                            <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide flex-1">
                                {activities.length > 0 ? (
                                    activities.map((act) => (
                                        <div key={act._id} className="relative pl-6 pb-6 border-l border-[#2E2E2E] last:pb-0 ml-2">
                                            <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#4ADE80] shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                                            <p className="text-xs font-bold text-white truncate">{act.lead?.name || 'System'}</p>
                                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{act.description}</p>
                                            <p className="text-[8px] font-black text-[#4ADE80] uppercase mt-2 tracking-widest bg-[#4ADE80]/10 w-fit px-2 py-0.5 rounded-full">
                                                {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <div className="h-20 w-20 rounded-full bg-[#1E1E1E] flex items-center justify-center mb-6 border border-[#2E2E2E] group-hover:border-[#4ADE80]/30 transition-all">
                                            <TrendingUp className="h-8 w-8 text-slate-700" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Waiting for updates</p>
                                        <p className="text-[9px] text-slate-600 mt-2 font-medium">New activities will appear here in real-time</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 4. Lead Sources */}
                        <div className="bg-[#181818] rounded-[32px] p-8 border border-[#2E2E2E] flex flex-col h-[420px]">
                            <h3 className="text-xl font-bold text-white mb-8 tracking-tight shrink-0">Top Sources</h3>
                            <div className="space-y-6 overflow-y-auto pr-2 scrollbar-hide flex-1">
                                {sourceStats.length > 0 ? (
                                    sourceStats.map((src, idx) => {
                                        const percentage = (src.count / statsData?.totalLeads) * 100;
                                        return (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-[#252525] flex items-center justify-center text-[#4ADE80] font-black text-xs shrink-0">
                                                    {src.count}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <span className="text-sm font-bold text-white capitalize">{src.name}</span>
                                                        <span className="text-[10px] font-black text-slate-500">{percentage.toFixed(0)}%</span>
                                                    </div>
                                                    <div className="h-1 w-full bg-[#252525] rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#4ADE80]" style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 opacity-30">
                                        <Filter className="h-10 w-10 mx-auto mb-3" />
                                        <p className="text-xs font-black uppercase tracking-widest">No Data</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 5. Recent Confirmed Bookings */}
                        <div className="bg-[#181818] rounded-[32px] p-8 border border-[#2E2E2E] flex flex-col h-[420px]">
                            <h3 className="text-xl font-bold text-white mb-8 tracking-tight shrink-0">Recent Bookings</h3>
                            <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide flex-1">
                                {recentBooked.length > 0 ? (
                                    recentBooked.map((lead) => (
                                        <Link href={`/leads/${lead._id || lead.id}`} key={lead._id} className="block">
                                            <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-[#2E2E2E] flex items-center gap-4 hover:border-[#4ADE80]/30 transition-all cursor-pointer">
                                                <div className="h-10 w-10 rounded-xl bg-[#4ADE80] flex items-center justify-center text-[#121212] font-black text-sm shrink-0">
                                                    {lead.name.charAt(0)}
                                                </div>
                                                <div className="truncate">
                                                    <h4 className="font-bold text-white text-sm truncate">{lead.name}</h4>
                                                    <p className="text-[10px] text-[#4ADE80] font-black uppercase tracking-widest mt-0.5">Success</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 opacity-30">
                                        <Target className="h-10 w-10 mx-auto mb-3" />
                                        <p className="text-xs font-black uppercase tracking-widest">None</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 6. Upcoming Visits */}
                        <div className="bg-[#181818] rounded-[32px] p-8 border border-[#2E2E2E] flex flex-col h-[420px]">
                            <div className="flex items-center justify-between mb-8 shrink-0">
                                <h3 className="text-xl font-bold text-white tracking-tight">Upcoming Visits</h3>
                                <ArrowUpRight className="h-5 w-5 text-[#4ADE80]" />
                            </div>

                            <div className="space-y-3 overflow-y-auto pr-2 scrollbar-hide flex-1">
                                {recentVisits.length > 0 ? (
                                    recentVisits.map((visit) => (
                                        <div key={visit._id} className="p-4 rounded-2xl bg-[#1E1E1E] border border-[#2E2E2E] hover:border-[#4ADE80]/30 transition-all">
                                            <div className="flex justify-between items-start mb-1 gap-2">
                                                <Link href={`/leads/${visit.lead?._id || visit.lead?.id}`} className="hover:text-[#4ADE80] truncate">
                                                    <h4 className="font-bold text-white text-sm truncate">{visit.lead?.name}</h4>
                                                </Link>
                                                <span className="text-[10px] font-black text-[#4ADE80] uppercase shrink-0">{visit.visitTime}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-medium truncate">{visit.property?.name}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 opacity-30">
                                        <CalendarCheck className="h-10 w-10 mx-auto mb-3" />
                                        <p className="text-xs font-black uppercase tracking-widest">None</p>
                                    </div>
                                )}
                            </div>

                            <Link href="/visits" className="block mt-4 shrink-0">
                                <button className="w-full py-3 bg-[#252525] hover:bg-[#2E2E2E] text-slate-400 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-[#2E2E2E]">
                                    Full Schedule
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </DataStateDisplay>
        </DashboardLayout>
    );
}
