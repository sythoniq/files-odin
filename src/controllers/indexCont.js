async function register(req, res, next) {
  console.log(req);
  res.redirect("/sign-up")
}

module.exports = {
  register,
}
