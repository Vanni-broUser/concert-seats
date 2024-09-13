import { DataTypes } from 'sequelize';
import sequelize from '../database/config.js';

const Theater = sequelize.define('Theater', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numColumn: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numRow: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default Theater;
