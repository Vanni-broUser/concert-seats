import React, { useState } from 'react';

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
        alert('Prenotazione effettuata con successo!');
        setSeatNumber('');
        setTheaterName('');
      } else {
        alert('Errore nella prenotazione.');
      }
    } catch (error) {
      console.error('Errore nella richiesta:', error);
      alert('Si è verificato un errore durante la prenotazione.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Numero del posto:
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
          Nome del teatro:
          <input
            type="text"
            value={theaterName}
            onChange={(e) => setTheaterName(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Prenota</button>
    </form>
  );
}

export default PrenotazionePostoTeatro;
