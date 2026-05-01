import mongoose, { Schema, Document } from 'mongoose';

export enum ActivityType {
    STATUS_CHANGE = 'status_change',
    ASSIGNMENT = 'assignment',
    VISIT_SCHEDULED = 'visit_scheduled',
    VISIT_OUTCOME = 'visit_outcome',
    NOTE_ADDED = 'note_added',
    PROFILE_UPDATED = 'profile_updated'
}

export interface ILeadActivity extends Document {
    lead: mongoose.Types.ObjectId;
    type: ActivityType;
    // Tasks related to Lead Activity Timeline and Agent Performance Leaderboard:
    // - [x] Property Status Management
    //  - [x] Implement backend endpoint for property availability
    //  - [x] Add availability toggle UI to Properties page
    //  - [x] Disable "Full" properties in Visit Scheduler
    // - [/] Lead Activity Timeline
    //  - [x] Define `LeadActivity` Mongoose model
    //  - [ ] Create activity logging service
    //  - [ ] Log events (Status change, Visit scheduled, Profile updated)
    //  - [ ] Implement `ActivityTimeline` frontend component
    // - [ ] Agent Performance Leaderboard
    //  - [ ] Create aggregation API for agent performance
    //  - [ ] Implement `AgentLeaderboard` frontend widget
    description: string;
    performedBy?: mongoose.Types.ObjectId;
    metadata?: any;
    createdAt: Date;
}

const LeadActivitySchema: Schema = new Schema({
    lead: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
    type: { type: String, enum: Object.values(ActivityType), required: true },
    description: { type: String, required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.model<ILeadActivity>('LeadActivity', LeadActivitySchema);
