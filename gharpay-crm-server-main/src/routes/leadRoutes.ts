import { Router } from 'express';
import * as leadController from '../controllers/leadController';

const router = Router();

router.post('/capture', leadController.handleLeadCapture);
router.get('/', leadController.getAllLeads);
router.get('/activities', leadController.getGlobalActivities);
router.get('/:id', leadController.getLeadById);
router.get('/:id/activities', leadController.getLeadActivities);
router.patch('/:id/status', leadController.updateLeadStatus);
router.patch('/:id/assign', leadController.assignLead);
router.put('/:id', leadController.updateLead);

export default router;
