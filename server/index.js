import cors from 'cors';
import http from 'http';
import express from 'express';
import session from 'express-session';
import { Server as SocketIOServer } from 'socket.io';
import SequelizeStoreInit from 'connect-session-sequelize';

import passport from './passport.js';
import sequelize from './database/config.js';
import { initializeDatabase } from './database/initialize.js';

import Show from './models/Show.js';
import Seat from './models/Seat.js';
import User from './models/User.js';
import Theater from './models/Theater.js';
import Reservation from './models/Reservation.js';


const PORT = 8000;
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});
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

app.get('/', (req, res) => {
  res.send('Server is ready');
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('seatReserved', (data) => {
    console.log('Seats reserved:', data);

    socket.broadcast.emit('updateSeats', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log('listening on *:' + PORT);
});

app.get('/reservation', async (req, res) => {
  const { showId } = req.query;

  try {
    if (!showId) {
      return res.status(400).json({ error: 'showId is required' });
    }

    const reservations = await Reservation.findAll({
      where: {
        ShowId: showId
      },
      include: [{
        model: Seat,
        attributes: ['seatNumber']
      }, {
        model: Show,
        attributes: ['title', 'time']
      }]
    });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the reservations' });
  }
});

app.delete('/reservation/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    await reservation.destroy();

    res.status(200).json({ message: 'Reservation and associated seats successfully deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the reservation' });
  }
});

app.post('/reservation', async (req, res) => {
  const { showId, seats, userId } = req.body;

  try {
    const show = await Show.findByPk(showId);
    if (!show) return res.status(404).json({ error: 'Show not found' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(401).json({ error: 'User not found or unauthenticated user' });

    const existingReservation = await Reservation.findOne({
      where: {
        ShowId: showId,
        UserId: user.id
      }
    });

    if (existingReservation) {
      return res.status(400).json({ error: 'User already has a reservation for this show' });
    }

    const reservation = await Reservation.create({
      ShowId: showId,
      UserId: user.id
    });

    const seatEntries = seats.map(seatNumber => ({
      seatNumber,
      ReservationId: reservation.id
    }));

    await Seat.bulkCreate(seatEntries);

    io.emit('updateSeats', { showId, seats });

    res.status(200).json({ message: 'Reservation made successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during the reservation process' });
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

app.get('/shows/:showId', async (req, res) => {
  const { showId } = req.params;

  try {
    const show = await Show.findOne({
      where: { id: showId },
      include: {
        model: Theater,
        attributes: ['name', 'location', 'numColumn', 'numRow']
      }
    });

    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

    return res.json(show);
  } catch (error) {
    console.error('An error occurred while retrieving the shows', error);
    return res.status(500).json({ error: 'Server Error' });
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

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Login failed' });

    req.login(user, (err) => {
      if (err) return next(err);

      return res.json({ userId: user.id });
    });
  })(req, res, next);
});

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
