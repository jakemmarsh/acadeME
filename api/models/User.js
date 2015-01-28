'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {

  var User = sequelize.define('User', {
    username:         { type: DataTypes.STRING, unique: true, allowNull: false },
    name:             { type: DataTypes.STRING },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    type:             { type: DataTypes.ENUM('student', 'instructor'), defaultValue: 'student' },
    imageUrl:         { type: DataTypes.STRING },
    hash:             { type: DataTypes.STRING },
    activationKey:    { type: DataTypes.STRING },
    passwordResetKey: { type: DataTypes.STRING },
  },
  {
    hooks: {
      beforeValidate: function(user, model, cb) {
        if ( user.password ) {
          bcrypt.hash(user.password, 10, function(err, hash) {
            if ( err ) { throw err; }
            user.setDataValue('hash', hash);
            cb(null, user);
          });
        } else {
          cb(null, user);
        }
      }
    },
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Course, { onDelete: 'cascade' });
        User.hasMany(models.Message, { onDelete: 'cascade' });
        User.hasMany(models.Enrollment, { onDelete: 'cascade' });
      }
    },
    instanceMethods: {
      toJSON: function() {
        // Delete hash from object before sending to frontend
        var res = this.values;
        delete res.hash;
        return res;
      },
      verifyPassword: function(password, cb) {
        bcrypt.compare(password, this.getDataValue('hash'), cb);
      }
    }
  });

  return User;

};