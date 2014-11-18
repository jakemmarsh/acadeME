'use strict';

module.exports = function(sequelize, DataTypes) {

  var User = sequelize.define('User', {
    username:        { type: DataTypes.STRING, unique: true, allowNull: false },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    type:            { type: DataTypes.ENUM('student', 'instructor'), allowNull: false },
    imageUrl:        { type: DataTypes.STRING },
    hash:            { type: DataTypes.STRING },
    activationKey:   { type: DataTypes.STRING },
    passwordRestKey: { type: DataTypes.STRING },
  },
  {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Course);
        User.hasMany(models.Conversation); // TODO: is this necessary?
        User.hasMany(models.Message);
      }
    }
  });

  return User;

};