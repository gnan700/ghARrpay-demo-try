"use client";

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Lead, LeadStatus, COLUMNS } from '@/lib/types';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Phone, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface KanbanBoardProps {
    initialLeads: Lead[];
}

export default function KanbanBoard({ initialLeads }: KanbanBoardProps) {
    const [leads, setLeads] = useState<Lead[]>(initialLeads);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId as LeadStatus;

        // Optimistic update
        const updatedLeads = [...leads];
        const leadIndex = updatedLeads.findIndex(l => (l._id || l.id) === draggableId);
        if (leadIndex !== -1) {
            const oldStatus = updatedLeads[leadIndex].status;
            updatedLeads[leadIndex] = {
                ...updatedLeads[leadIndex],
                status: newStatus,
            };
            setLeads(updatedLeads);

            try {
                // Update backend
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                await fetch(`${apiUrl}/api/leads/${draggableId}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus }),
                });
            } catch (error) {
                console.error('Failed to update lead status:', error);
                // Revert on error
                const revertedLeads = [...leads];
                revertedLeads[leadIndex].status = oldStatus;
                setLeads(revertedLeads);
            }
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-8 overflow-x-auto pb-8 min-h-[calc(100vh-14rem)] scrollbar-hide">
                {COLUMNS.map((column) => (
                    <div key={column.id} className="flex flex-col min-w-[320px] w-[320px] bg-[#181818] rounded-[32px] p-6 border border-[#2E2E2E]">
                        <div className="flex items-center justify-between mb-6 px-2">
                            <h3 className="font-black text-white text-sm uppercase tracking-tight">{column.title}</h3>
                            <span className="bg-[#252525] text-[#4ADE80] text-[10px] font-black px-3 py-1 rounded-full border border-[#2E2E2E]">
                                {leads.filter(l => l.status === column.id).length}
                            </span>
                        </div>
                        <Droppable droppableId={column.id}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={cn(
                                        "flex-1 flex flex-col gap-4 min-h-[100px] transition-all rounded-2xl",
                                        snapshot.isDraggingOver ? "bg-[#252525]/50 scale-[0.98]" : ""
                                    )}
                                >
                                    {leads
                                        .filter(lead => lead.status === column.id)
                                        .map((lead, index) => (
                                            <Draggable key={lead._id || lead.id} draggableId={lead._id || lead.id || ''} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={cn(
                                                            "bg-[#1E1E1E] p-5 rounded-2xl border border-[#2E2E2E] shadow-xl transition-all group",
                                                            snapshot.isDragging ? "shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-2 ring-[#4ADE80]/50 rotate-2" : "hover:border-[#4ADE80]/30"
                                                        )}
                                                    >
                                                        <div className="flex items-start justify-between mb-3">
                                                            <Link href={`/leads/${lead._id || lead.id}`}>
                                                                <h4 className="font-bold text-white text-base leading-tight group-hover:text-[#4ADE80] transition-colors cursor-pointer">{lead.name}</h4>
                                                            </Link>
                                                            <MoreHorizontal className="h-4 w-4 text-slate-600" />
                                                        </div>

                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-[#252525] text-[#4ADE80] border border-[#2E2E2E]">
                                                                {lead.source}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-4 border-t border-[#2E2E2E]">
                                                            <div className="flex gap-2">
                                                                <button className="p-2 rounded-xl bg-[#252525] text-slate-400 hover:text-[#4ADE80] hover:bg-[#2E2E2E] transition-all">
                                                                    <Phone className="h-4 w-4" />
                                                                </button>
                                                                <button className="p-2 rounded-xl bg-[#252525] text-slate-400 hover:text-[#4ADE80] hover:bg-[#2E2E2E] transition-all">
                                                                    <MessageSquare className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                                                                {new Date(lead.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
}
