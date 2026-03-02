const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ===== VALIDACIONES =====
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return password && password.length >= 6;
}

function isValidName(name) {
  return name && name.trim().length >= 2;
}

const register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });
  if (!isValidName(name))
    return res.status(400).json({ message: 'Name must be at least 2 characters' });
  if (!isValidEmail(email))
    return res.status(400).json({ message: 'Invalid email format' });
  if (!isValidPassword(password))
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  const checkUser = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUser, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const insertUser = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(insertUser, [name, email, hashedPassword], (err) => {
      if (err) return res.status(500).json({ message: 'Error creating user' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'All fields are required' });
  if (!isValidEmail(email))
    return res.status(400).json({ message: 'Invalid email format' });

  const findUser = 'SELECT * FROM users WHERE email = ?';
  db.query(findUser, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
};

module.exports = { register, login };