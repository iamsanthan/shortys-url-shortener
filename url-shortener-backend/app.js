// app.js
const cors = require('cors');

const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

app.use(cors());

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/', require('./routes/url'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
