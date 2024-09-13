import Show from '../models/Show.js';
import Theater from '../models/Theater.js';

export async function initializeDatabase() {
  try {
    const theaterCount = await Theater.count();
    if (theaterCount === 0) {
      const theaters = await Theater.bulkCreate([
        { name: 'Grand Theater', location: 'New York', numColumn: 8, numRow: 4 },
        { name: 'Majestic Cinema', location: 'Los Angeles', numColumn: 10, numRow: 6 },
        { name: 'Opera House', location: 'San Francisco', numColumn: 14, numRow: 9 }
      ]);

      await Show.bulkCreate([
        { title: 'Rock Fest 2024', time: new Date('2024-09-15 20:00:00'), TheaterId: theaters[0].id },
        { title: 'Jazz Night', time: new Date('2024-09-20 19:30:00'), TheaterId: theaters[0].id },
        { title: 'Classical Music Gala', time: new Date('2024-10-01 18:00:00'), TheaterId: theaters[1].id },
        { title: 'Pop Extravaganza', time: new Date('2024-10-10 21:00:00'), TheaterId: theaters[1].id },
        { title: 'Indie Vibes', time: new Date('2024-11-05 20:00:00'), TheaterId: theaters[2].id },
        { title: 'Electronic Beats', time: new Date('2024-11-15 22:00:00'), TheaterId: theaters[2].id }
      ]);

      console.log('Teatri e spettacoli creati con successo!');
    } else {
      console.log('I dati esistono già. Nessuna necessità di creare teatri e spettacoli.');
    }
  } catch (error) {
    console.error('Errore durante l\'inizializzazione del database:', error);
  }
};
