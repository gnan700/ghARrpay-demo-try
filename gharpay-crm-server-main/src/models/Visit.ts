import mongoose, { Schema, Document } from 'mongoose';

export enum VisitOutcome {
    PENDING = 'Pending',
    INTERESTED = 'Interested',
    NOT_INTERESTED = 'Not Interested',
    BOOKED = 'Booked'
}

export interface IVisit extends Document {
    lead: mongoose.Types.ObjectId;
    property: mongoose.Types.ObjectId;
    visitDate: Date;
    visitTime: string;
    notes?: string;
    outcome: VisitOutcome;
    agent: mongoose.Types.ObjectId;
}

const VisitSchema: Schema = new Schema({
    lead: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    visitDate: { type: Date, required: true },
    visitTime: { type: String, required: true },
    notes: { type: String },
    outcome: { type: String, enum: Object.values(VisitOutcome), default: VisitOutcome.PENDING },
    agent: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<IVisit>('Visit', VisitSchema);
