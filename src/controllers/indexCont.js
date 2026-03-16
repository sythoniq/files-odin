const bcrypt = require("bcryptjs")
const prisma = require("../configs/prisma.js")

const { body, validationResult, matchedData } = require("express-validator")

function formatDate(dateToFormat) {
  const string = dateToFormat.toString()
  const [_, month, date, year, time] = string.split(" ")
  const [hour, min] = time.split(":")
  return `${date}/${month}/${year}, ${hour}:${min}`
}

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
      where: {folderId: id}
    })
    res.render("folder", {folder, files, formatDate})
  }

  async deleteFolder(req, res, next) {
    const id = Number(req.params.folderid); 
    await prisma.file.deleteMany({
      where: {
        folderId: id
      }
    })
    await prisma.folder.delete({
      where: {id}
    })
    res.redirect("/");
  }
}

class File {
  async uploadFile(req, res, next) {
    const {originalname, path, size} = req.file
    await prisma.file.create({
      data: {
        name: originalname,
        url: path,
        size: size,
        uploaderId: Number(req.user.id),
        folderId: Number(req.params.folderid)
      }
    })
    res.redirect(`/folder/${req.params.folderid}`)
  }

  async downloadFile(req, res, next) {
    const file = await prisma.file.findUnique({
      where: {
        id: Number(req.params.fileid)
      }
    })
    const path = file.url;
    res.download(path);
  }

  async deleteFile(req, res, next) {
    await prisma.file.delete({
      where: {
        id: Number(req.params.fileid)
      }
    }) 
    res.redirect("/");
  }
}

module.exports = {
  User,
  Folder,
  File
}
