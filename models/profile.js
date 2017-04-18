"use strict";
module.exports = function(sequelize, DataTypes) {
  var Profile = sequelize.define(
    "Profile",
    {
      gender: DataTypes.STRING,
      age: DataTypes.INTEGER,
      location_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
          Profile.hasOne(models.User, {
            foreignKey: "profile_id"
          });
          Profile.hasOne(models.Location, {
            foreignKey: "profile_id"
          });
        }
      }
    }
  );
  return Profile;
};
