var express = require("express");
var router = express.Router();
var models = require("./../models");
var User = models.User;
var sequelize = models.sequelize;
var { User, Profile, Location } = models;

// ----------------------------------------
// Index
// ----------------------------------------

router.get("/", (req, res) => {
  res.render("search/index");
});

router.post("/", (req, res) => {
  req.session.currentUser.email;
  let dis = req.body.distance;
  let low = dis - 10;
  let high = dis + 10;
  User.findAll({
    include: [
      {
        all: true,
        include: [
          {
            model: Location,
            where: {
              distance: { lt: high, gt: low }
            }
          }
        ]
      }
    ]
  })
    .then(users => {
      console.log(users);
      res.render("search/results", { users });
    })
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;

// User.findAll({
//   include: [
//     {
//       all: true,
//       include: [{ all: true }]
//     }
//   ]
// })
//   .then(users => {
//     console.log(users);
//     res.render("users/index", { users });
//   })
//   .catch(e => res.status(500).send(e.stack));
