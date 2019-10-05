const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/User");
const bcrypt = require("bcrypt");

passport.serializeUser((user, done) => {
  console.log("Serializing: " + user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("Deserializing..");
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    function(req, email, password, done) {
      // Find user by username/email or whatever you want to pass
      // Decrypt if you have hashed pass

      User.findOne({ email: email }).then(user => {
        if (!user) {
          done(null, false, req.flash("error_msg", "User does not exist"));
        } else {
          bcrypt.compare(password, user.password, (err, res) => {
            if (err) done(null, false, req.flash("error_msg", err));
            if (res) {
              done(null, user);
            } else {
              done(null, false, req.flash("error_msg", "Incorrect password"));
            }
          });
        }
      });
    }
  )
);
