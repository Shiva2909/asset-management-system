const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./db.js');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Its give me notification of each request send by frontend from onother camputer
app.use((req, res, next) => {
    console.log(`[LIVE] Frontend send a API request to backend`);
    next();
});

// Connect to the database
connectDB();



// Import API Routes
const employeeRoutes = require('./routes/employeeRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const assetRoutes = require('./routes/assetRoutes');
const allocationRoutes = require('./routes/allocationRoutes');
const billRoutes = require('./routes/billRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const typeRoutes = require('./routes/typeRoutes'); 


// Mount API Routes
app.use('/api', employeeRoutes);
app.use('/api/auth', authRoutes);  
app.use('/api', categoryRoutes);
app.use('/api', assetRoutes);
app.use('/api', allocationRoutes);
app.use('/api', billRoutes);
app.use('/api',maintenanceRoutes)
app.use('/api', typeRoutes);
 
// Base Test Route
app.get('/', (req, res) => {
    res.send('Asset Management System API is running');
});

// Define the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});