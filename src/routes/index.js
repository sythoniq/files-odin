const passport = require("passport")
const { Router } = require("express")
const auth = require("../configs/auth")
const controller = require("../controllers/indexCont.js")
const index = Router();

index.get("/", auth.isAuth, (req, res) => {
  res.send("Hello");
})

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
index.post("/sign-up", controller.handleRegistration)

module.exports = index;
