const { Router } = require("express");
const auth = require("../configs/auth")
const passport  = require("passport")
const index = Router();
const controller = require("../controllers/indexCont");

index.get("/", auth.isAuth, controller.home);
index.get("/sign-up", (req, res) => res.render("sign-up"));
index.get("/login", (req, res) => res.render("login"))
index.get("/:folderid" , controller.loadFolder);

index.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      throw(err);
    }
    res.redirect('/')
  })
})


index.post("/sign-up", controller.register)
index.post("/login", passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login"
}))
module.exports = index;
