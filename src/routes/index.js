const passport = require("passport")
const { Router } = require("express")
const auth = require("../configs/auth")
const index = Router();

const Folder = require('../controllers/Folder.js')
const User = require('../controllers/User.js')
const File = require("../controllers/File.js")

index.get("/", auth.isAuth, Folder.getFolders)

index.get("/login", (req, res) => {
  res.render("login");
})

index.get("/sign-up", (req, res) => {
  res.render("register")
})

index.post("/login", passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login"
}))
index.post("/sign-up", User.handleRegistration)
index.post("/:fileid/download", File.downloadFile)
index.post("/:fileid/delete", File.deleteFile)

module.exports = index;
