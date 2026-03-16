const multer = require("multer")
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' +
      file.originalname);
  }
})
const upload = multer({storage: storage})
const { Router } = require("express");
const folder = Router()
const controller = require("../controllers/indexCont")
const folders = new controller.Folder()
const files = new controller.File()

folder.get("/:folderid", folders.openFolder)
folder.get("/:folderid/delete", folders.deleteFolder)
folder.get("/:folderid/:fileid/download", (req, res) => {
  res.send("Handle file download")
})
folder.get("/:folderid/:fileid/delete", (req, res) => {
  res.send("Handle file delete")
})

folder.post("/upload", folders.uploadFolder)


folder.post("/:folderid/upload", upload.single('uploaded_file'),
  files.uploadFile);

module.exports = folder
