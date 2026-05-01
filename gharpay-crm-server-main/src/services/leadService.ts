import Lead, { LeadSource, LeadStatus } from '../models/Lead';
import User from '../models/User';
import * as activityService from './activityService';
import { ActivityType } from '../models/LeadActivity';

export const captureLead = async (leadData: any) => {
    const { name, phoneNumber, email, source, notes } = leadData;

    const lead = new Lead({
        name,
        phoneNumber,
        email,
        source: source || LeadSource.FORM,
        notes,
    });

    // Automatic Lead Assignment - Round Robin (simplified)
    const agent = await findAgentForAssignment();
    if (agent) {
        lead.assignedAgent = agent._id as any;
        lead.status = LeadStatus.NEW_LEAD;

        // Update agent stats
        agent.assignedLeadsCount += 1;
        agent.lastAssignedAt = new Date();
        await agent.save();
    }

    await lead.save();

    // Log the initial capture
    await activityService.logActivity(
        lead._id.toString(),
        ActivityType.STATUS_CHANGE,
        `New lead captured from ${lead.source}`,
        lead.assignedAgent?.toString()
    );

    return lead;
};

const findAgentForAssignment = async () => {
    // Strategy: Round Robin based on lastAssignedAt or least leads
    return await User.findOne({ role: 'agent' }).sort({ lastAssignedAt: 1, assignedLeadsCount: 1 });
};
