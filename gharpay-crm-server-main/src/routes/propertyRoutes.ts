import express from 'express';
import { getProperties, createProperty, updatePropertyAvailability } from '../controllers/propertyController';

const router = express.Router();

router.get('/', getProperties);
router.post('/', createProperty);
router.patch('/:id/availability', updatePropertyAvailability);

export default router;
