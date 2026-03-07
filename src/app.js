const passport = require("passport");
const express = require("express");
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');

const prisma = require("./configs/prisma.js");

const app = express();

app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

require('./configs/passport')
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.currentSession = req.session;
  res.locals.currentUser = req.user;
  next();
});

const index = require("./routes/index")

app.use("/", index);

app.listen(3000, (error) => {
  if (error) return error;
  
  console.log("Server running on 3000");
})
