const router = require("express").Router();
const authCheck = require("../config/auth").authCheck;

router.get("/", authCheck, (req, res) => {
  const { name, email } = req.user;
  res.render("index", { name, email });
});

module.exports = router;
