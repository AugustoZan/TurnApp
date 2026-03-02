const express = require('express');
const router = express.Router();
const { getSlots, createSlot } = require('../controllers/slotsController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, getSlots);
router.post('/', verifyToken, createSlot);

module.exports = router;