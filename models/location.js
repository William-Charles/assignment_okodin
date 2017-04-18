"use strict";
module.exports = function(sequelize, DataTypes) {
  var Location = sequelize.define(
    "Location",
    {
      city: DataTypes.STRING,
      distance: DataTypes.INTEGER,
      profile_id: DataTypes.INTEGER
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
          Location.hasOne(models.Profile, {
            foreignKey: "location_id"
          });
        }
      }
    }
  );
  return Location;
};
