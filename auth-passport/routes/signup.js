const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/", (req, res) => {
  res.render("signup");
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const { name, email, password, password2 } = req.body;
  const rerender = req.body;
  const errors = [""];

  if (name.length == 0 || !isNaN(name)) {
    errors.push({ name: "Please enter your name" });
    delete rerender["name"];
  }

  if (email.length == 0) {
    errors.push({ email: "Please enter your email" });
    delete rerender["email"];
  }

  await User.findOne({ email: email }).then(item => {
    if (item) {
      errors.push({ email: "Email already exists" });
      delete rerender["email"];
    }
  });

  if (password.length < 6) {
    errors.push({ password: "Password should be atleast 6 characters" });
    delete rerender["password"];
    delete rerender["password2"];
  }

  if (password !== password2) {
    errors.push({ password2: "Passwords does not match" });
    delete rerender["password"];
    delete rerender["password2"];
  }

  if (errors.length > 1) {
    // Prints any errors to console

    res.render("signup", {
      rerender,
      errors
    });
  } else {
    // Hash password
    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        if (err) {
          return err;
        } else {
          // Save to database
          const user = new User({
            name: name,
            email: email,
            password: hash,
            date: Date.now()
          });
          user.save();
          console.log("User saved to Database");
          req.flash("success_msg", "You have created an account, now log in!");
          res.redirect(301, "/");
        }
      });
    });
  }
});

module.exports = router;
