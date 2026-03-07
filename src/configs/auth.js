function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(401).json({msg: "Unauthorized, login to access"})
  }
}

module.exports = {
  isAuth
}
