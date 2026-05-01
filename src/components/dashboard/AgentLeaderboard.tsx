import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Trophy, TrendingUp, Users, Calendar, Target } from 'lucide-react';

interface AgentStat {
    _id: string;
    name: string;
    email: string;
    totalLeads: number;
    bookedLeads: number;
    totalVisits: number;
    conversionRate: number;
}

export default function AgentLeaderboard() {
    const [stats, setStats] = useState<AgentStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const response = await fetch(`${apiUrl}/api/users/performance`);
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching performance:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPerformance();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#181818] rounded-[32px] border border-[#2E2E2E] p-8 h-full">
                <div className="h-6 w-48 bg-[#252525] rounded-lg animate-pulse mb-8"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-[#252525] rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#181818] rounded-[32px] border border-[#2E2E2E] p-8 h-full shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 h-64 w-64 bg-[#4ADE80]/5 blur-[100px] rounded-full"></div>

            <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#4ADE80] to-[#22C55E] flex items-center justify-center text-[#121212] shadow-lg shadow-[#4ADE80]/20">
                        <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight">Agent Leaderboard</h3>
                        <p className="text-[10px] font-black text-[#4ADE80] uppercase tracking-widest mt-0.5">Top Performers</p>
                    </div>
                </div>
                <TrendingUp className="h-5 w-5 text-slate-600" />
            </div>

            <div className="space-y-4 relative z-10">
                {stats.length > 0 ? (
                    stats.map((agent, index) => (
                        <div
                            key={agent._id}
                            className={cn(
                                "group p-5 rounded-2xl border transition-all duration-500 hover:scale-[1.02]",
                                index === 0
                                    ? "bg-gradient-to-r from-[#252525] to-[#1E1E1E] border-[#4ADE80]/30 shadow-lg shadow-[#4ADE80]/5"
                                    : "bg-[#1E1E1E] border-[#2E2E2E] hover:border-[#4ADE80]/30"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className={cn(
                                        "h-12 w-12 rounded-xl flex items-center justify-center text-lg font-black shrink-0 transition-colors",
                                        index === 0 ? "bg-[#4ADE80] text-[#121212]" : "bg-[#252525] text-slate-400 group-hover:bg-[#4ADE80] group-hover:text-[#121212]"
                                    )}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white group-hover:text-[#4ADE80] transition-colors">{agent.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                                <Calendar className="h-3 w-3" />
                                                {agent.totalVisits} Visits
                                            </p>
                                            <span className="text-slate-700 text-xs">•</span>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                                <Users className="h-3 w-3" />
                                                {agent.totalLeads} Leads
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-2 text-[#4ADE80]">
                                        <Target className="h-4 w-4" />
                                        <p className="text-2xl font-black tracking-tighter">{agent.bookedLeads}</p>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Bookings</p>
                                </div>
                            </div>

                            {/* Progress Bar for Conversion */}
                            <div className="mt-5">
                                <div className="flex justify-between items-center mb-1.5 px-1">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Conversion Rate</span>
                                    <span className="text-[10px] font-black text-[#4ADE80]">{agent.conversionRate.toFixed(1)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#121212] rounded-full overflow-hidden p-[1px]">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#4ADE80] to-[#22C55E] rounded-full shadow-[0_0_10px_rgba(74,222,128,0.3)] transition-all duration-1000"
                                        style={{ width: `${Math.min(agent.conversionRate, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                        <Users className="h-12 w-12 text-slate-500 mb-4" />
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Awaiting Competition</p>
                        <p className="text-[10px] text-slate-600 mt-2">No performance data recorded yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
