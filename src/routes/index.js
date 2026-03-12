const { Router } = require("express");
const auth = require("../configs/auth")
const passport  = require("passport")
const index = Router();
const controller = require("../controllers/indexCont");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
})
const upload = multer({storage})

index.get("/", auth.isAuth, controller.home);
index.get("/sign-up", (req, res) => res.render("sign-up"));
index.get("/login", (req, res) => res.render("login"))
index.get("/:folderid" , auth.isAuth, controller.loadFolder);
index.get("/:folderid/delete", controller.deleteFolder)

index.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      throw(err);
    }
    res.redirect('/')
  })
})

index.post("/:folderid/upload", upload.single("uploadedfile"), (req, res, next) => {
  console.log(req.file);
  res.redirect(`/${req.params.folderid}`);
})

index.post("/sign-up", controller.register)
index.post("/login", passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login"
}))
module.exports = index;
