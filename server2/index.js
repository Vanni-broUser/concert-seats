import cors from 'cors';
import express from 'express';

const PORT = 9000;
const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Server 2 is ready');
});

app.post('/calculate-discount', (req, res) => {
  const { seats, user_type } = req.body;

  if (!Array.isArray(seats) || seats.length === 0)
    return res.status(400).json({ error: 'Invalid seats data' });

  if (typeof user_type !== 'string')
    return res.status(400).json({ error: 'Invalid user_type data' });

  const intSeats = seats.map(seat => parseInt(seat.split('-')[0]))
  const sumSeats = intSeats.reduce((acc, val) => acc + val, 0);
  let discount = sumSeats;
  if (user_type !== 'loyal') 
    discount = sumSeats / 3;
  discount += Math.floor(Math.random() * 16) + 5;
  if (discount < 5)
    discount = 5;
  else if (discount > 50)
    discount = 50;

  res.json({ discount });
});
