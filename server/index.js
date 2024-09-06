import cors from 'cors';
import express from 'express';
import session from 'express-session';
import SequelizeStoreInit from 'connect-session-sequelize';

import passport from './passport.js';
import User from '../database/models/User.js';
import sequelize from '../database/database.js';
import Reservation from '../database/models/Reservation.js';


const PORT = 8000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));

const SequelizeStore = SequelizeStoreInit(session.Store);
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize
  })
}));

app.use(passport.initialize());
app.use(passport.session());

sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => console.error('Unable to create table:', err));

app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Server is ready');
});

app.get('/reservation', async (req, res) => {
  try {
    const reservations = await Reservation.findAll();

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Failed to retrieve reservations:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the reservations' });
  }
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));

app.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err)
      return next(err);
    res.redirect('/');
  });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser)
      return res.status(400).json({ error: 'User already exists' });
    const newUser = await User.create({ username, password });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Failed to register user:', error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
});
