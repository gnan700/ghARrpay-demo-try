"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import { Lead, LeadStatus } from '@/lib/types';
import { Filter, Search } from 'lucide-react';

import DataStateDisplay from '@/components/common/DataStateDisplay';

export default function PipelinePage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchLeads();
    }, []);

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Lead Pipeline</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and track your lead progression</p>
                </div>
            </div>

            <DataStateDisplay
                isLoading={loading && leads.length === 0}
                isEmpty={!loading && leads.length === 0}
                emptyMessage="No leads in pipeline"
                onRefresh={fetchLeads}
            >
                <KanbanBoard initialLeads={leads} />
            </DataStateDisplay>
        </DashboardLayout >
    );
}
