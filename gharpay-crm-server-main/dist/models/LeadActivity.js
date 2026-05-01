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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ActivityType;
(function (ActivityType) {
    ActivityType["STATUS_CHANGE"] = "status_change";
    ActivityType["ASSIGNMENT"] = "assignment";
    ActivityType["VISIT_SCHEDULED"] = "visit_scheduled";
    ActivityType["VISIT_OUTCOME"] = "visit_outcome";
    ActivityType["NOTE_ADDED"] = "note_added";
    ActivityType["PROFILE_UPDATED"] = "profile_updated";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
const LeadActivitySchema = new mongoose_1.Schema({
    lead: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Lead', required: true },
    type: { type: String, enum: Object.values(ActivityType), required: true },
    description: { type: String, required: true },
    performedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    metadata: { type: mongoose_1.Schema.Types.Mixed }
}, { timestamps: true });
exports.default = mongoose_1.default.model('LeadActivity', LeadActivitySchema);
