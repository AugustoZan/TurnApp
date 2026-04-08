const db = require('../config/db');

const getAppointments = async (req, res) => {
  const query = req.user.role === 'admin'
    ? 'SELECT a.*, u.name, u.email, s.date, s.time FROM appointments a JOIN users u ON a.user_id = u.id JOIN slots s ON a.slot_id = s.id'
    : 'SELECT a.*, s.date, s.time FROM appointments a JOIN slots s ON a.slot_id = s.id WHERE a.user_id = $1';
  const params = req.user.role === 'admin' ? [] : [req.user.id];

  try {
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
};

const createAppointment = async (req, res) => {
  const { slot_id } = req.body;
  try {
    const { rows } = await db.query('SELECT * FROM slots WHERE id = $1 AND available = true', [slot_id]);
    if (rows.length === 0) return res.status(400).json({ message: 'Slot not available' });

    await db.query('INSERT INTO appointments (user_id, slot_id) VALUES ($1, $2)', [req.user.id, slot_id]);
    await db.query('UPDATE slots SET available = false WHERE id = $1', [slot_id]);
    res.status(201).json({ message: 'Appointment created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
};

const cancelAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM appointments WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Appointment not found' });

    const slot_id = rows[0].slot_id;
    await db.query("UPDATE appointments SET status = 'cancelled' WHERE id = $1", [id]);
    await db.query('UPDATE slots SET available = true WHERE id = $1', [slot_id]);
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
};

module.exports = { getAppointments, createAppointment, cancelAppointment };