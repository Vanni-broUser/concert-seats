import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Reservation.css';

const Reservation = () => {
  const { showId } = useParams();
  const [theater, setTheater] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputSeat, setInputSeat] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    const fetchTheaterInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/shows/${showId}`);
        if (!response.ok) throw new Error('Errore nel recupero delle informazioni del teatro');
        
        const data = await response.json();
        if (data && data.Theater) {
          setTheater(data.Theater);
        } else {
          setError('Nessun dato disponibile per questo spettacolo');
        }

        const reservationResponse = await fetch(`http://localhost:8000/reservation?showId=${showId}`);
        if (!reservationResponse.ok) throw new Error('Errore nel recupero delle prenotazioni');
        
        const reservations = await reservationResponse.json();
        setOccupiedSeats(reservations.map(res => res.seat));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTheaterInfo();
  }, [showId]);

  const getColumnLetter = (columnNumber) => {
    return String.fromCharCode(64 + columnNumber);
  };

  const handleSeatClick = (row, column) => {
    const seat = `${row}-${getColumnLetter(column)}`;
    if (occupiedSeats.includes(seat)) return;

    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seat)
        ? prevSelected.filter((s) => s !== seat)
        : [...prevSelected, seat]
    );
  };

  const handleInputChange = (event) => {
    setInputSeat(event.target.value.toUpperCase());
    setInputError('');
  };

  const handleInputSubmit = () => {
    if (!theater || !inputSeat) return;

    const seatRegex = /^(\d+)-([A-Z])$/;
    const match = inputSeat.match(seatRegex);

    if (!match) {
      setInputError('Formato non valido. Usa il formato "Riga-Colonna" (es. 1-A).');
      return;
    }

    const [, row, columnLetter] = match;
    const column = columnLetter.charCodeAt(0) - 64;
    
    if (row <= 0 || column <= 0 || row > theater.numRow || column > theater.numColumn) {
      setInputError('Posto non valido. Controlla i numeri di riga e colonna.');
      return;
    }

    const seat = `${row}-${columnLetter}`;
    if (!occupiedSeats.includes(seat)) {
      setSelectedSeats((prevSelected) =>
        prevSelected.includes(seat)
          ? prevSelected.filter((s) => s !== seat)
          : [...prevSelected, seat]
      );
    }

    setInputSeat('');
  };

  const handleReservation = async () => {
    try {
      const response = await fetch(`http://localhost:8000/reservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          showId,
          seats: selectedSeats
        })
      });

      if (!response.ok) throw new Error('Errore nella prenotazione dei posti');
      
      alert('Prenotazione effettuata con successo!');
      setSelectedSeats([]);
    } catch (error) {
      setError(error.message);
    }
  };

  const renderSeats = () => {
    const rows = [];
    for (let row = 1; row <= theater.numRow; row++) {
      const seatsInRow = [];
      for (let column = 1; column <= theater.numColumn; column++) {
        const seatId = `${row}-${getColumnLetter(column)}`;
        const isSelected = selectedSeats.includes(seatId);
        const isOccupied = occupiedSeats.includes(seatId);
        const seatClass = isOccupied ? 'occupied' : isSelected ? 'selected' : 'available';
        seatsInRow.push(
          <div
            key={seatId}
            className={`seat ${seatClass}`}
            onClick={() => handleSeatClick(row, column)}
          >
            {seatId}
          </div>
        );
      }
      rows.push(
        <div key={row} className="seat-row d-flex justify-content-center">
          {seatsInRow}
        </div>
      );
    }
    return rows;
  };

  if (loading) {
    return <div className="text-center">Caricamento...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1>Seleziona i posti</h1>
      {theater ? (
        <>
          <div className="seat-grid mt-4">
            {renderSeats()}
          </div>
          <div className="mt-4">
            <h5>Posti selezionati:</h5>
            {selectedSeats.length > 0 ? (
              <p>{selectedSeats.join(', ')}</p>
            ) : (
              <p>Nessun posto selezionato</p>
            )}
          </div>
          <div className="mt-4">
            <input
              type="text"
              value={inputSeat}
              onChange={handleInputChange}
              placeholder="Inserisci il posto (es. 1-A)"
            />
            <button onClick={handleInputSubmit}>Seleziona</button>
            {inputError && <div className="alert alert-danger mt-2">{inputError}</div>}
          </div>
          <div className="mt-4">
            <button onClick={handleReservation} disabled={selectedSeats.length === 0}>
              Conferma Prenotazione
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">Nessun dato disponibile per questo spettacolo.</div>
      )}
    </div>
  );
};

export default Reservation;
