export enum LeadStatus {
    NEW_LEAD = 'New Lead',
    CONTACTED = 'Contacted',
    REQUIREMENT_COLLECTED = 'Requirement Collected',
    PROPERTY_SUGGESTED = 'Property Suggested',
    VISIT_SCHEDULED = 'Visit Scheduled',
    VISIT_COMPLETED = 'Visit Completed',
    BOOKED = 'Booked',
    LOST = 'Lost'
}

export interface Lead {
    id?: string;
    _id?: string;
    name: string;
    phoneNumber: string;
    email?: string;
    source: string;
    status: LeadStatus;
    notes?: string;
    createdAt: string;
    assignedAgent?: {
        _id: string;
        name: string;
        email: string;
    };
}

export interface Column {
    id: LeadStatus;
    title: string;
}

export const COLUMNS: Column[] = [
    { id: LeadStatus.NEW_LEAD, title: 'New Lead' },
    { id: LeadStatus.CONTACTED, title: 'Contacted' },
    { id: LeadStatus.REQUIREMENT_COLLECTED, title: 'Requirement Collected' },
    { id: LeadStatus.PROPERTY_SUGGESTED, title: 'Property Suggested' },
    { id: LeadStatus.VISIT_SCHEDULED, title: 'Visit Scheduled' },
    { id: LeadStatus.VISIT_COMPLETED, title: 'Visit Completed' },
    { id: LeadStatus.BOOKED, title: 'Booked' },
    { id: LeadStatus.LOST, title: 'Lost' },
];

export interface Property {
    _id: string;
    name: string;
    location: string;
    price: string;
    available: boolean;
}

export interface Visit {
    _id: string;
    lead: any;
    property: Property;
    visitDate: string;
    visitTime: string;
    outcome: string;
    notes?: string;
}

export enum ActivityType {
    STATUS_CHANGE = 'status_change',
    ASSIGNMENT = 'assignment',
    VISIT_SCHEDULED = 'visit_scheduled',
    VISIT_OUTCOME = 'visit_outcome',
    NOTE_ADDED = 'note_added',
    PROFILE_UPDATED = 'profile_updated'
}

export interface Activity {
    _id: string;
    type: ActivityType;
    description: string;
    performedBy?: {
        name: string;
        email: string;
    };
    metadata?: any;
    createdAt: string;
}
