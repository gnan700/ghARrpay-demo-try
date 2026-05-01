import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/agents', userController.getAgents);
router.get('/performance', userController.getAgentPerformance);

export default router;
