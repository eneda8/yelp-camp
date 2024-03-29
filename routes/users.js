const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");

router.route("/register")
    .get(users.renderRegisterForm)
    .post(catchAsync(users.register));

router.route("/login")
    .get(users.renderLoginForm)
    .post(passport.authenticate("local", {failureFlash: "Incorrect username or password. Please try again.", failureRedirect: "/login", }), users.login);

router.get("/logout", users.logout)

module.exports = router;