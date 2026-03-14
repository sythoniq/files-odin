const passport = require("passport")
const { Router } = require("express")
const auth = require("../configs/auth")
const controller = require("../controllers/indexCont.js")
const index = Router();
const folders = new controller.Folder();
const users = new controller.User();

index.get("/", auth.isAuth, folders.getFolders)

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
index.post("/sign-up", users.handleRegistration)

module.exports = index;
