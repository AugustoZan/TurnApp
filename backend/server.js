const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// ===== SEGURIDAD =====
app.use(helmet());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 intentos
  message: { message: 'Too many attempts, please try again in 15 minutes' }
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// ===== MIDDLEWARES =====
app.use(cors());
app.use(express.json());
app.use(generalLimiter);

// ===== RUTAS =====
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/slots', require('./routes/slots'));

app.get('/', (req, res) => {
  res.json({ message: 'TurnApp API running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});