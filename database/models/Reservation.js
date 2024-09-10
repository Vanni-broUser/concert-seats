import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
import Theater from './Theater.js';
import Show from './Show.js';

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

Reservation.belongsTo(Theater, {
  foreignKey: {
    allowNull: false
  },
  onDelete: 'CASCADE'
});

Reservation.belongsTo(Show, {
  foreignKey: {
    allowNull: false
  },
  onDelete: 'CASCADE'
});

export default Reservation;
