import { Request, Response } from 'express';
import Visit from '../models/Visit';
import * as activityService from '../services/activityService';
import { ActivityType } from '../models/LeadActivity';

export const getVisits = async (req: Request, res: Response) => {
    try {
        const { leadId } = req.query;
        const query = leadId ? { lead: leadId } : {};

        const visits = await Visit.find(query)
            .populate('lead', 'name phone email')
            .populate('property', 'name location price')
            .populate('agent', 'name email')
            .sort({ visitDate: 1 });
        res.status(200).json(visits);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createVisit = async (req: Request, res: Response) => {
    try {
        const visit = new Visit(req.body);
        await visit.save();

        // Populate for response
        await visit.populate(['lead', 'property', 'agent']);

        // Log activity
        const propertyName = (visit.property as any)?.name || 'Property';
        await activityService.logActivity(
            req.body.lead as string,
            ActivityType.VISIT_SCHEDULED,
            `Scheduled visit for ${propertyName} on ${visit.visitDate.toLocaleDateString()}`,
            req.body.agent as string,
            { visitId: visit._id, propertyName }
        );

        res.status(201).json(visit);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateVisitOutcome = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { outcome, notes } = req.body;

        const visit = await Visit.findByIdAndUpdate(
            id,
            { outcome, notes },
            { new: true }
        ).populate(['lead', 'property', 'agent']);

        if (!visit) {
            return res.status(404).json({ message: 'Visit not found' });
        }

        // Log activity
        await activityService.logActivity(
            visit.lead._id.toString(),
            ActivityType.VISIT_OUTCOME,
            `Visit outcome updated to: ${outcome}`,
            (visit.agent as any)?._id.toString(),
            { visitId: visit._id, outcome }
        );

        res.status(200).json(visit);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
