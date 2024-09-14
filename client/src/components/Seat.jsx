import React from 'react';

const Seat = ({ seatId, seatClass, onClick }) => (
  <div className={`seat ${seatClass}`} onClick={onClick}>
    {seatId}
  </div>
);

export default Seat;
