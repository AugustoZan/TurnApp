const db = require('../config/db');

const getSlots = (req, res) => {
  db.query('SELECT * FROM slots WHERE available = true ORDER BY date, time', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
};

const createSlot = (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  const { date, time } = req.body;
  db.query('INSERT INTO slots (date, time) VALUES (?, ?)', [date, time], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error creating slot' });
    res.status(201).json({ message: 'Slot created', id: result.insertId });
  });
};

module.exports = { getSlots, createSlot };