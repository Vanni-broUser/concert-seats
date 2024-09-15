import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import ReservationInfo from '../components/ReservationInfo';
import SeatGrid from '../components/SeatGrid';
import ReservationDiscount from '../components/ReservationDiscount';
import Login from './Login';
import '../styles/Reservation.css';

const socket = io('http://localhost:8000');

const Reservation = () => {
  const { showId } = useParams();
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [reservationId, setReservationId] = useState(null);
  const [theater, setTheater] = useState(null);
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [userReservedSeats, setUserReservedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [numberOfSeats, setNumberOfSeats] = useState('');
  const [inputError, setInputError] = useState('');
  const [showSecondComponent, setShowSecondComponent] = useState(false);
  const [userReservations, setUserReservations] = useState([]);
  const [recentlyBookedSeats, setRecentlyBookedSeats] = useState([]);

  useEffect(() => {
    if (!userId) return;

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

        const filteredReservations = reservations.filter(res => res.UserId === parseInt(userId));
        setUserReservations(filteredReservations);
        setReservationId(filteredReservations[0] ? filteredReservations[0].id : null);
        setUserReservedSeats(filteredReservations.map(res => res.Seats.map(seat => seat.seatNumber)).flat());

        if (filteredReservations.length > 0) setShowSecondComponent(true);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTheaterInfo();

    socket.on('updateSeats', ({ showId: updatedShowId, seats }) => {
      if (updatedShowId === showId) {
        setOccupiedSeats(prevOccupiedSeats => [...new Set([...prevOccupiedSeats, ...seats])]);

        setRecentlyBookedSeats(seats);

        setTimeout(() => {
          setRecentlyBookedSeats([]);
        }, 5000);
      }
    });

    return () => {
      socket.off('updateSeats');
    };
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
      const response = await fetch(`http://localhost:8000/reservation/${reservationId}`, {
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

  if (!userId) {
    return <Login setUserId={setUserId} />;
  }

  if (loading) return <div className="text-center">Loading...</div>;

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
            recentlyBookedSeats={recentlyBookedSeats}  // Passa i posti recentemente prenotati
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
            {showSecondComponent && <ReservationDiscount userReservations={userReservations} loyal={true} />}
            {inputError && <div className="alert alert-danger mt-2">{inputError}</div>}
          </div>
        </>
      )}
      {error && <div className="alert alert-danger mt-5">{error}</div>}
    </div>
  );
};

export default Reservation;
