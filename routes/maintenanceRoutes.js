const express = require('express');
const router = express.Router();
const { addMaintenance, getAssetMaintenanceHistory } = require('../controllers/maintenanceController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Tera Multer wala middleware

// Naya repair record daalna (Receipt file 'receipt' naam ke field mein aayegi)
router.post('/maintenance', verifyToken, verifyAdmin, upload.single('receipt'), addMaintenance);

// Kisi specific asset ka maintenance data dekhna
router.get('/assets/:assetId/maintenance', verifyToken, verifyAdmin, getAssetMaintenanceHistory);

module.exports = router;