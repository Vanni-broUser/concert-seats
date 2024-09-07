import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Reservation = sequelize.define('Reservation', {
  theaterName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  seatNumber: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Reservation;
