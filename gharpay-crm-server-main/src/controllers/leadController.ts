import { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as leadService from '../services/leadService';
import Lead from '../models/Lead';
import * as activityService from '../services/activityService';
import { ActivityType } from '../models/LeadActivity';

export const handleLeadCapture = async (req: Request, res: Response) => {
    try {
        const lead = await leadService.captureLead(req.body);
        res.status(201).json(lead);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllLeads = async (req: Request, res: Response) => {
    try {
        const leads = await Lead.find().populate('assignedAgent', 'name email');
        res.status(200).json(leads);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getLeadById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const lead = await Lead.findById(id).populate('assignedAgent', 'name email');
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.status(200).json(lead);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateLeadStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const oldLead = await Lead.findById(id);
        const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });

        if (lead && oldLead && oldLead.status !== status) {
            await activityService.logActivity(
                id as string,
                ActivityType.STATUS_CHANGE,
                `Changed status from ${oldLead.status} to ${status}`,
                req.body.performedBy as string,
                { oldStatus: oldLead.status, newStatus: status }
            );
        }

        res.status(200).json(lead);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const assignLead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { agentId } = req.body;
        const lead = await Lead.findByIdAndUpdate(id, { assignedAgent: agentId }, { new: true }).populate('assignedAgent', 'name email');

        if (lead) {
            const agentName = (lead.assignedAgent as any)?.name || 'Unassigned';
            await activityService.logActivity(
                id as string,
                ActivityType.ASSIGNMENT,
                `Assigned to agent ${agentName}`,
                req.body.performedBy as string,
                { agentId }
            );
        }

        res.status(200).json(lead);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateLead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const lead = await Lead.findByIdAndUpdate(id, req.body, { new: true }).populate('assignedAgent', 'name email');
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        await activityService.logActivity(
            id as string,
            ActivityType.PROFILE_UPDATED,
            `Updated lead profile information`,
            req.body.performedBy as string,
            { updatedFields: Object.keys(req.body) }
        );

        res.status(200).json(lead);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getGlobalActivities = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const activities = await activityService.getAllActivities(limit);
        res.status(200).json(activities);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getLeadActivities = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const activities = await activityService.getActivitiesByLeadId(id);
        res.status(200).json(activities);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
