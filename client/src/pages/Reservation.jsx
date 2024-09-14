import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReservationInfo from '../components/ReservationInfo';
import SeatGrid from '../components/SeatGrid';
import '../styles/Reservation.css';

const Reservation = () => {
  const { showId } = useParams();
  const userId = 4;
  const [theater, setTheater] = useState(null);
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [userReservedSeats, setUserReservedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [numberOfSeats, setNumberOfSeats] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    const fetchTheaterInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/shows/${showId}`);
        if (!response.ok) throw new Error('Error fetching show information');

        const data = await response.json();
        if (data && data.Theater) {
          setTheater(data.Theater);
          setShow(data.Show);
        } else {
          setError('No data available for this show');
        }

        const reservationResponse = await fetch(`http://localhost:8000/reservation?showId=${showId}`);
        if (!reservationResponse.ok) throw new Error('Error fetching reservations');

        const reservations = await reservationResponse.json();
        setOccupiedSeats(reservations.map(res => res.Seats.map(seat => seat.seatNumber)).flat());

        const userReservations = reservations.filter(res => res.UserId === userId);
        setUserReservedSeats(userReservations.map(res => res.Seats.map(seat => seat.seatNumber)).flat());
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTheaterInfo();
  }, [showId, userId]);

  const handleSeatClick = (row, column) => {
    const seat = `${row}-${String.fromCharCode(64 + column)}`;
    if (occupiedSeats.includes(seat)) return;

    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seat)
        ? prevSelected.filter((s) => s !== seat)
        : [...prevSelected, seat]
    );
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
          userId
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
        const seatId = `${row}-${String.fromCharCode(64 + column)}`;
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
          userId
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

  const handleDeleteReservation = async () => {
    try {
      const response = await fetch(`http://localhost:8000/reservation/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error deleting reservation');

      alert('Reservation cancelled!');
      setUserReservedSeats([]);
      window.location.reload();
    } catch (error) {
      setError(error.message);
    }
  };

  const totalSeats = theater ? theater.numRow * theater.numColumn : 0;
  const occupiedSeatsCount = occupiedSeats.length;
  const selectedSeatsCount = selectedSeats.length;
  const availableSeatsCount = totalSeats - occupiedSeatsCount;

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <ReservationInfo
        show={show}
        availableSeatsCount={availableSeatsCount}
        occupiedSeatsCount={occupiedSeatsCount}
        selectedSeatsCount={selectedSeatsCount}
        totalSeats={totalSeats}
        userReservedSeats={userReservedSeats}
        onDeleteReservation={handleDeleteReservation}
      />
      {theater && (
        <>
          <SeatGrid
            theater={theater}
            selectedSeats={selectedSeats}
            occupiedSeats={occupiedSeats}
            userReservedSeats={userReservedSeats}
            handleSeatClick={handleSeatClick}
          />
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
      )}
    </div>
  );
};

export default Reservation;
