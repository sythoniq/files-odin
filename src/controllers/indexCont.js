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


class Folder {
  validateFolder = [
    body("folder").trim()
    .notEmpty().withMessage("Folder name should not be empty")
    .isLength({min: 2}).withMessage("Folder name should be more than 2 characters")
    .escape()
  ]

  async getFolders(req, res, next) {
    const folders = await prisma.folder.findMany({});

    res.render("home", {
      folders
    });
  }

  uploadFolder = [
    this.validateFolder,
    async (req, res, next) => {
      const folders = await prisma.folder.findMany({});
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).render("home", {
          errors: result.array(),
          folders
        })
      }
      const { folder } = matchedData(req);
      await prisma.folder.create({
        data: {
          name: folder,
          ownerId: req.user.id
        }
      })
      res.redirect("/")
    }
  ]

  async openFolder(req, res, next) {
    const id = Number(req.params.folderid)
    const folder = await prisma.folder.findUnique({
      where: {id}
    })
    const files = await prisma.file.findMany({
      where: {
        folderId: id
      }
    })
    res.render("folder", {folder, files})
  }
}

module.exports = {
  User,
  Folder
}
