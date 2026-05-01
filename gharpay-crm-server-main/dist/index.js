"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const leadRoutes_1 = __importDefault(require("./routes/leadRoutes"));
const propertyRoutes_1 = __importDefault(require("./routes/propertyRoutes"));
const visitRoutes_1 = __importDefault(require("./routes/visitRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
app.use((0, cors_1.default)({
    origin: [
        'https://gharpay-crm.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true
}));
app.use(express_1.default.json());
// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
// Routes
app.use('/api/leads', leadRoutes_1.default);
app.use('/api/properties', propertyRoutes_1.default);
app.use('/api/visits', visitRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gharpay-crm');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});
