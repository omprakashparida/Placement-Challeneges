require('dotenv').config({ path: './main.env' });  // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1); // Exit process if connection fails
    });

const db = mongoose.connection;
db.on('error', err => console.error('❌ Database error:', err.message));

// Use Routes
const usersRouter = require('./backend/routes/users');
app.use('/api/users', usersRouter);

// Define a simple route
app.get('/', (req, res) => {
    res.send('PlacementPulse Backend');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
