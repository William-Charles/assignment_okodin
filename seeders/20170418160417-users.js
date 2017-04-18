"use strict";

var models = require("./../models");
const norseNames = require("norse-names");
const humanNames = require("node-random-name");

module.exports = {
  up: function(queryInterface, Sequelize) {
    var users = [];
    for (let i = 0; i < 20; i++) {
      let f = humanNames({ first: true, gender: "female" });
      let l = norseNames.random();

      users.push({
        fname: f,
        lname: l,
        username: `${f}${l}${i}`,
        email: `${f}${l}${i}@gmail.com`,
        gender: "female"
      });
    }

    for (let i = 0; i < 20; i++) {
      let f = humanNames({ first: true, gender: "male" });
      let l = norseNames.random();

      users.push({
        fname: f,
        lname: l,
        username: `${f}${l}${i}`,
        email: `${f}${l}${i}@gmail.com`,
        gender: "male"
      });
    }
    return queryInterface.bulkInsert("Users", users);
  },

  down: function(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete("Users", null, {}, models.User);
  }
};
