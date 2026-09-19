const express = require('express');
const router = express.Router();
const { addType, getTypes, editType, deleteType } = require('../controllers/typeController');



const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware'); 
router.post('/types',verifyToken,verifyAdmin, addType);
router.get('/types',verifyToken, getTypes);
router.put('/types/:id',verifyToken,verifyAdmin, editType);     // Edit route
router.delete('/types/:id', verifyToken,verifyAdmin,deleteType); // Delete route




module.exports = router;