import cors from 'cors';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import sequelize from './database.js';
import passportConfig from './config/passport';
import Reservation from './models/Reservation.js';

const PORT = 8000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);
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
  res.send('Ciao, mondo!');
});

app.post('/reservation', async (req, res) => {
  const { theaterName, seatNumber } = req.body;

  try {
    const newReservation = await Reservation.create({
      theaterName,
      seatNumber
    });

    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Failed to create reservation:', error);
    res.status(500).json({ error: 'An error occurred while creating the reservation' });
  }
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
  failureRedirect: '/login',
}));

app.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});
