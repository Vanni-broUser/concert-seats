import bcrypt from 'bcryptjs';
import { DataTypes } from 'sequelize';
import sequelize from '../database/config.js';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  loyal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.prototype.isValidPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

export default User;
