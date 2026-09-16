/**
 * @file employeeRoutes.js
 * @description Routes for fetching employee data from the database.
 */

const express = require('express');
const router = express.Router();

// 1. Import controller function
const { getAllEmployees } = require('../controllers/employeeController');

// 2. Import authentication middleware
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route GET /api/employees
 * @description Fetch the list of all employees.
 * @access Private (Accessible by any authenticated user)
 */
// Added verifyToken so that only logged-in users can see the employee list
router.get('/employees', verifyToken, getAllEmployees);

module.exports = router;