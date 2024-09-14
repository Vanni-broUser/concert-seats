import sequelize from '../database/config.js';
import User from './User.js';
import Seat from './Seat.js';
import Show from './Show.js';

const Reservation = sequelize.define('Reservation', {});

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

Reservation.hasMany(Seat, {
  foreignKey: {
    allowNull: false
  },
  onDelete: 'CASCADE'
});

Seat.belongsTo(Reservation, {
  foreignKey: {
    allowNull: false
  },
  onDelete: 'CASCADE'
});

export default Reservation;
