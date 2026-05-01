import mongoose, { Schema, Document } from 'mongoose';

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

export enum LeadSource {
    WHATSAPP = 'WhatsApp',
    WEBSITE = 'Website',
    SOCIAL = 'Social',
    PHONE = 'Phone',
    FORM = 'Form'
}

export interface ILead extends Document {
    name: string;
    phoneNumber: string;
    email?: string;
    source: LeadSource;
    status: LeadStatus;
    assignedAgent?: mongoose.Types.ObjectId;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const LeadSchema: Schema = new Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    source: { type: String, enum: Object.values(LeadSource), default: LeadSource.FORM },
    status: { type: String, enum: Object.values(LeadStatus), default: LeadStatus.NEW_LEAD },
    assignedAgent: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
}, { timestamps: true });

export default mongoose.model<ILead>('Lead', LeadSchema);
