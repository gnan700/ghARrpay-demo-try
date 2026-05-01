"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePropertyAvailability = exports.createProperty = exports.getProperties = void 0;
const Property_1 = __importDefault(require("../models/Property"));
const getProperties = async (req, res) => {
    try {
        const properties = await Property_1.default.find();
        res.status(200).json(properties);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProperties = getProperties;
const createProperty = async (req, res) => {
    try {
        const property = new Property_1.default(req.body);
        await property.save();
        res.status(201).json(property);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createProperty = createProperty;
const updatePropertyAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { available } = req.body;
        const property = await Property_1.default.findByIdAndUpdate(id, { available }, { new: true });
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json(property);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updatePropertyAvailability = updatePropertyAvailability;
