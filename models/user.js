"use strict";
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define(
    "User",
    {
      fname: DataTypes.STRING,
      lname: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      profile_id: DataTypes.INTEGER
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
          User.hasOne(models.Profile, {
            foreignKey: "user_id"
          });
        }
      }
    }
  );
  return User;
};
