const flash = require("connect-flash/lib/flash");
var express = require("express");
var router = express.Router();
var usermodel = require("./users");
var postmodel = require("./post");
var cookie = require("cookie-parser");
var localStrategy = require("passport-local");
const Passport = require("passport");
const app = require("../app");
const localstrategy = require("passport-local");
const passport = require("passport");
const { Model } = require("mongoose");
var upload = require("./multer");
const post = require("./post");
const users = require("./users");
const change = require("./change");
passport.use(new localStrategy(usermodel.authenticate()));

router.get("/", async function (req, res) {
  res.render("register");
});
router.get("/login", function (req, res) {
  res.render("login", { error: req.flash("error") });
});
router.get("/home", isLoggedIn, async function (req, res) {
  var user = await usermodel.findOne({ username: req.session.passport.user });
  var post = await postmodel.find().populate("user");

  console.log(post);

  res.render("home", {user, post });
});
router.get("/edit", isLoggedIn, async function (req, res) {
  var user = await usermodel.findOne({ username: req.session.passport.user });

  res.render("edit", { user });
});
router.get("/feed", isLoggedIn, async function (req, res) {
  var user = await usermodel.findOne({
    username: req.session.passport.user,
  });
  var post = await postmodel.find().populate("user");

  res.render("feed", { user, post });
});

router.get("/profile", isLoggedIn, async (req, res) => {
  var user = await usermodel.findOne({ username: req.session.passport.user 

  })
  .populate('post');

  res.render("profile", { user });
});
router.get("/createpost", isLoggedIn, function (req, res) {
  res.render("createpost");
});

router.post("/uploads", isLoggedIn, upload.single("file"), async (req, res) => {
  if (!req.file) {
    console.log("No file uploaded");
    res.status(400).send({ message: "No file uploaded" });
  } else {
    var user = await usermodel.findOne({ username: req.session.passport.user });

    var post = await postmodel.create({
      image: req.file.filename,
      posttext: req.body.caption,
      user: user._id,
      location: req.body.location,
    });
    user.post.push(post._id);
    await user.save();
    res.redirect("/home");
  }
});
router.post("/change", isLoggedIn, upload.single("image"), async (req, res) => {
  if (!req.file) {
    console.log("No file uploaded");
    res.status(400).send({ message: "No file uploaded" });
  } else {
    var user = await usermodel.findOne({
      username: req.session.passport.user,
    });

    user.profileImage = req.file.filename;

    await user.save();

    res.redirect("/profile");
  }
});

router.post("/register", function (req, res) {
  var userdata = new usermodel({
    fullname: req.body.fullname,
    username: req.body.username,
    email: req.body.email,
  });
  usermodel
    .register(userdata, req.body.password)
    .then(function (registereduser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });
    });
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);
router.get("/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
router.post("/edit", isLoggedIn, async function (req, res) {
  var user = await usermodel.findOneAndUpdate(
    { username: req.session.passport.user },
    {
      username: req.body.username,
      fullname: req.body.fullname,
      bio: req.body.bio,
    },
    { new: true }
  );

  await user.save();
  console.log(user);
  res.redirect("/profile");
});
module.exports = router;
