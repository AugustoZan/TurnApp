const db = require('../config/db');

const getSlots = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM slots WHERE available = true ORDER BY date, time');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
};

const createSlot = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  const { date, time } = req.body;
  try {
    const { rows } = await db.query('INSERT INTO slots (date, time) VALUES ($1, $2) RETURNING id', [date, time]);
    res.status(201).json({ message: 'Slot created', id: rows[0].id });
  } catch (err) {
    res.status(500).json({ message: 'Error creating slot' });
  }
};

module.exports = { getSlots, createSlot };