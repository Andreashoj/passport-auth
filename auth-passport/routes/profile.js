const router = require("express").Router();
const authCheck = require("../config/auth").authCheck;
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/", authCheck, (req, res) => {
  const { email, name, password } = req.user;
  res.render("profile", { email, name, password });
});

router.post("/", async (req, res) => {
  const currentEmail = req.user.email;
  // Check inputs
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
          console.log(email, currentEmail);

          User.update(
            { email: currentEmail },
            {
              $set: {
                name: name,
                email: email,
                password: hash,
                date: Date.now()
              }
            },
            { multi: true, new: true }
          ).catch(err => {
            reject(err);
          });

          console.log("User saved to Database");
          req.flash("success_msg", "You account was succesfully updated.");
          res.redirect(301, "/profile");
        }
      });
    });
  }
});

module.exports = router;
