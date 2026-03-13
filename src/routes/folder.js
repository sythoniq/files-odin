const { Router } = require("express");
const folder = Router()

folder.get("/:folderid", (req, res) => {
  res.send("Open folder")
})
folder.get("/:folderid/delete", (req, res) => {
  res.send("Handle folder delete")
})
folder.get("/:folderid/upload", (req, res) => {
  res.send("Handle file upload")
})
folder.get("/:folderid/:fileid/download", (req, res) => {
  res.send("Handle file download")
})
folder.get("/:folderid/:fileid/delete", (req, res) => {
  res.send("Handle file delete")
})

module.exports = folder
