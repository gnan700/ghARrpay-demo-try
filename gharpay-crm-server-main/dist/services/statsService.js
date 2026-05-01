"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyStats = exports.updateVisitOutcome = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const updateVisitOutcome = async (visitId, outcome) => {
    // Update visit outcome and log activity
    // In a real app, this would also update the Lead status if outcome is BOOKED
};
exports.updateVisitOutcome = updateVisitOutcome;
const getDailyStats = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalLeads = await Lead_1.default.countDocuments();
    const newLeadsToday = await Lead_1.default.countDocuments({ createdAt: { $gte: today } });
    const statsByStatus = await Lead_1.default.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    return {
        totalLeads,
        newLeadsToday,
        statsByStatus
    };
};
exports.getDailyStats = getDailyStats;
