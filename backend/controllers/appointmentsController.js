const db = require('../config/db');

const getAppointments = (req, res) => {
  const query = req.user.role === 'admin'
    ? 'SELECT a.*, u.name, u.email, s.date, s.time FROM appointments a JOIN users u ON a.user_id = u.id JOIN slots s ON a.slot_id = s.id'
    : 'SELECT a.*, s.date, s.time FROM appointments a JOIN slots s ON a.slot_id = s.id WHERE a.user_id = ?';
  const params = req.user.role === 'admin' ? [] : [req.user.id];

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
};

const createAppointment = (req, res) => {
  const { slot_id } = req.body;

  db.query('SELECT * FROM slots WHERE id = ? AND available = true', [slot_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(400).json({ message: 'Slot not available' });

    db.query('INSERT INTO appointments (user_id, slot_id) VALUES (?, ?)', [req.user.id, slot_id], (err) => {
      if (err) return res.status(500).json({ message: 'Error creating appointment' });
      db.query('UPDATE slots SET available = false WHERE id = ?', [slot_id], () => {
        res.status(201).json({ message: 'Appointment created successfully' });
      });
    });
  });
};

const cancelAppointment = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM appointments WHERE id = ? AND user_id = ?', [id, req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Appointment not found' });

    const slot_id = results[0].slot_id;
    db.query('UPDATE appointments SET status = "cancelled" WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ message: 'Error cancelling appointment' });
      db.query('UPDATE slots SET available = true WHERE id = ?', [slot_id], () => {
        res.json({ message: 'Appointment cancelled successfully' });
      });
    });
  });
};

module.exports = { getAppointments, createAppointment, cancelAppointment };