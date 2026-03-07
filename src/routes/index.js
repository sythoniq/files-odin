const { Router } = require("express");
const auth = require("../configs/auth")
const passport  = require("passport")
const index = Router();
const controller = require("../controllers/indexCont");

index.get("/", (req, res) => res.render("landing"));
index.get("/home", auth.isAuth, (req, res) => res.render("home"));
index.get("/sign-up", (req, res) => res.render("sign-up"));
index.get("/login", (req, res) => res.render("login"))

index.post("/sign-up", controller.register)
index.post("/login", passport.authenticate('local', {
  succesRedirect: "/home",
  failureRedirect: "/login"
}))

module.exports = index;
