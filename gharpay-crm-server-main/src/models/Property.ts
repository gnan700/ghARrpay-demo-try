import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
    name: string;
    location: string;
    price: number;
    type: 'Single' | 'Double' | 'Triple' | 'Studio';
    available: boolean;
}

const PropertySchema: Schema = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ['Single', 'Double', 'Triple', 'Studio'], required: true },
    available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IProperty>('Property', PropertySchema);
