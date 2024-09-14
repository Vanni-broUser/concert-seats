import { DataTypes } from 'sequelize';
import sequelize from '../database/config.js';

const Seat = sequelize.define('Seat', {
  seatNumber: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Seat;
