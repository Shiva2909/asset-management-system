/**
 * @file allocationRoutes.js
 * @description Routes for managing asset allocations and returns.
 */

const express = require('express');
const router = express.Router();   

// 1. Import allocation controllers
const { allocateAsset, returnAsset, getAllocations, getAllocationsById ,getAssetHistory} = require('../controllers/allocationController');

// 2. Import authentication and authorization middlewares
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// 3. Apply middlewares to protect the routes

/**
 * @route GET /api/allocations
 * @description Fetch the history and current status of all asset allocations.
 * @access Private & Admin Only
 */
router.get('/allocations', verifyToken, verifyAdmin, getAllocations);

/**
 * @route POST /api/allocations/assign
 * @description Assign an available asset to an employee.
 * @access Private & Admin Only   
 */
router.post('/allocations/assign', verifyToken, verifyAdmin, allocateAsset);

/**
 * @route POST /api/allocations/return
 * @description Process the return of an allocated asset.
 * @access Private & Admin Only
 */
// Return asset route with allocationId parameter
router.put('/allocations/return/:allocationId', verifyToken, verifyAdmin, returnAsset);
router.get('/allocations/:allocationId', verifyToken, verifyAdmin, getAllocationsById);
// Asset ki history nikalne ka route
router.get('/allocations/history/:assetId', verifyToken, verifyAdmin, getAssetHistory);
  


module.exports = router;    