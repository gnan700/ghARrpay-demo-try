"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgentPerformance = exports.getAgents = void 0;
const User_1 = __importDefault(require("../models/User"));
const getAgents = async (req, res) => {
    try {
        const agents = await User_1.default.find({ role: 'agent' }).select('name email');
        res.status(200).json(agents);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAgents = getAgents;
const getAgentPerformance = async (req, res) => {
    try {
        const stats = await User_1.default.aggregate([
            { $match: { role: 'agent' } },
            {
                $lookup: {
                    from: 'leads',
                    localField: '_id',
                    foreignField: 'assignedAgent',
                    as: 'leads'
                }
            },
            {
                $lookup: {
                    from: 'visits',
                    localField: '_id',
                    foreignField: 'agent',
                    as: 'visits'
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    totalLeads: { $size: '$leads' },
                    bookedLeads: {
                        $size: {
                            $filter: {
                                input: '$leads',
                                as: 'lead',
                                cond: { $eq: ['$$lead.status', 'Booked'] }
                            }
                        }
                    },
                    totalVisits: { $size: '$visits' },
                    conversionRate: {
                        $cond: [
                            { $gt: [{ $size: '$leads' }, 0] },
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            {
                                                $size: {
                                                    $filter: {
                                                        input: '$leads',
                                                        as: 'lead',
                                                        cond: { $eq: ['$$lead.status', 'Booked'] }
                                                    }
                                                }
                                            },
                                            { $size: '$leads' }
                                        ]
                                    },
                                    100
                                ]
                            },
                            0
                        ]
                    }
                }
            },
            { $sort: { bookedLeads: -1, conversionRate: -1 } }
        ]);
        res.status(200).json(stats);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAgentPerformance = getAgentPerformance;
