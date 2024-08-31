import { Sequelize } from 'sequelize';
import { join } from 'path';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: join(__dirname, 'database.sqlite')
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection to SQLite has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;
