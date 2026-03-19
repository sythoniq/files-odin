const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const { Router } = require("express");
const folder = Router()

const Folder = require('../controllers/Folder')
const File = require('../controllers/File')

folder.get("/:folderid", Folder.openFolder)
folder.get("/:folderid/delete", Folder.deleteFolder)
folder.get("/:folderid/:fileid/download", (req, res) => {
  res.send("Handle file download")
})
folder.get("/:folderid/:fileid/delete", (req, res) => {
  res.send("Handle file delete")
})

folder.post("/upload", Folder.uploadFolder)

folder.post("/:folderid/upload", upload.single('uploaded_file'),
  File.uploadFile);

folder.post("/:folderid/file/:fileid/delete", File.deleteFile)
folder.post("/:folderid/file/:fileid/download", File.downloadFile)

module.exports = folder
