import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Reservation.css';

const Reservation = () => {
  const { showId } = useParams();
  const [theater, setTheater] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTheaterInfo();
  }, [showId]);

  const handleSeatClick = (row, column) => {
    const seat = `${row}-${column}`;
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seat)
        ? prevSelected.filter((s) => s !== seat)
        : [...prevSelected, seat]
    );
  };

  const renderSeats = () => {
    const rows = [];
    for (let row = 1; row <= theater.numRow; row++) {
      const seatsInRow = [];
      for (let column = 1; column <= theater.numColumn; column++) {
        const seatId = `${row}-${column}`;
        const isSelected = selectedSeats.includes(seatId);
        seatsInRow.push(
          <div
            key={seatId}
            className={`seat ${isSelected ? 'selected' : ''}`}
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
        </>
      ) : (
        <div className="text-center">Nessun dato disponibile per questo spettacolo.</div>
      )}
    </div>
  );
};

export default Reservation;
