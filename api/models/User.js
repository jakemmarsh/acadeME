'use strict';

module.exports = function(sequelize, DataTypes) {

  var User = sequelize.define('User', {
    username:        { type: DataTypes.STRING, unique: true, allowNull: false },
    name:            { type: DataTypes.STRING },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    type:            { type: DataTypes.ENUM('student', 'instructor'), defaultValue: 'student' },
    imageUrl:        { type: DataTypes.STRING },
    hash:            { type: DataTypes.STRING },
    activationKey:   { type: DataTypes.STRING },
    passwordRestKey: { type: DataTypes.STRING },
  },
  {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Course);
        User.hasMany(models.Message);
        User.hasMany(models.Enrollment);
      }
    }
  });

  return User;

};