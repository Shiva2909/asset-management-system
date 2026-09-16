/**
 * @file billRoutes.js
 * @description Routes for managing asset bills and file uploads.
 */

const express = require('express');
const router = express.Router();

const { addBill, getAllBills } = require('../controllers/billController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


router.post('/bills', verifyToken, verifyAdmin, upload.single('invoiceFile'), addBill);


router.get('/bills', verifyToken, verifyAdmin, getAllBills);

module.exports = router;