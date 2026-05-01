import LeadActivity, { ActivityType } from '../models/LeadActivity';

export const logActivity = async (
    leadId: string,
    type: ActivityType,
    description: string,
    performedBy?: string,
    metadata?: any
) => {
    try {
        await LeadActivity.create({
            lead: leadId,
            type,
            description,
            performedBy,
            metadata
        });
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

export const getActivitiesByLeadId = async (leadId: string) => {
    return await LeadActivity.find({ lead: leadId })
        .populate('performedBy', 'name email')
        .sort({ createdAt: -1 });
};

export const getAllActivities = async (limit: number = 10) => {
    return await LeadActivity.find()
        .populate('lead', 'name')
        .populate('performedBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit);
};
