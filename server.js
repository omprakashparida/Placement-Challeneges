require('dotenv').config({ path: './main.env' }); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();
app.set('trust proxy', 1); // Enable trust for reverse proxies


// ✅ Security Middleware
app.use(bodyParser.json({ limit: '10mb' })); // Prevent large payload attacks
app.use(cors({ origin: '*', credentials: true })); // Allow cross-origin requests
app.use(helmet()); // Secure HTTP headers
app.use(mongoSanitize()); // Prevent NoSQL Injection

// 🚀 Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false
});
app.use(limiter);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1); // Exit process if connection fails
    });

const db = mongoose.connection;
db.on('error', err => console.error('❌ Database error:', err.message));

// ✅ Routes
const usersRouter = require('./backend/routes/users');
app.use('/api/users', usersRouter);

// 🌍 Root Route
app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'PlacementPulse Backend is Running 🚀' });
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
