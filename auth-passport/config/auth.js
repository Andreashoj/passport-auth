const authCheck = (req, res, next) => {
  console.log(req.user);
  if (!req.user) {
    console.log("redirecting");
    req.flash("error_msg", "You need to be logged in to view that page");
    res.redirect("/");
  } else {
    next();
  }
};

module.exports = {
  authCheck
};
