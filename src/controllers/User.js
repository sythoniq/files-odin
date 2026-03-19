const bcrypt = require("bcryptjs")
const prisma = require("../configs/prisma.js")

const { body, validationResult, matchedData } = require("express-validator")

class User {
  validateUser = [
    body("username").trim()
    .notEmpty().withMessage("Username should not be empty!")
    .isLength({min: 2}).withMessage("Username must be at least 2 characters")
    .escape(),
    body("password").trim()
    .notEmpty().withMessage("Password should not be empty")
    .isLength({min: 8}).withMessage("Password should be at least 8 characters long"),
    body("confirm-password").custom((value, {req}) => {
      if (value != req.body.password) {
        throw new Error("Passwords do not match")
      }
      return true
    })
  ]

  handleRegistration = [
    this.validateUser,
    async (req, res) => {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).render("register", {
          errors: result.array()
        })
      }
      const {username, password} = matchedData(req);
      const hash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name: username,
          hash
        }
      })
      console.log(user);
      res.redirect("/login");
    }
  ]
}

module.exports = new User()