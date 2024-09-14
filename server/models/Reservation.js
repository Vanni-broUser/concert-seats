import { DataTypes } from 'sequelize';
import sequelize from '../database/config.js';
import User from './User.js';
import Show from './Show.js';

const Reservation = sequelize.define('Reservation', {
  seat: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Reservation.belongsTo(Show, {
  foreignKey: {
    allowNull: false
  },
  onDelete: 'CASCADE'
});

Reservation.belongsTo(User, {
  foreignKey: {
    allowNull: false
  },
  onDelete: 'CASCADE'
});

export default Reservation;
