import cors from 'cors';
import express from 'express';

import sequelize from '../database/config.js';
import Reservation from '../database/models/Reservation.js';


const PORT = 9000;
const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => console.error('Unable to create table:', err));

app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Server 2 is ready');
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
