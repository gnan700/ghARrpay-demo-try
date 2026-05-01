import { Lead, LeadStatus } from '@/lib/types';
import dayjs from 'dayjs';

export const getInactiveLeads = (leads: Lead[]) => {
    const threshold = dayjs().subtract(24, 'hours');
    return leads.filter(lead =>
        lead.status !== LeadStatus.BOOKED &&
        lead.status !== LeadStatus.LOST &&
        dayjs(lead.createdAt).isBefore(threshold)
    );
};
