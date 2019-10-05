const router = require("express").Router();
const authCheck = require("../config/auth");
const passport = require("passport");

router.get("/", (req, res) => {
  req.logout();
  req.flash("success_msg", "You have been logged out");
  res.redirect("/");
});

module.exports = router;
