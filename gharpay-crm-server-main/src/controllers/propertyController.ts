import { Request, Response } from 'express';
import Property from '../models/Property';

export const getProperties = async (req: Request, res: Response) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createProperty = async (req: Request, res: Response) => {
    try {
        const property = new Property(req.body);
        await property.save();
        res.status(201).json(property);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updatePropertyAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { available } = req.body;
        const property = await Property.findByIdAndUpdate(id, { available }, { new: true });
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json(property);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
