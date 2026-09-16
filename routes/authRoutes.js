const express = require('express');
const router = express.Router();

// Import login and signup functions from the auth controller
const { signup, login } = require('../controllers/authController'); // destructuring

// Define the routes
// POST /api/auth/signup -> Hidden route for backend/Admin use
router.post('/signup', signup);

// POST /api/auth/login -> Public route for frontend login
router.post('/login', login);

module.exports = router;