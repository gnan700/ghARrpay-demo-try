"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LeadProfile from '@/components/leads/LeadProfile';
import { Lead } from '@/lib/types';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function LeadDetailsPage() {
    const params = useParams();
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const response = await fetch(`${apiUrl}/api/leads/${params.id}`);
                const data = await response.json();
                setLead(data);
            } catch (error) {
                console.error('Error fetching lead details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchLead();
    }, [params.id]);

    return (
        <DashboardLayout>
            <div className="mb-10 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                <Link href="/dashboard" className="hover:text-[#4ADE80] transition-colors flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    Dashboard
                </Link>
                <ChevronRight className="h-3 w-3" />
                <Link href="/leads" className="hover:text-[#4ADE80] transition-colors">Leads</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-white">{loading ? 'Loading...' : lead?.name}</span>
            </div>

            {loading ? (
                <div className="h-96 bg-[#181818] rounded-[32px] border border-[#2E2E2E] animate-pulse"></div>
            ) : lead ? (
                <LeadProfile lead={lead} />
            ) : (
                <div className="text-center py-20 bg-[#181818] rounded-[32px] border border-[#2E2E2E]">
                    <h2 className="text-white text-xl font-bold">Lead not found</h2>
                    <Link href="/leads" className="text-[#4ADE80] mt-4 inline-block font-bold">Back to Leads</Link>
                </div>
            )}
        </DashboardLayout>
    );
}
