import { DataTypes } from 'sequelize';
import { define } from './database';

const User = define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

User.sync();

export default User;
