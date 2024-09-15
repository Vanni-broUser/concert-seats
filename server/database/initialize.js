import Show from '../models/Show.js';
import Theater from '../models/Theater.js';
import User from '../models/User.js';
import Reservation from '../models/Reservation.js';
import Seat from '../models/Seat.js';

export async function initializeDatabase() {
  try {
    const theaterCount = await Theater.count();
    if (theaterCount === 0) {
      const theaters = await Theater.bulkCreate([
        { name: 'Grand Theater', location: 'New York', numColumn: 8, numRow: 4 },
        { name: 'Majestic Cinema', location: 'Los Angeles', numColumn: 10, numRow: 6 },
        { name: 'Opera House', location: 'San Francisco', numColumn: 14, numRow: 9 }
      ]);

      const shows = await Show.bulkCreate([
        { title: 'Rock Fest 2024', time: new Date('2024-09-15 20:00:00'), TheaterId: theaters[0].id },
        { title: 'Jazz Night', time: new Date('2024-09-20 19:30:00'), TheaterId: theaters[0].id },
        { title: 'Classical Music Gala', time: new Date('2024-10-01 18:00:00'), TheaterId: theaters[1].id },
        { title: 'Pop Extravaganza', time: new Date('2024-10-10 21:00:00'), TheaterId: theaters[1].id },
        { title: 'Indie Vibes', time: new Date('2024-11-05 20:00:00'), TheaterId: theaters[2].id },
        { title: 'Electronic Beats', time: new Date('2024-11-15 22:00:00'), TheaterId: theaters[2].id }
      ]);

      const users = await User.bulkCreate([
        { username: 'john_doe', password: '$2a$10$Qtdw1tToJAW1Z4Lt9bRV0.m4HLIWuGsNgrvNkDyPpFyHSFmKykzNO', loyal: true }, //password123
        { username: 'jane_doe', password: '$2a$10$Qtdw1tToJAW1Z4Lt9bRV0.m4HLIWuGsNgrvNkDyPpFyHSFmKykzNO', loyal: true },
        { username: 'alice_wonder', password: '$2a$10$Qtdw1tToJAW1Z4Lt9bRV0.m4HLIWuGsNgrvNkDyPpFyHSFmKykzNO', loyal: true },
        { username: 'bob_builder', password: '$2a$10$Qtdw1tToJAW1Z4Lt9bRV0.m4HLIWuGsNgrvNkDyPpFyHSFmKykzNO', loyal: false }
      ]);

      const reservations = await Reservation.bulkCreate([
        { ShowId: shows[0].id, UserId: users[0].id, discount: 10 },
        { ShowId: shows[2].id, UserId: users[1].id, discount: 15 }
      ]);

      await Seat.bulkCreate([
        { seatNumber: '1-A', ReservationId: reservations[0].id },
        { seatNumber: '1-B', ReservationId: reservations[0].id },
        { seatNumber: '2-C', ReservationId: reservations[1].id },
        { seatNumber: '2-D', ReservationId: reservations[1].id }
      ]);

      console.log('Theaters, shows, users, reservations, and seats successfully created!');
    } else {
      console.log('The data already exists. No need to create theaters, shows, users, or reservations.');
    }
  } catch (error) {
    console.error('An error occurred during the database initialization:', error);
  }
}
