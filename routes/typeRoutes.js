const express = require('express');
const router = express.Router();
const { addType, getTypes } = require('../controllers/typeController');


const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware'); 


router.get('/types', verifyToken, getTypes);
  

router.post('/types', verifyToken, verifyAdmin, addType);

module.exports = router;