const express = require('express');
const router = express.Router();

// 1. Import asset controllers
const { getAssets, createAsset ,updateAsset,deleteAsset} = require('../controllers/assetController');

// 2. Import authentication and authorization middlewares
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// 3. Apply middlewares to protect the routes

// GET: Fetch all inventory assets
// Accessible by any authenticated user
router.get('/assets', verifyToken, getAssets);

// POST: Add a new asset to the inventory
// Accessible ONLY by authenticated users with the 'Admin' role
router.post('/assets', verifyToken, verifyAdmin, createAsset);

// UPDATE asset by ID (Admin only)
router.put('/assets/:id', verifyToken, verifyAdmin, updateAsset);

// DELETE / SOFT DELETE asset by ID (Admin only)
router.delete('/assets/:id', verifyToken, verifyAdmin, deleteAsset);

module.exports = router;





