import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h4 className="mb-0">Prenotazione Posto Teatro</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="seatNumber">Numero del posto:</label>
                  <input
                    type="number"
                    id="seatNumber"
                    className="form-control"
                    value={seatNumber}
                    onChange={(e) => setSeatNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="theaterName">Nome del teatro:</label>
                  <input
                    type="text"
                    id="theaterName"
                    className="form-control"
                    value={theaterName}
                    onChange={(e) => setTheaterName(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Prenota</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrenotazionePostoTeatro;
