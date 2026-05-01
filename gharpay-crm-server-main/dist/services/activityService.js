"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllActivities = exports.getActivitiesByLeadId = exports.logActivity = void 0;
const LeadActivity_1 = __importDefault(require("../models/LeadActivity"));
const logActivity = async (leadId, type, description, performedBy, metadata) => {
    try {
        await LeadActivity_1.default.create({
            lead: leadId,
            type,
            description,
            performedBy,
            metadata
        });
    }
    catch (error) {
        console.error('Error logging activity:', error);
    }
};
exports.logActivity = logActivity;
const getActivitiesByLeadId = async (leadId) => {
    return await LeadActivity_1.default.find({ lead: leadId })
        .populate('performedBy', 'name email')
        .sort({ createdAt: -1 });
};
exports.getActivitiesByLeadId = getActivitiesByLeadId;
const getAllActivities = async (limit = 10) => {
    return await LeadActivity_1.default.find()
        .populate('lead', 'name')
        .populate('performedBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit);
};
exports.getAllActivities = getAllActivities;
