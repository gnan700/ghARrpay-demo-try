import { Request, Response } from 'express';
import User from '../models/User';

export const getAgents = async (req: Request, res: Response) => {
    try {
        const agents = await User.find({ role: 'agent' }).select('name email');
        res.status(200).json(agents);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
export const getAgentPerformance = async (req: Request, res: Response) => {
    try {
        const stats = await User.aggregate([
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
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
