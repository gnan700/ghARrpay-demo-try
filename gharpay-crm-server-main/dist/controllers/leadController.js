"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeadActivities = exports.getGlobalActivities = exports.updateLead = exports.assignLead = exports.updateLeadStatus = exports.getLeadById = exports.getAllLeads = exports.handleLeadCapture = void 0;
const leadService = __importStar(require("../services/leadService"));
const Lead_1 = __importDefault(require("../models/Lead"));
const activityService = __importStar(require("../services/activityService"));
const LeadActivity_1 = require("../models/LeadActivity");
const handleLeadCapture = async (req, res) => {
    try {
        const lead = await leadService.captureLead(req.body);
        res.status(201).json(lead);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.handleLeadCapture = handleLeadCapture;
const getAllLeads = async (req, res) => {
    try {
        const leads = await Lead_1.default.find().populate('assignedAgent', 'name email');
        res.status(200).json(leads);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllLeads = getAllLeads;
const getLeadById = async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await Lead_1.default.findById(id).populate('assignedAgent', 'name email');
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.status(200).json(lead);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getLeadById = getLeadById;
const updateLeadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const oldLead = await Lead_1.default.findById(id);
        const lead = await Lead_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (lead && oldLead && oldLead.status !== status) {
            await activityService.logActivity(id, LeadActivity_1.ActivityType.STATUS_CHANGE, `Changed status from ${oldLead.status} to ${status}`, req.body.performedBy, { oldStatus: oldLead.status, newStatus: status });
        }
        res.status(200).json(lead);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateLeadStatus = updateLeadStatus;
const assignLead = async (req, res) => {
    try {
        const { id } = req.params;
        const { agentId } = req.body;
        const lead = await Lead_1.default.findByIdAndUpdate(id, { assignedAgent: agentId }, { new: true }).populate('assignedAgent', 'name email');
        if (lead) {
            const agentName = lead.assignedAgent?.name || 'Unassigned';
            await activityService.logActivity(id, LeadActivity_1.ActivityType.ASSIGNMENT, `Assigned to agent ${agentName}`, req.body.performedBy, { agentId });
        }
        res.status(200).json(lead);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.assignLead = assignLead;
const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await Lead_1.default.findByIdAndUpdate(id, req.body, { new: true }).populate('assignedAgent', 'name email');
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        await activityService.logActivity(id, LeadActivity_1.ActivityType.PROFILE_UPDATED, `Updated lead profile information`, req.body.performedBy, { updatedFields: Object.keys(req.body) });
        res.status(200).json(lead);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateLead = updateLead;
const getGlobalActivities = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const activities = await activityService.getAllActivities(limit);
        res.status(200).json(activities);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getGlobalActivities = getGlobalActivities;
const getLeadActivities = async (req, res) => {
    try {
        const id = req.params.id;
        const activities = await activityService.getActivitiesByLeadId(id);
        res.status(200).json(activities);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getLeadActivities = getLeadActivities;
