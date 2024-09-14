import React from 'react';

const ReservationInfo = ({ show, availableSeatsCount, occupiedSeatsCount, selectedSeatsCount, totalSeats, userReservedSeats }) => (
  <div className="mt-3 mb-4">
    <h1>{show ? show.title : 'Show Details'}</h1>
    <p>
      <strong>Available Seats:</strong> {availableSeatsCount} | &nbsp;
      <strong>Occupied Seats:</strong> {occupiedSeatsCount} | &nbsp;
      <strong>Selected Seats:</strong> {selectedSeatsCount} | &nbsp;
      <strong>Total Seats:</strong> {totalSeats}
    </p>
    <p><strong>Your Reserved Seats:</strong> {userReservedSeats.join(', ') || 'None'}</p>
  </div>
);

export default ReservationInfo;
