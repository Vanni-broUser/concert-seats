import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Theater = sequelize.define('Theater', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Theater;
