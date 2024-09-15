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
          console.error('Errore nella richiesta');
        }
      } catch (error) {
        console.error('Errore nella richiesta', error);
      }
    };

    fetchDiscount();
  }, [userReservations, loyal]);

  return (
    <div>
      <h2>Valore dello sconto</h2>
      {discount !== null ? (
        <p>Lo sconto applicato è: {discount}%</p>
      ) : (
        <p>Calcolo dello sconto in corso...</p>
      )}
    </div>
  );
};

export default ReservationDiscount;
