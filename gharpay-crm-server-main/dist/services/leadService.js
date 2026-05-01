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
exports.captureLead = void 0;
const Lead_1 = __importStar(require("../models/Lead"));
const User_1 = __importDefault(require("../models/User"));
const activityService = __importStar(require("./activityService"));
const LeadActivity_1 = require("../models/LeadActivity");
const captureLead = async (leadData) => {
    const { name, phoneNumber, email, source, notes } = leadData;
    const lead = new Lead_1.default({
        name,
        phoneNumber,
        email,
        source: source || Lead_1.LeadSource.FORM,
        notes,
    });
    // Automatic Lead Assignment - Round Robin (simplified)
    const agent = await findAgentForAssignment();
    if (agent) {
        lead.assignedAgent = agent._id;
        lead.status = Lead_1.LeadStatus.NEW_LEAD;
        // Update agent stats
        agent.assignedLeadsCount += 1;
        agent.lastAssignedAt = new Date();
        await agent.save();
    }
    await lead.save();
    // Log the initial capture
    await activityService.logActivity(lead._id.toString(), LeadActivity_1.ActivityType.STATUS_CHANGE, `New lead captured from ${lead.source}`, lead.assignedAgent?.toString());
    return lead;
};
exports.captureLead = captureLead;
const findAgentForAssignment = async () => {
    // Strategy: Round Robin based on lastAssignedAt or least leads
    return await User_1.default.findOne({ role: 'agent' }).sort({ lastAssignedAt: 1, assignedLeadsCount: 1 });
};
