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
exports.updateVisitOutcome = exports.createVisit = exports.getVisits = void 0;
const Visit_1 = __importDefault(require("../models/Visit"));
const activityService = __importStar(require("../services/activityService"));
const LeadActivity_1 = require("../models/LeadActivity");
const getVisits = async (req, res) => {
    try {
        const { leadId } = req.query;
        const query = leadId ? { lead: leadId } : {};
        const visits = await Visit_1.default.find(query)
            .populate('lead', 'name phone email')
            .populate('property', 'name location price')
            .populate('agent', 'name email')
            .sort({ visitDate: 1 });
        res.status(200).json(visits);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getVisits = getVisits;
const createVisit = async (req, res) => {
    try {
        const visit = new Visit_1.default(req.body);
        await visit.save();
        // Populate for response
        await visit.populate(['lead', 'property', 'agent']);
        // Log activity
        const propertyName = visit.property?.name || 'Property';
        await activityService.logActivity(req.body.lead, LeadActivity_1.ActivityType.VISIT_SCHEDULED, `Scheduled visit for ${propertyName} on ${visit.visitDate.toLocaleDateString()}`, req.body.agent, { visitId: visit._id, propertyName });
        res.status(201).json(visit);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createVisit = createVisit;
const updateVisitOutcome = async (req, res) => {
    try {
        const { id } = req.params;
        const { outcome, notes } = req.body;
        const visit = await Visit_1.default.findByIdAndUpdate(id, { outcome, notes }, { new: true }).populate(['lead', 'property', 'agent']);
        if (!visit) {
            return res.status(404).json({ message: 'Visit not found' });
        }
        // Log activity
        await activityService.logActivity(visit.lead._id.toString(), LeadActivity_1.ActivityType.VISIT_OUTCOME, `Visit outcome updated to: ${outcome}`, visit.agent?._id.toString(), { visitId: visit._id, outcome });
        res.status(200).json(visit);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateVisitOutcome = updateVisitOutcome;
