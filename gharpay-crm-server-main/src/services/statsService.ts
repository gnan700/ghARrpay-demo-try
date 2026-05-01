import { LeadStatus } from '../models/Lead';
import Lead from '../models/Lead';

export const updateVisitOutcome = async (visitId: string, outcome: string) => {
    // Update visit outcome and log activity
    // In a real app, this would also update the Lead status if outcome is BOOKED
};

export const getDailyStats = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalLeads = await Lead.countDocuments();
    const newLeadsToday = await Lead.countDocuments({ createdAt: { $gte: today } });

    const statsByStatus = await Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    return {
        totalLeads,
        newLeadsToday,
        statsByStatus
    };
};
