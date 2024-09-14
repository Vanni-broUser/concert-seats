import React from 'react';

const SeatRow = ({ rowSeats }) => (
  <div className="seat-row d-flex justify-content-center">
    {rowSeats && Array.isArray(rowSeats) ? rowSeats.map((seat, index) => (
      <React.Fragment key={index}>
        {seat}
      </React.Fragment>
    )) : null}
  </div>
);

export default SeatRow;
