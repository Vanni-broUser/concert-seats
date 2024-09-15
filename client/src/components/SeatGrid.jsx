import SeatRow from './SeatRow';
import Seat from './Seat';

const SeatGrid = ({ theater, selectedSeats, occupiedSeats, userReservedSeats, handleSeatClick, recentlyBookedSeats }) => {
  const getColumnLetter = (columnNumber) => String.fromCharCode(64 + columnNumber);

  const renderSeats = () => {
    const rows = [];
    for (let row = 1; row <= theater.numRow; row++) {
      const seatsInRow = [];
      for (let column = 1; column <= theater.numColumn; column++) {
        const seatId = `${row}-${getColumnLetter(column)}`;
        const isSelected = selectedSeats.includes(seatId);
        const isOccupied = occupiedSeats.includes(seatId);
        const isUserReserved = userReservedSeats.includes(seatId);
        const isRecentlyBooked = recentlyBookedSeats.includes(seatId);

        const seatClass = isRecentlyBooked
          ? 'recently-booked'
          : isUserReserved
          ? 'occupied'
          : isOccupied
          ? 'occupied'
          : isSelected
          ? 'selected'
          : 'available';

        seatsInRow.push(
          <Seat
            key={seatId}
            seatId={seatId}
            seatClass={seatClass}
            onClick={() => handleSeatClick(row, column)}
          />
        );
      }
      rows.push(<SeatRow key={row} rowSeats={seatsInRow} />);
    }
    return rows;
  };

  return <div className="seat-grid mt-4">{renderSeats()}</div>;
};

export default SeatGrid;
