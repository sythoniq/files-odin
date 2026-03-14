const multer = require("multer")
const upload = multer({dest: "uploads/"})
const { Router } = require("express");
const folder = Router()
const controller = require("../controllers/indexCont")
const folders = new controller.Folder()

folder.get("/:folderid", folders.openFolder)
folder.get("/:folderid/delete", (req, res) => {
  res.send("Handle folder delete")
})
folder.get("/:folderid/:fileid/download", (req, res) => {
  res.send("Handle file download")
})
folder.get("/:folderid/:fileid/delete", (req, res) => {
  res.send("Handle file delete")
})

folder.post("/:folderid/upload", upload.single("fileupload"), (req, res) => {
  console.log(req.file, req.body)
})
folder.post("/upload", folders.uploadFolder)

module.exports = folder
