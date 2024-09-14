import { useState } from 'react';

function PrenotazionePostoTeatro() {
  const [theaterName, setTheaterName] = useState('');
  const [seatNumber, setSeatNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:9000/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theaterName: theaterName,
          seatNumber: seatNumber
        })
      });

      if (response.ok) {
        alert('Reservation made successfully!');
        setSeatNumber('');
        setTheaterName('');
      } else {
        alert('An error occurred during the reservation.');
      }
    } catch (error) {
      console.error('An error occurred during the request', error);
      alert('An error occurred during the reservation.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Seat number:
          <input
            type="number"
            value={seatNumber}
            onChange={(e) => setSeatNumber(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Theater Name:
          <input
            type="text"
            value={theaterName}
            onChange={(e) => setTheaterName(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Reserve</button>
    </form>
  );
}

export default PrenotazionePostoTeatro;
