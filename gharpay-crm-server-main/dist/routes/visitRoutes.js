"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const visitController_1 = require("../controllers/visitController");
const router = express_1.default.Router();
router.get('/', visitController_1.getVisits);
router.post('/', visitController_1.createVisit);
router.patch('/:id/outcome', visitController_1.updateVisitOutcome);
exports.default = router;
