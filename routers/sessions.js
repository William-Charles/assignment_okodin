var url = require("url");
var express = require("express");
var router = express.Router();

module.exports = app => {
  // Auth
  app.use((req, res, next) => {
    var reqUrl = url.parse(req.url);
    if (
      !req.session.currentUser &&
      !["/", "/login", "/sessions", "/signup"].includes(reqUrl.pathname)
    ) {
      res.redirect("/login");
    } else {
      next();
    }
  });

  // New
  var onNew = (req, res) => {
    if (req.session.currentUser) {
      res.redirect("/users");
    } else {
      res.render("sessions/new");
    }
  };
  router.get("/", onNew);
  router.get("/login", onNew);

  router.get("/signup", (req, res) => {
    if (req.session.currentUser) {
      res.redirect("/users");
    } else {
      res.render("sessions/signup");
    }
  });

  // Create
  router.post("/sessions", (req, res) => {
    // User.findOne({
    //   username: req.body.username,
    //   email: req.body.email
    // })
    // .then((user) => {
    //   if (user) {
    req.session.currentUser = {
      username: req.body.username,
      email: req.body.email
      // id: user.id,
      // _id: user._id
    };
    res.redirect("/users");
    // } else {
    //   res.redirect('/login');
    // }
    // })
    // .catch((e) => res.status(500).send(e.stack));
  });

  // New account
  router.post("/sessions/signup", (req, res) => {
    var userParams = {
      fname: req.body.user.fname,
      lname: req.body.user.lname,
      email: req.body.user.email
    };
  });

  // Destroy
  var onDestroy = (req, res) => {
    req.session.currentUser = null;
    res.redirect("/login");
  };
  router.get("/logout", onDestroy);
  router.delete("/logout", onDestroy);

  return router;
};
