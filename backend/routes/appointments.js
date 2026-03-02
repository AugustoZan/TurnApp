const express = require('express');
const router = express.Router();
const { getAppointments, createAppointment, cancelAppointment } = require('../controllers/appointmentsController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, getAppointments);
router.post('/', verifyToken, createAppointment);
router.put('/:id/cancel', verifyToken, cancelAppointment);

module.exports = router;