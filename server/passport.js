import { Strategy as LocalStrategy } from 'passport-local';
import { User } from './models/User';

export default (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { username } });
        if (!user)
          return done(null, false, { message: 'Incorrect username.' });
        const isMatch = await user.isValidPassword(password);
        if (!isMatch)
          return done(null, false, { message: 'Incorrect password.' });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
