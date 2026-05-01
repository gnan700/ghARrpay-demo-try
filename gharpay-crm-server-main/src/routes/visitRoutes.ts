import express from 'express';
import { getVisits, createVisit, updateVisitOutcome } from '../controllers/visitController';

const router = express.Router();

router.get('/', getVisits);
router.post('/', createVisit);
router.patch('/:id/outcome', updateVisitOutcome);

export default router;
