const bcrypt = require('bcryptjs')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const prisma = require("./prisma.js")

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    })
    console.log(user);
    const result = await bcrypt.compare(password, user.hash);

    if (!user) {
      return done(null, false, {message: "User not found"})
    } 
    if (!result) {
      return done(null, false, {message: "Invalid Password"})
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
}))

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    })

    done(null, user);
  } catch(err) {
    done(err);
  }
});
