require('dotenv').config();
const path = require("node:path")
const passport = require("passport")
const prisma = require("./configs/prisma")
const session = require("express-session")
const { PrismaSessionStore } = require("@quixo3/prisma-session-store")
const express = require("express");
const app = express()


const PORT = 3000;

app.use(express.urlencoded({extended: true}))

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7
    },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      prisma, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
)

require("./configs/passport")

app.use(passport.session())

const auth = require("./configs/auth.js")
const index = require("./routes/index.js")
const folder = require("./routes/folder.js")

app.use("/", index);
app.use("/folder", auth.isAuth, folder);

app.listen(`${PORT}`, (error) => {
  if (error) {
    throw(error)
  }
  console.log(`Server running on ${PORT}`)
})
