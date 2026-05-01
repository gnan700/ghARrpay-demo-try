import { formatDate, cn } from '@/lib/utils';
import {
    Clock,
    User,
    Calendar,
    CheckCircle2,
    ClipboardList,
    ArrowRightLeft,
    LucideIcon
} from 'lucide-react';

interface Activity {
    _id: string;
    type: 'status_change' | 'assignment' | 'visit_scheduled' | 'visit_outcome' | 'note_added' | 'profile_updated';
    description: string;
    performedBy?: {
        name: string;
        email: string;
    };
    metadata?: any;
    createdAt: string;
}

interface ActivityTimelineProps {
    activities: Activity[];
}

const getActivityIcon = (type: string): LucideIcon => {
    switch (type) {
        case 'status_change': return ArrowRightLeft;
        case 'assignment': return User;
        case 'visit_scheduled': return Calendar;
        case 'visit_outcome': return CheckCircle2;
        case 'note_added': return ClipboardList;
        default: return Clock;
    }
};

const getActivityColor = (type: string): string => {
    switch (type) {
        case 'status_change': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        case 'assignment': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
        case 'visit_scheduled': return 'text-[#4ADE80] bg-[#4ADE80]/10 border-[#4ADE80]/20';
        case 'visit_outcome': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
        case 'note_added': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
};

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
    if (!activities || activities.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-slate-600 text-sm font-bold">No activity history yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 relative">
            {/* Vertical Line */}
            <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#2E2E2E] via-[#2E2E2E] to-transparent"></div>

            {activities.map((activity, idx) => {
                const Icon = getActivityIcon(activity.type);
                const colorClasses = getActivityColor(activity.type);

                return (
                    <div key={activity._id} className="flex gap-6 relative group">
                        {/* Icon Node */}
                        <div className={cn(
                            "h-10 w-10 rounded-2xl border flex items-center justify-center relative z-10 shrink-0 transition-transform group-hover:scale-110 duration-300",
                            colorClasses
                        )}>
                            <Icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="pt-1 flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                        {activity.description}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1 bg-[#252525] rounded-lg border border-[#2E2E2E]">
                                            {formatDate(activity.createdAt)}
                                        </p>
                                        {activity.performedBy && (
                                            <span className="text-[10px] text-slate-600 font-bold italic">
                                                by {activity.performedBy.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Metadata snippet if any */}
                            {activity.type === 'visit_scheduled' && activity.metadata?.propertyName && (
                                <div className="mt-3 p-3 bg-[#1E1E1E] border border-[#2E2E2E] rounded-xl inline-block max-w-full">
                                    <p className="text-[10px] font-black text-[#4ADE80] uppercase tracking-widest mb-1">Property Link</p>
                                    <p className="text-xs text-white font-bold truncate">{activity.metadata.propertyName}</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
