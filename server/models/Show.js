import { DataTypes } from 'sequelize';
import sequelize from '../database/config.js';
import Theater from './Theater.js';

const Show = sequelize.define('Show', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

Show.belongsTo(Theater, {
  foreignKey: {
    allowNull: false
  },
  onDelete: 'CASCADE'
});

export default Show;
