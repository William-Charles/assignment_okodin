var url = require("url");
var express = require("express");
var router = express.Router();
const models = require("../models");
var sequelize = models.sequelize;
var { User, Profile, Location } = models;

module.exports = app => {
  // Auth
  app.use((req, res, next) => {
    var reqUrl = url.parse(req.url);
    if (
      !req.session.currentUser &&
      !["/", "/login", "/sessions", "/signup", "/sessions/signup"].includes(
        reqUrl.pathname
      )
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
    // Hoist variables to be used later
    var user;
    var profile;
    var location;

    // Filter params
    var userParams = {
      fname: req.body.fname,
      lname: req.body.lname,
      username: req.body.username,
      email: req.body.email
    };
    var profileParams = {
      age: req.body.age,
      gender: req.body.gender
    };
    var locationParams = {
      distance: req.body.distance,
      city: req.body.city
    };
    //transaction beginning
    sequelize.transaction(t => {
      // Don't create a user if
      // already exists
      return (
        User.findOrCreate({
          defaults: userParams,
          where: { email: userParams.email },
          transaction: t
        })
          // Array returned from findOrCreate
          // so must use `spread`
          .spread(result => {
            // Set user
            user = result;

            // Add userId to associated models
            profileParams.user_id = user.id;
            console.log(profileParams);

            // Find or create user profile
            return Profile.findOrCreate({
              defaults: profileParams,
              where: { user_id: user.id },
              transaction: t
            });
          })
          // Array returned so spread
          .spread(result => {
            // Set profile
            profile = result;

            // Set profileId for associations
            user.profile_id = profile.id;
            locationParams.profile_id = profile.id;

            // Update user with profileId
            return User.update(
              { profile_id: profile.id },
              {
                where: { id: user.id },
                limit: 1,
                transaction: t
              }
            );
          })
          .then(() => {
            // Set address profileId
            locationParams.profile_id = profile.id;

            // Find or create address
            return Location.findOrCreate({
              defaults: locationParams,
              where: { profile_id: profile.id },
              transaction: t
            });
          })
          // Array returned so spread
          .spread(result => {
            // Set address
            location = result;

            return Profile.update(
              { location_id: location.id },
              {
                where: { id: profile.id },
                limit: 1,
                transaction: t
              }
            );
          })
          .then(result => {
            req.flash("success", "User created!");
            req.session.currentUser = {
              username: req.body.username,
              email: req.body.email
              // id: user.id,
              // _id: user._id
            };
            res.redirect("/users");
          })
          .catch(e => {
            console.log("catch is being hit--------");
            if (e.errors) {
              e.errors.forEach(err => req.flash("error", err.message));
              res.render("sessions/signup");
            } else {
              res.status(500).send(e.stack);
            }
          })
      );
    });

    //transaction end
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
