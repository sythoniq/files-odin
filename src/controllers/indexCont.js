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

module.exports = {
  register,
}
