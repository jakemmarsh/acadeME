'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {

  var User = sequelize.define('User', {
    email:            { type: DataTypes.STRING, unique: true, validate: { isEmail: true } },
    firstName:        { type: DataTypes.STRING, allowNull: false },
    lastName:         { type: DataTypes.STRING, allowNull: false },
    type:             { type: DataTypes.ENUM('student', 'instructor'), defaultValue: 'student' },
    imageUrl:         { type: DataTypes.STRING },
    hash:             { type: DataTypes.STRING },
    activationKey:    { type: DataTypes.STRING },
    passwordResetKey: { type: DataTypes.STRING }
  },
  {
    getterMethods: {
      fullName: function() {
        return this.getDataValue('firstName') + ' ' + this.getDataValue('lastName');
      }
    },
    hooks: {
      beforeValidate: function(user, model, cb) {
        if ( user.hash ) {
          bcrypt.hash(user.hash, 10, function(err, hash) {
            if ( err ) { throw err; }
            user.setDataValue('hash', hash);
            cb(null, user);
          });
        } else {
          cb('Unable to hash user\'s password.');
        }
      }
    },
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Course, { onDelete: 'cascade' });
        User.hasMany(models.Message, { onDelete: 'cascade' });
        User.hasMany(models.Enrollment, { foreignKey: 'UserId', onDelete: 'cascade' });
        User.hasMany(models.QuizCompletion, { onDelete: 'cascade' });
      }
    },
    instanceMethods: {
      toJSON: function() {
        // Delete private values from object before sending to client
        var res = this.get();
        delete res.hash;
        delete res.activationKey;
        delete res.passwordResetKey;
        return res;
      },
      verifyPassword: function(password, cb) {
        bcrypt.compare(password, this.getDataValue('hash'), cb);
      }
    }
  });

  return User;

};