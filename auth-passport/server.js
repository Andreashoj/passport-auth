const passport = require("passport");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passportSetup = require("./config/passport-setup");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");
const app = express();

const PORT = 3000;

// View engine
app.set("view engine", "ejs");
app.use(expressLayouts);

// Connect to DB
const db = mongoose;
const mongoURI = require("./config/keys").mongoURI;
db.connect(
  mongoURI,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log("Connected to db...");
  }
);

// Access req object
app.use(express.urlencoded({ extended: false }));

// Passport middleware routes
const cookieSecret = require("./config/keys").cookieSecret;
app.use(
  session({
    resave: true,
    secret: cookieSecret,
    saveUninitialized: true,
    cookie: {
      secure: false
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variable
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./routes/login"));
app.use("/signup", require("./routes/signup"));
app.use("/index", require("./routes/index"));
app.use("/profile", require("./routes/profile"));
app.use("/logout", require("./routes/logout"));

// Host server on PORT
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
