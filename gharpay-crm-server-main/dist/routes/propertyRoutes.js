"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const propertyController_1 = require("../controllers/propertyController");
const router = express_1.default.Router();
router.get('/', propertyController_1.getProperties);
router.post('/', propertyController_1.createProperty);
router.patch('/:id/availability', propertyController_1.updatePropertyAvailability);
exports.default = router;
