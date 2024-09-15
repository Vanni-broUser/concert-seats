import { useState, useEffect } from 'react';

const ReservationDiscount = ({ userReservations, loyal }) => {
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const response = await fetch('http://localhost:9000/calculate-discount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            seats: userReservations[0].Seats.map(seat => seat.seatNumber),
            user_type: loyal ? 'loyal' : 'not_loyal',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setDiscount(data.discount);
        } else {
          console.error('Request error');
        }
      } catch (error) {
        console.error('Request error', error);
      }
    };

    fetchDiscount();
  }, [userReservations, loyal]);

  return (
    <div>
      <h2>Discount Valure</h2>
      {discount !== null ? (
        <p>The discount applied is: {discount}%</p>
      ) : (
        <p>Calculating discount</p>
      )}
    </div>
  );
};

export default ReservationDiscount;
