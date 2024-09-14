import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Reservation.css';

const Reservation = () => {
  const { showId } = useParams();
  const userId = 1; // Definiamo la costante userId = 1 per l'utente corrente
  const [theater, setTheater] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [userReservedSeats, setUserReservedSeats] = useState([]); // Stato per i posti riservati dall'utente
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [numberOfSeats, setNumberOfSeats] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    const fetchTheaterInfo = async () => {
      setLoading(true);
      try {
        // Recupera le informazioni dello spettacolo e del teatro
        const response = await fetch(`http://localhost:8000/shows/${showId}`);
        if (!response.ok) throw new Error('Error fetching show information');
        
        const data = await response.json();
        if (data && data.Theater) {
          setTheater(data.Theater);
          setShow(data.Show);
        } else {
          setError('No data available for this show');
        }

        // Recupera i posti occupati
        const reservationResponse = await fetch(`http://localhost:8000/reservation?showId=${showId}`);
        if (!reservationResponse.ok) throw new Error('Error fetching reservations');
        
        const reservations = await reservationResponse.json();
        setOccupiedSeats(reservations.map(res => res.seat));

        // Recupera le prenotazioni dell'utente 1
        const userReservations = reservations.filter(res => res.UserId === userId);
        setUserReservedSeats(userReservations.map(res => res.seat)); // Salva i posti riservati dall'utente
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTheaterInfo();
  }, [showId, userId]);

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

  const handleNumberOfSeatsChange = (event) => {
    setNumberOfSeats(event.target.value);
    setInputError('');
  };

  const handleNumberOfSeatsSubmit = async () => {
    if (!theater || !numberOfSeats) return;

    const numSeats = parseInt(numberOfSeats, 10);
    if (isNaN(numSeats) || numSeats <= 0) {
      setInputError('Please enter a valid number of seats.');
      return;
    }

    const availableSeats = [];
    for (let row = 1; row <= theater.numRow; row++) {
      for (let column = 1; column <= theater.numColumn; column++) {
        const seatId = `${row}-${getColumnLetter(column)}`;
        if (!occupiedSeats.includes(seatId) && availableSeats.length < numSeats) {
          availableSeats.push(seatId);
        }
      }
    }

    if (availableSeats.length < numSeats) {
      setInputError('Not enough seats available.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/reservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          showId,
          seats: availableSeats,
          userId // Usiamo l'userId costante qui
        })
      });

      if (!response.ok) throw new Error('Error making reservation');
      
      alert('Reservation successful!');
      setNumberOfSeats('');
      window.location.reload();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleConfirmReservation = async () => {
    if (selectedSeats.length === 0) {
      setInputError('Please select seats before confirming.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/reservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          showId,
          seats: selectedSeats,
          userId // Usiamo l'userId costante qui
        })
      });

      if (!response.ok) throw new Error('Error making reservation');
      
      alert('Reservation successful!');
      setSelectedSeats([]);
      setNumberOfSeats('');
      window.location.reload();
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
        const isUserReserved = userReservedSeats.includes(seatId); // Controlla se il posto è riservato dall'utente
        const seatClass = isUserReserved
          ? 'occupied'
          : isOccupied
          ? 'occupied'
          : isSelected
          ? 'selected'
          : 'available';
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

  const totalSeats = theater ? theater.numRow * theater.numColumn : 0;
  const occupiedSeatsCount = occupiedSeats.length;
  const selectedSeatsCount = selectedSeats.length;
  const availableSeatsCount = totalSeats - occupiedSeatsCount;

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1>{show ? show.title : 'Show Details'}</h1>
      <div className="mt-3 mb-4">
        <p><strong>Available Seats:</strong> {availableSeatsCount} | &nbsp;
        <strong>Occupied Seats:</strong> {occupiedSeatsCount} | &nbsp;
        <strong>Selected Seats:</strong> {selectedSeatsCount} | &nbsp;
        <strong>Total Seats:</strong> {totalSeats}</p>
        <p><strong>Your Reserved Seats:</strong> {userReservedSeats.join(', ') || 'None'}</p> {/* Mostra i posti riservati dall'utente */}
      </div>
      {theater ? (
        <>
          <div className="seat-grid mt-4">
            {renderSeats()}
          </div>
          <div className="mt-4">
            <button className="btn btn-success" onClick={handleConfirmReservation}>
              Confirm Reservation
            </button>
            <div className="mb-3">
              <label className="form-check-label me-2">Number of seats to book:</label>
              <input
                type="number"
                value={numberOfSeats}
                onChange={handleNumberOfSeatsChange}
                placeholder="Number of seats"
                min="1"
              />
              <button
                className="btn btn-primary ms-2"
                onClick={handleNumberOfSeatsSubmit}
              >
                Auto Book
              </button>
            </div>
            {inputError && <div className="alert alert-danger mt-2">{inputError}</div>}
          </div>
        </>
      ) : (
        <div className="text-center">No data available for this show.</div>
      )}
    </div>
  );
};

export default Reservation;
