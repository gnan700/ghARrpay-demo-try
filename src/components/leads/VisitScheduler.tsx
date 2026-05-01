"use client";

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Property {
    _id: string;
    name: string;
    location: string;
    available: boolean;
}

interface Lead {
    _id: string;
    name: string;
    assignedAgent?: {
        _id: string;
        name: string;
    };
}

interface VisitSchedulerProps {
    leadId?: string;
    onSuccess?: () => void;
}

export default function VisitScheduler({ leadId, onSuccess }: VisitSchedulerProps) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [property, setProperty] = useState('');
    const [selectedLeadId, setSelectedLeadId] = useState(leadId || '');
    const [notes, setNotes] = useState('');
    const [outcome, setOutcome] = useState('Pending');
    const [properties, setProperties] = useState<Property[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const [propsRes, leadsRes] = await Promise.all([
                    fetch(`${apiUrl}/api/properties`),
                    fetch(`${apiUrl}/api/leads`)
                ]);
                const propertiesData = await propsRes.json();
                const leadsData = await leadsRes.json();

                setProperties(propertiesData);
                setLeads(leadsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            // Fetch agents to assign the first one as a fallback
            const agentsRes = await fetch(`${apiUrl}/api/leads`); // Using leads to get assigned agents for now
            // For now, let's just use a placeholder agent ID if we can't find one, 
            // but the seed script creates agents. We'll fetch them from the leads population or similar.
            // Better: just fetch all leads and use the assignedAgent of the first one if available.
            const agentId = leads.find(l => l._id === selectedLeadId)?.assignedAgent?._id || '65ebc9f80a2b5c001f3e1234'; // Placeholder/Fallback

            const response = await fetch(`${apiUrl}/api/visits`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lead: selectedLeadId,
                    property,
                    visitDate: date,
                    visitTime: time,
                    notes,
                    outcome,
                    agent: '65ebc9f80a2b5c001f3e1234' // Harcoded for MVP since auth is not fully hooked up
                })
            });

            if (response.ok) {
                alert('Visit scheduled successfully!');
                if (onSuccess) onSuccess();
                // Reset form
                setDate('');
                setTime('');
                setProperty('');
                setNotes('');
                setOutcome('Pending');
            } else {
                const err = await response.json();
                alert(`Error: ${err.message}`);
            }
        } catch (error) {
            console.error('Error scheduling visit:', error);
            alert('Failed to schedule visit.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[#181818] rounded-[32px] border border-[#2E2E2E] p-10 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-[#4ADE80]/5 blur-[100px] rounded-full"></div>

            <div className="flex items-center gap-6 mb-10 relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#4ADE80] to-[#22C55E] flex items-center justify-center text-[#121212] shadow-[0_10px_30px_rgba(74,222,128,0.2)]">
                    <Calendar className="h-7 w-7" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Schedule Property Visit</h2>
                    <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-wider">Property Site Visit</p>
                </div>
            </div>

            <form onSubmit={handleSchedule} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-[#4ADE80]" />
                            Visit Date
                        </label>
                        <input
                            type="date"
                            required
                            className="w-full p-4 bg-[#1E1E1E] border border-[#2E2E2E] rounded-2xl text-sm text-white focus:ring-1 focus:ring-[#4ADE80] focus:border-[#4ADE80] outline-none transition-all placeholder-slate-600"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Clock className="h-3 w-3 text-[#4ADE80]" />
                            Visit Time
                        </label>
                        <input
                            type="time"
                            required
                            className="w-full p-4 bg-[#1E1E1E] border border-[#2E2E2E] rounded-2xl text-sm text-white focus:ring-1 focus:ring-[#4ADE80] focus:border-[#4ADE80] outline-none transition-all"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>
                </div>

                {!leadId && (
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <FileText className="h-3 w-3 text-[#4ADE80]" />
                            Select Lead
                        </label>
                        <div className="relative">
                            <select
                                required
                                className="w-full p-4 bg-[#1E1E1E] border border-[#2E2E2E] rounded-2xl text-sm text-white focus:ring-1 focus:ring-[#4ADE80] focus:border-[#4ADE80] outline-none transition-all appearance-none cursor-pointer"
                                value={selectedLeadId}
                                onChange={(e) => setSelectedLeadId(e.target.value)}
                                disabled={loading}
                            >
                                <option value="" className="bg-[#1E1E1E]">
                                    {loading ? 'Loading leads...' : 'Select a lead...'}
                                </option>
                                {leads.map((l) => (
                                    <option key={l._id} value={l._id} className="bg-[#1E1E1E]">
                                        {l.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <div className="border-l border-t border-slate-500 h-2 w-2 rotate-[225deg]"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-[#4ADE80]" />
                            Select Property
                        </label>
                        <div className="relative">
                            <select
                                required
                                className="w-full p-4 bg-[#1E1E1E] border border-[#2E2E2E] rounded-2xl text-sm text-white focus:ring-1 focus:ring-[#4ADE80] focus:border-[#4ADE80] outline-none transition-all appearance-none cursor-pointer"
                                value={property}
                                onChange={(e) => setProperty(e.target.value)}
                                disabled={loading}
                            >
                                <option value="" className="bg-[#1E1E1E]">
                                    {loading ? 'Loading properties...' : 'Select a property...'}
                                </option>
                                {properties.map((p) => (
                                    <option
                                        key={p._id}
                                        value={p._id}
                                        className="bg-[#1E1E1E]"
                                        disabled={!p.available}
                                    >
                                        {p.name} ({p.location}) {!p.available && ' - FULL'}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <div className="border-l border-t border-slate-500 h-2 w-2 rotate-[225deg]"></div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-[#4ADE80]" />
                            Visit Outcome
                        </label>
                        <div className="relative">
                            <select
                                className="w-full p-4 bg-[#1E1E1E] border border-[#2E2E2E] rounded-2xl text-sm text-white focus:ring-1 focus:ring-[#4ADE80] focus:border-[#4ADE80] outline-none transition-all appearance-none cursor-pointer"
                                value={outcome}
                                onChange={(e) => setOutcome(e.target.value)}
                            >
                                <option value="Pending" className="bg-[#1E1E1E]">Pending</option>
                                <option value="Interested" className="bg-[#1E1E1E]">Interested</option>
                                <option value="Not Interested" className="bg-[#1E1E1E]">Not Interested</option>
                                <option value="Booked" className="bg-[#1E1E1E]">Booked</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <div className="border-l border-t border-slate-500 h-2 w-2 rotate-[225deg]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <FileText className="h-3 w-3 text-[#4ADE80]" />
                        Additional Notes
                    </label>
                    <textarea
                        placeholder="Special requirements, directions, etc."
                        className="w-full h-32 p-5 bg-[#1E1E1E] border border-[#2E2E2E] rounded-2xl text-sm text-white focus:ring-1 focus:ring-[#4ADE80] focus:border-[#4ADE80] outline-none transition-all resize-none placeholder-slate-600"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>

                <div className="pt-6 flex gap-4">
                    <button
                        type="button"
                        className="flex-1 py-4 px-6 bg-[#252525] hover:bg-[#2E2E2E] text-slate-400 rounded-2xl font-black text-sm uppercase tracking-widest transition-all border border-[#2E2E2E]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-4 px-6 bg-[#4ADE80] hover:bg-[#38C172] text-[#121212] rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[#4ADE80]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle2 className="h-5 w-5" />
                        {submitting ? 'Scheduling...' : 'Confirm Visit'}
                    </button>
                </div>
            </form>
        </div>
    );
}
