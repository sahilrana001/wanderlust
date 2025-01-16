const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js")
const asyncWrap = require("../utils/wrapAsync.js")
const User = require("../init/models/users.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../utils/loggedin.js");
const userController = require("../controller/users.js")

//sign up
router.route("/signup")
    .get(userController.signup)
    .post(userController.postSignup)

//login

router.route("/login")
    .get(userController.login)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        asyncWrap(userController.postLogin))


//logout

router.get("/logout", userController.logout)
module.exports = router;