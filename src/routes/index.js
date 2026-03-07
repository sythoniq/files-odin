const { Router } = require("express");
const index = Router();

index.get("/", (req, res) => {
  res.send("Hello, World!");
})

module.exports = index;
