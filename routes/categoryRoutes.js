const express = require('express');
const router = express.Router();

const { getCategories, createCategory } = require('../controllers/categoryController');

// 1. Import authentication and authorization middlewares
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// 2. Apply middlewares to protect the routes
// GET: Accessible by any authenticated user
router.get('/categories', verifyToken, getCategories);

// POST: Accessible ONLY by users with the 'Admin' role
router.post('/categories', verifyToken, verifyAdmin, createCategory);

module.exports = router;