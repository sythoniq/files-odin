const prisma = require("../configs/prisma.js")
const bcrypt = require("bcryptjs");
const { body, validationResult, matchedData } = require("express-validator");

const validateUserRegister = [
  body("email").trim()
    .isEmail().withMessage("Enter a valid email address"),
  body("username").trim()
    .isLength({min: 1, max: 25}).withMessage("Message should be between 1-25"),
  body("password").trim()
    .isLength({min: 8, max: 30}).withMessage("Password should be between 8-30")
]

const register = [
  validateUserRegister,
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).render("sign-up", {
        errors: result.array()
      })
    }

    const { email, username, password } = matchedData(req);
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email: email,
        name: username,
        hash: hash
      }
    })
    res.redirect("/login");
  }
]

async function home(req, res, next) {
  const folders = await prisma.folders.findMany({});
  res.render("home", {
    folders:  folders, // Array of objects with name and ID
  });
  next();
}

async function loadFolder(req, res, next) {
  const id = Number(req.params.folderid)
  const folders = await prisma.folders.findMany({})
  const folder = await prisma.folders.findUnique({
    where: {id}
  })
  res.render("folder", {
    folder,
    folders
  }); 
  next();
}

module.exports = {
  register,
  home,
  loadFolder
}
