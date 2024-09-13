import cors from 'cors';
import express from 'express';
import session from 'express-session';
import SequelizeStoreInit from 'connect-session-sequelize';

import passport from './passport.js';
import sequelize from './database/config.js';
import { initializeDatabase } from './database/initialize.js';

import Show from './models/Show.js';
import User from './models/User.js';
import Theater from './models/Theater.js';
import Reservation from './models/Reservation.js';


const PORT = 8000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
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
    initializeDatabase();
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

    res.status(500).json({ error: 'An error occurred while retrieving the reservations' });
  }
});

app.get('/theater', async (req, res) => {
  try {
    const theaters = await Theater.findAll();

    res.status(200).json(theaters);
  } catch (error) {

    res.status(500).json({ error: 'An error occurred while retrieving the reservations' });
  }
});

app.get('/theater/:theaterId/shows', async (req, res) => {
  const { theaterId } = req.params;

  try {
    const shows = await Show.findAll({
      where: { theaterId: theaterId }
    });

    if (shows.length === 0) {
      return res.status(404).json({ message: 'No shows found for this theater' });
    }

    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the shows' });
  }
});

app.post('/login', passport.authenticate('local', {
  successRedirect: 'http://localhost:3000/dashboard',
  failureRedirect: 'http://localhost:3000/login'
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
